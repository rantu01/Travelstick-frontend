"use client";
import PaymentSuccess from "@/app/(site)/paymentSuccess/page";

// import { updatePaypalPaymentStatus } from "@/app/helper/backend";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PaymentSuccessPaypal = () => {
  const params = useSearchParams();
    const paymentId = params.get("paymentId");
    const PayerID = params.get("PayerID");
    useEffect(() => {
      if (paymentId && PayerID) {
        updatePayment({
          body: {
            paymentId: paymentId,
            PayerID: PayerID,
          }
        });
      }
    }, [paymentId, PayerID]);

  return (
    <div className="travel-container">
      <PaymentSuccess />
    </div>
  );
};

export default PaymentSuccessPaypal;
