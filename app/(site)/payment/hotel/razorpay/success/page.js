'use client';
import PaymentSuccess from "@/app/(site)/paymentSuccess/page";
import { updateRazorpayPaymentStatus } from "@/app/helper/backend";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PackagePaymentSuccessRazorpay = () => {
  const params = useSearchParams();
  const razorpay_payment_id = params.get("razorpay_payment_id");
  useEffect(() => {
    if (razorpay_payment_id) {
      updateRazorpayPaymentStatus({
        body: {
          razorpay_payment_id: razorpay_payment_id,
        }
      });
    }
  }, [razorpay_payment_id]);
  return (
    <div className="travel-container">
      <PaymentSuccess />
    </div>
  );
};

export default PackagePaymentSuccessRazorpay;