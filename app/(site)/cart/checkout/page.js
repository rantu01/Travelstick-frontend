"use client";
import FormInput from "@/app/components/form/input";
import CheckOutCard from "@/app/components/site/common/card/checkoutCard";
import Banner from "@/app/components/site/common/component/Banner";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import {
  fetchCart,
  fetchCartCalculation,
  fetchPublicSettings,
  orderProduct,
} from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { Form, message, Modal, Radio } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";
const CheckOut = () => {
  const i18n = useI18n();
  const { currency_symbol } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [form] = Form.useForm();
  const [calculatedPrice, getCalculatedPrice] = useFetch(fetchCartCalculation);
  const [cartData, getCartData] = useFetch(fetchCart);
  const [data] = useFetch(fetchPublicSettings);
  const deliveryCharge = data?.delivery_charge || 0;
  const isProduct = data?.is_product_module;
  useEffect(() => {
    getCartData();
    getCalculatedPrice();
  }, []);

  const router = useRouter();
  useEffect(() => {
    if (isProduct === false) {
      router.push("/404");
    }
  }, [isProduct, router]);
  const handlePayment = async () => {
    const payload = {
      method: paymentMethod,
    };
    const response = await orderProduct({ body: payload });

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
    <section>
      <Banner title="Checkout" />
      <div className="travel-container mt-12 md:mt-16 lg:mt-20 xl:mt-24">
        <h4 className="heading-3 text-[#05073C] mb-6">{i18n.t("Checkout")}</h4>
        <Form  layout="vertical" form={form}>
          <div className="mt-8 flex flex-col md:flex-row gap-3 lg:gap-5">
            <div className="w-full md:w-[60%]">
              <div className="rounded-[10px] lg:rounded-[20px] -mt-6">
                <div className="!space-y-8">
                  <h1 className="description-1 mt-2 -mb-4">{i18n.t("Note")}</h1>
                  <FormInput
                    name="note"
                    placeholder="Write something..."
                    // label="Note"
                    type="text"
                    textArea
                    className="w-full h-52 rounded-[10px] lg:rounded-[20px] bg-transparent p-3 dashinput"
                  />
                  <div className="mt-6">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-primary common-btn"
                    >
                      {i18n.t("Pay Now")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[40%]">
              <div className="border rounded-[10px] lg:rounded-[20px] mt-5">
                <button
                  type="button"
                  onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                  className="w-full border-b flex items-center justify-between p-3 md:p-4 lg:p-5 xl:p-6 heading4 font-medium"
                >
                  <p className="description-3">{i18n.t("Order Summary")}</p>
                  <p>
                    {isSummaryOpen ? <IoCaretUpSharp /> : <IoCaretDownSharp />}
                  </p>
                </button>
                {isSummaryOpen && (
                  <div>
                    {cartData?.docs?.map((data, index) => (
                      <div key={index} className="border-b last:border-0">
                        <CheckOutCard data={data} />
                      </div>
                    ))}
                  </div>
                )}
                <div className=" flex flex-col gap-3 p-3 md:p-4 lg:p-5 xl:p-6 font-normal">
                  <div className="description-2 flex justify-between">
                    <p >{i18n.t("Sub Total")}</p>
                    <p>
                      {currency_symbol}
                      {calculatedPrice?.toFixed(2) -
                        deliveryCharge?.toFixed(2) || 0}
                    </p>
                  </div>
                  <div className="description-2 flex justify-between">
                    <p>{i18n.t("Delivery Charge")}</p>
                    <p>
                      {currency_symbol}
                      {deliveryCharge?.toFixed(2) || 10}
                    </p>
                  </div>
                </div>
                <div className="description-2 flex justify-between p-3 heading2 font-semibold text-primary bg-[#f2f8ff] rounded-b-[20px]">
                  <p>{i18n.t("Total Amount")}</p>
                  <p>
                    {currency_symbol}
                    {typeof calculatedPrice === "number"
                      ? calculatedPrice?.toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
      <Modal
        title={i18n.t("Select Payment Method")}
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
        <button
          className="xl:mt-8 lg:mt-6 mt-5 w-full bg-[#14634E] text-white common-btn"
          onClick={handlePayment}
        >
          {i18n.t("Pay Now")}
        </button>
      </Modal>
    </section>
  );
};

export default CheckOut;
