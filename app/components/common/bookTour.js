'use client'
import { message, Modal, Radio } from "antd";
import { FaCalendarMinus, FaCalendarPlus } from "react-icons/fa6";
import CounterButton from "../btn/counterButton";
import FormCheckbox from "../form/checkbox";
import { useI18n } from "@/app/contexts/i18n";
import dayjs from "dayjs";
import { useCurrency } from "@/app/contexts/site";
import { useFetch } from "@/app/helper/hooks";
import { createPackageBookingPayment, getAllPublicPackageServices, postPackageBookingCalculation } from "@/app/helper/backend";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "../site/common/component/authModal";
const BookTour = ({ data, user }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [initialPrice, setInitialPrice] = useState(0)
  const [count, setCount] = useState(1);
  const { currency_symbol } = useCurrency();
  const [packageService] = useFetch(getAllPublicPackageServices);
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [selectedServices, setSelectedServices] = useState([]);
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
        },
      });
      if (packageData?.success) {
        setInitialPrice(packageData?.data);
      }
    };
    if (data?._id) {
      fetchInitialPrice();
    }
  }, [data?._id]);

  const router = useRouter();
  const handlePayment = async () => {
    const payload = {
      package: data?._id,
      person: count,
      amount: initialPrice,
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

  return (
    <div className="w-full relative ">
      <div className="w-full ">
        <div className="shadow-lg rounded-[10px] lg:rounded-[20px] border-b w-full bg-white">
          <div className="rounded-t-[10px] lg:rounded-t-[20px] border xl:p-[30px] lg:p-6 md:p-5 sm:p-4 p-3 bg-[#FEF5EE]">
            <h3 className="heading-3">
              {i18n.t("Book This Tour")}
            </h3>
          </div>
          <div className="xl:m-6 lg:m-5 md:m-4 m-3 rounded-[10px] lg:rounded-[20px] border">
            <div className="flex justify-between items-center">
              <div className="border-r flex-1 lg:p-4 md:p-3 p-2">
                <div className="flex items-center md:gap-2 gap-1 ">
                  <FaCalendarPlus className="text-[#05073C]" />
                  <p className="description-4 !font-semibold text-[#05073C]">{i18n.t("Check In")}</p>
                </div>
                <p className="lg:mt-3 mt-2 description-4 text-[#05073C]">{dayjs(data?.check_in).format("DD MMMM YYYY")}</p>
              </div>
              <div className="flex-1 lg:p-4 md:p-3 p-2">
                <div className="flex items-center md:gap-2 gap-1 ">
                  <FaCalendarMinus className="text-[#05073C]" />
                  <p className="description-4 !font-semibold text-[#05073C]">{i18n.t("Check Out")}</p>
                </div>
                <p className="lg:mt-3 mt-2 description-4 text-[#05073C]">{dayjs(data?.check_out).format("DD MMMM YYYY")}</p>
              </div>
            </div>
            <div className="border-t ">
              <div className="border-r flex-1 lg:p-4 md:p-3 p-2">
                <div className="">
                  <p className="description-1 text-[#05073C]">{i18n.t("Children")}</p>
                  <p className="description-4 text-[#05073C] mt-2">{i18n.t("1 child")}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-4 xl:p-6 lg:p-5 md:p-4 p-3">
            <h3 className="description-3 !font-semibold !font-montserrat">{i18n.t("Tickets")}</h3>
            <div className="flex justify-between items-center xl:mt-6 lg:mt-5 md:mt-4 mt-4">
              <p className="description-1 text-[#717171]">
                Adult (18+ years)
                <span className="text-[#05073C] !font-bold pl-2">{currency_symbol}{data?.current_price}</span>
              </p>
              <div>
                <CounterButton selectedServices={selectedServices} count={count} setCount={setCount} id={data?._id} postPackageBookingCalculation={postPackageBookingCalculation} initialPrice={initialPrice} setInitialPrice={setInitialPrice} />
              </div>
            </div>
            <div className="xl:mt-8 lg:mt-7 md:mt-6 mt-4">
              <h3 className="description-3 !font-semibold !font-montserrat">{i18n.t("Extra Services")}</h3>
              {
                packageService?.map((item, index) => {
                  return (
                    <div key={index} className="flex items-center justify-between lg:mt-4 md:mt-3 mt-2 package">
                      <FormCheckbox
                        name={item?.title?.[langCode]}
                        label={item?.title?.[langCode]}
                        onChange={handlePackageServicePrice(item?._id)}
                      />
                      <p className="description-1 text-[#05073C] !font-bold">{currency_symbol}{item?.price}</p>
                    </div>
                  );
                })
              }
            </div>
            <div className="flex justify-center items-center xl:mt-6 lg:mt-5 md:mt-4 mt-4 gap-1">
              <p className="description-1 text-[#05073C] !font-bold">{i18n.t("Total Price")}: </p>
              <p className="heading-3 text-primary">{currency_symbol}{initialPrice.toFixed(2)}</p>
            </div>
            <div className="xl:mt-14 lg:mt-10 md:mt-8 mt-6">
              <button onClick={() => {
                if (user) {
                  setIsModalOpen(true)
                } else {
                  setAuthModalOpen(true)
                }
              }} className="bg-primary common-btn text-white w-full">
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
      </Modal>
      <AuthModal authModalOpen={authModalOpen} slug={`/package/${data?._id}`} setAuthModalOpen={setAuthModalOpen} />
    </div>
  )
}

export default BookTour;