'use client';
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import Link from "next/link";

const PaymentFailed = () => {
  const i18n = useI18n();
  return (
    <div className="travel-container my-12">
      <div className="flex flex-col items-center justify-center">
        <div className="text-center ">
          <Image
            width={700}
            height={500}
            src='/inner/fail.gif'
            alt="Payment success"
            className="w-[300px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-[200px] md:h-[300px] lg:h-[400px] xl:h-[500px] mb-6 !object-contain mx-auto"
          />
          <h1 className="heading-2 text-red-600 mb-4">{i18n.t("Payment Failed")}</h1>
          <p className="text-gray-600 description-1 mb-6">
            {i18n.t("Your payment has been failed.")}
          </p>
          <Link href="/" passHref className="common-btn  text-white bg-red-600 hover:bg-red-600/80 transition-all duration-300">
            {i18n.t("Back To Homepage")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailed;