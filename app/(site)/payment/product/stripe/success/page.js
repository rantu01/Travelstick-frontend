'use client';
import PaymentSuccess from "@/app/(site)/paymentSuccess/page";
import { useI18n } from "@/app/contexts/i18n";
import { confirmProductPayments } from "@/app/helper/backend";
import { useEffect, useState } from "react";

const PaymentSuccessStripe = () => {
  const i18n = useI18n();
  const [session, setSession] = useState(null);
  const method = "stripe";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSession(params.get("session_id"));
    }
  }, [i18n]);

  useEffect(() => {
    const confirmOrderFunc = async () => {
      if (session) {
        await confirmProductPayments({ body: { session: session, method } });
      }
    };

    confirmOrderFunc();
  }, [i18n, session]);
  return (
    <div className="travel-container">
      <PaymentSuccess />
    </div>
  );
};

export default PaymentSuccessStripe;