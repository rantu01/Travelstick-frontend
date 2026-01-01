"use client";
import Button from "@/app/(dashboard)/components/common/button";
import ShopCart from "@/app/components/site/common/card/shopCart";
import Banner from "@/app/components/site/common/component/Banner";
import { useCart } from "@/app/contexts/cartContext";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import { fetchPublicSettings } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { Empty } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Cart = () => {
  const { cart, calculatedPrice } = useCart();
  const [data] = useFetch(fetchPublicSettings);
  const isProduct = data?.is_product_module;
  const i18n = useI18n();
  const router = useRouter();
  useEffect(() => {
    if (isProduct === false) {
      router.push("/404");
    }
  }, [isProduct, router]);
  
  const deliveryCharge = data?.delivery_charge || 0;
  const { currency_symbol } = useCurrency();

  return (
    <section>
      <Banner title="cart" />
      <div className="travel-container mt-12 md:mt-16 lg:mt-20 xl:mt-24">
        <h4 className="heading-3 text-[#05073C]">{i18n.t("Cart")}</h4>
        <div className="mt-8 md:mt-10 lg:mt-12 xl:mt-14 flex flex-col md:flex-row gap-3 lg:gap-5 xl:gap-8">
          <div className="w-full md:w-[60%]">
            <div className="border rounded-[20px]">
              <div className="flex items-center justify-between description-3 border-b">
                <p className="p-3 md:p-4 lg:p-5 xl:p-6">{i18n.t("Items")}</p>
                <p className="p-3 md:p-4 lg:p-5 xl:p-6">{i18n.t("Action")}</p>
              </div>
              <div>
                {cart?.docs?.length > 0 ? (
                  cart?.docs?.map((item, index) => (
                    <div key={index} className="border-b last:border-0">
                      <ShopCart data={item} />
                    </div>
                  ))
                ) : (
                  <Empty
                    className="description"
                    description={i18n.t("No items found")}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-[40%]">
            <div className="border rounded-[20px]">
              <div className="border-b">
                <p className="p-3 md:p-4 lg:p-5 xl:p-6 description-3">
                  {i18n.t("Order Summary")}
                </p>
              </div>
              <div className="description-2 flex flex-col gap-3 p-3 md:p-4 lg:p-5 xl:p-6 font-normal">
                <div className="flex justify-between">
                  <p>{i18n.t("Sub Total")}</p>
                  <p>
                    {currency_symbol}
                    {calculatedPrice?.toFixed(2) - deliveryCharge?.toFixed(2) ||
                      0}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>{i18n.t("Delivery Charge")}</p>
                  <p>
                    {currency_symbol}
                    {deliveryCharge?.toFixed(2) || 10}
                  </p>
                </div>
                <div className="flex justify-between  border-t border-primary/30">
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
            <Link href="/cart/checkout">
              <Button className="mt-5 md:mt-6 lg:mt-8 xl:mt-10 common-btn  w-full">
                {i18n.t("Proceed to Checkout")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
