"use client";
import React, { useEffect } from "react";
import { ConfigProvider, Form, Tabs } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import StripePaymentMethod from "@/app/(dashboard)/components/common/payment/stripe";
import PaypalPaymentMethod from "@/app/(dashboard)/components/common/payment/paypal";
import { useFetch } from "@/app/helper/hooks";
import { fetchSettings } from "@/app/helper/backend";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import RazorpayPaymentMethod from "@/app/(dashboard)/components/common/payment/razorpay";

const PaymentSettings = () => {
  const i18n = useI18n();
  const [form] = Form.useForm();
  const [paymentsettings, getPaymentSettings] = useFetch(fetchSettings);

  useEffect(() => {
    if (paymentsettings) {
      form.setFieldsValue({
        ...paymentsettings,
      });
    }
  }, [paymentsettings]);

  const tabItems = [
    {
      label: "Stripe",
      key: "1",
      children: (
        <StripePaymentMethod
          settings={paymentsettings}
          getSettings={getPaymentSettings}
        />
      ),
    },
    {
      label: "PayPal",
      key: "2",
      children: (
        <PaypalPaymentMethod
          settings={paymentsettings}
          getSettings={getPaymentSettings}
        />
      ),
    },
    {
        label: "Razorpay",
        key: "3",
        children: (
          <RazorpayPaymentMethod
            settings={paymentsettings}
            getSettings={getPaymentSettings}
          />
        ),
      },
  ];

  return (
    <>
      <div className="w-full overflow-x-auto mt-7 dashboardModal">
      <div className=" rounded dashboardInput mx-8 bg-white">
      <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">Payment Settings</h1>
            <BackButton />
          </div>
          <div className=" p-4 rounded emailTab !text-[#05073C] ">
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    itemActiveColor: "#000",
                    itemSelectedColor: "#6366f1",
                    itemHoverColor: "#6366f1",
                  },
                },
              }}
            >
              <Tabs
                type="card"
                defaultActiveKey="1"
                centered
                tabBarStyle={{ color: "#000", fontWeight: "bold" }}
                items={tabItems}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSettings;

