
"use client";

import { Confetti } from "@/app/components/ui/success";
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import Link from "next/link";

const PaymentSuccess = () => {
  const i18n = useI18n();

  return (
    <div>
      <Confetti className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none" />
      <div className="mx-auto my-12 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">
            <Image
              width={700}
              height={500}
              src="/theme1/payment/success.gif"
              alt="Payment success"
              className="w-[300px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-[200px] md:h-[300px] lg:h-[400px] xl:h-[500px] mb-6 !object-contain mx-auto"
            />
            <h1 className="heading-2 text-green-600 mb-4">
              {i18n.t("Payment Successful")}
            </h1>
            <p className="text-gray-600 description-1 mb-6">
              {i18n.t("Your payment has been successfully processed.")}
            </p>
            <Link
              href="/user"
              className="common-btn text-white bg-primary hover:bg-primary/80 transition-all duration-300"
            >
              {i18n.t("Back to Dashboard")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
