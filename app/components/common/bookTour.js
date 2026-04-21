'use client'
import { message, Modal, Radio, DatePicker } from "antd";
import { FaCalendarMinus, FaCalendarPlus } from "react-icons/fa6";
import CounterButton from "../btn/counterButton";
import FormCheckbox from "../form/checkbox";
import { useI18n } from "@/app/contexts/i18n";
import dayjs from "dayjs";
import { useCurrency } from "@/app/contexts/site";
import { useFetch } from "@/app/helper/hooks";
import { createPackageBookingPayment, getAllPublicPackageServices, postPackageBookingCalculation } from "@/app/helper/backend";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "../site/common/component/authModal";

const toDateKey = (value) => dayjs(value).format("YYYY-MM-DD");

const BookTour = ({ data, user }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [initialPrice, setInitialPrice] = useState(0)
  const [count, setCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState(data?.check_in ? dayjs(data?.check_in) : null);
  const { formatPrice } = useCurrency();
  const [packageService] = useFetch(getAllPublicPackageServices);
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [selectedServices, setSelectedServices] = useState([]);
  const availableDateKeys = useMemo(() => {
    if (!Array.isArray(data?.available_dates)) return new Set();
    return new Set(data.available_dates.filter(Boolean).map((date) => toDateKey(date)));
  }, [data?.available_dates]);

  const ensureUserCanBook = () => {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
    if (!hasToken || !user) {
      setIsModalOpen(false);
      setAuthModalOpen(true);
      message.error(i18n.t('Please login to continue.'));
      return false;
    }

    return true;
  };

  const handlePackageServicePrice = (serviceId) => async (e) => {
    const checked = e.target.checked;
    let updatedServices;
    if (checked) {
      updatedServices = [...selectedServices, serviceId];
    } else {
      updatedServices = selectedServices.filter(id => id !== serviceId);
    }
    setSelectedServices(updatedServices);

    const packageData = await postPackageBookingCalculation({
      body: {
        package: data?._id,
        person: count,
        services: updatedServices,
        ...(selectedDate && { date: selectedDate.format("YYYY-MM-DD") }),
      },
    });

    if (packageData?.success) {
      setInitialPrice(packageData?.data);
    }
  };

  useEffect(() => {
    const fetchInitialPrice = async () => {
      const packageData = await postPackageBookingCalculation({
        body: {
          package: data?._id,
          person: 1,
          ...(selectedDate && { date: selectedDate.format("YYYY-MM-DD") }),
        },
      });
      if (packageData?.success) {
        setInitialPrice(packageData?.data);
      }
    };
    if (data?._id) {
      fetchInitialPrice();
    }
  }, [data?._id, selectedDate]);

  useEffect(() => {
    const fallbackDate = data?.check_in ? dayjs(data?.check_in) : null;

    if (Array.isArray(data?.available_dates) && data.available_dates.length > 0) {
      const firstAvailableDate = data.available_dates[0] ? dayjs(data.available_dates[0]) : null;
      setSelectedDate(firstAvailableDate || fallbackDate);
      return;
    }

    setSelectedDate(fallbackDate);
  }, [data?.available_dates, data?.check_in]);

  const disabledDate = (current) => {
    if (!current) return false;
    if (current < dayjs().startOf('day')) return true;

    if (availableDateKeys.size > 0) {
      return !availableDateKeys.has(current.format("YYYY-MM-DD"));
    }

    return false;
  };

  const router = useRouter();
  const handlePayment = async () => {
    if (!ensureUserCanBook()) {
      return;
    }

    if (availableDateKeys.size > 0 && !selectedDate) {
      message.error(i18n.t("Please select an available date."));
      return;
    }

    if (
      selectedDate &&
      availableDateKeys.size > 0 &&
      !availableDateKeys.has(selectedDate.format("YYYY-MM-DD"))
    ) {
      message.error(i18n.t("Selected date is not available."));
      return;
    }

    const payload = {
      package: data?._id,
      person: count,
      amount: initialPrice,
      ...(selectedDate && { date: selectedDate.format('YYYY-MM-DD') }),
      method: paymentMethod,
      ...(selectedServices.length > 0 && { services: selectedServices })
    };
    const response = await createPackageBookingPayment({ body: payload });

    if (response?.success) {
      if (response?.data?.url) {
        router.push(response.data.url);
      } else {
        message.error("Payment URL not received. Please try again.");
      }
      setIsModalOpen(false);
    } else {
      message.error(response?.errorMessage || "Payment failed.");
    }
  };

  const handleBookWithoutPayment = async () => {
    if (!ensureUserCanBook()) {
      return;
    }

    if (availableDateKeys.size > 0 && !selectedDate) {
      message.error(i18n.t("Please select an available date."));
      return;
    }

    if (
      selectedDate &&
      availableDateKeys.size > 0 &&
      !availableDateKeys.has(selectedDate.format("YYYY-MM-DD"))
    ) {
      message.error(i18n.t("Selected date is not available."));
      return;
    }

    const payload = {
      package: data?._id,
      person: count,
      amount: initialPrice,
      ...(selectedDate && { date: selectedDate.format('YYYY-MM-DD') }),
      // TEMP DIRECT BOOKING FLOW: backend treats cash/without_payment as direct booking.
      method: 'cash',
      without_payment: true,
      ...(selectedServices.length > 0 && { services: selectedServices })
    };

    const response = await createPackageBookingPayment({ body: payload });

    if (response?.success) {
      message.success(i18n.t('Booking successful'));
      setIsModalOpen(false);
      try {
        if (user?.role === 'admin' || user?.role === 'employee') {
          router.push('/admin/packageManagement/packageBooking');
        } else {
          router.push('/user/packageBooking');
        }
      } catch (e) {
        // ignore navigation errors
      }
    } else {
      message.error(response?.errorMessage || i18n.t('Booking failed'));
    }
  };

  return (
    <div className="w-full relative ">
      <div className="w-full ">
        <div className="shadow-lg rounded-[10px] lg:rounded-[20px] border-b w-full bg-white">
          <div className="xl:m-6 lg:m-5 md:m-4 m-3 rounded-[10px] lg:rounded-[20px] border">
            <div className="flex justify-between items-center">
              <div className="border-r flex-1 lg:p-4 md:p-3 p-2">
                <div className="flex items-center md:gap-2 gap-1 ">
                  <FaCalendarPlus className="text-[#05073C]" />
                  <p className="description-4 !font-semibold text-[#05073C]">{i18n.t("Date")}</p>
                </div>
                <div className="lg:mt-3 mt-2">
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    format="DD MMMM YYYY"
                    className="w-full"
                    disabledDate={disabledDate}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-4 xl:p-6 lg:p-5 md:p-4 p-3">
            {/* <div className="flex justify-center items-center xl:mt-6 lg:mt-5 md:mt-4 mt-4 gap-1">
              <p className="description-1 text-[#05073C] !font-bold">{i18n.t("Total Price")}: </p>
              <p className="heading-3 text-primary">{formatPrice(initialPrice)}</p>
            </div> */}
            <div className="xl:mt-14 lg:mt-10 md:mt-8 mt-6">
              <button onClick={() => {
                if (ensureUserCanBook()) {
                  setIsModalOpen(true)
                }
              }} className="w-full bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-70">
                {i18n.t("Book Now")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Select Payment Method"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          className="flex flex-col gap-3"
        >
          <Radio value="stripe">Stripe</Radio>
          <Radio value="paypal">PayPal</Radio>
          <Radio value="razorpay">Razorpay</Radio>
        </Radio.Group>
        <button className="xl:mt-8 lg:mt-6 mt-5 w-full bg-[#14634E] text-white common-btn"
          onClick={handlePayment}>
          {i18n.t('Pay Now')}
        </button>
        <button className="xl:mt-3 lg:mt-2 mt-2 w-full border border-gray-300 text-[#05073C] bg-white common-btn"
          onClick={handleBookWithoutPayment}>
          {/* TEMP FLOW (HIGH VISIBILITY): this bypasses online payment and places booking directly. */}
          {i18n.t('Book Now Without Payment')}
        </button>
      </Modal>
      <AuthModal authModalOpen={authModalOpen} slug={`/package/${data?._id}`} setAuthModalOpen={setAuthModalOpen} />
    </div>
  )
}

export default BookTour;