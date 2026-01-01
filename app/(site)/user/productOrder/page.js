"use client";
import UserTable from "@/app/(dashboard)/components/common/userTable";
import { useI18n } from "@/app/contexts/i18n";
import { getAllProductList } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { getStatusClass } from "@/app/helper/utils";
import { Empty, Image, Modal } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs'
import { useCurrency } from "@/app/contexts/site";
const ProductOrder = () => {
  let { languages, langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getAllProductList);
  const [selectedLang, setSelectedLang] = useState(undefined);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const i18n = useI18n();
  const { currency_symbol } = useCurrency();
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  const handleView = (value) => {
    setViewModalOpen(true)
    setViewData(value)
  }
  const columns = [
    {
      text: "Order ID",
      dataField: "order_id",
    },
    {
      text: 'Amount',
      dataField: 'amount',
      formatter: (value) => (
        <p> {currency_symbol} {value}</p>
      )
    },
    {
      text: "Order Date",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    {
      text: "Payment Status",
      dataField: "payment",
      formatter: (value) => (
        <span className={getStatusClass(value?.status)}>
          {value?.status ? value?.status : 'N/A'}
        </span>
      )
    },
    {
      text: "Payment Method",
      dataField: "payment",
      formatter: (value) => (
        <span className="capitalize">{value?.method}</span>
      )
    },
    {
      text: "Order Status",
      dataField: "status",
      formatter: (value) => (
        <span className={getStatusClass(value)}>
          {value ? value : 'N/A'}
        </span>
      )
    },
  ];
  return (
    <div className="w-full overflow-x-auto">
      <div className="">
        <h4 className={`description-3 mb-6 text-[#05073C]`}>{i18n.t("Product Orders")}</h4>
        {
          data?.docs?.length > 0 ? (
            <UserTable
              columns={columns}
              data={data}
              loading={loading}
              onReload={getData}
              onView={handleView}
              indexed
              langCode={langCode}
              pagination
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={i18n.t("No product orders found")} />
          )
        }
        {/* view modal  */}
        <Modal
          className=""
          open={viewModalOpen}
          onCancel={() => { setViewModalOpen(false), setViewData(null) }}
          footer={null}
          destroyOnClose
          width={800}
          centered
        >
          {viewData && (
            <div className="modal-wrapper">
              <div className="mt-8">
                <h2 className="description-3 mb-6 text-[#05073C]">{i18n.t("Order Details")}</h2>
                <table className="w-full text-left text-[#C7D1DA] mt-6">
                  <tbody>
                    {[
                      { label: "Order Id", value: viewData?.order_id },
                      { label: "Product Price", value: `${currency_symbol} ${viewData?.amount}` },
                      { label: "Order Date", value: dayjs(viewData?.createdAt).format("DD MMM YYYY") },
                      { label: "Order Status", value: viewData?.status },
                      { label: "Payment Method", value: viewData?.payment?.method },
                      { label: "Payment Status", value: viewData?.payment?.status },
                      { label: "Transaction Id", value: viewData?.payment?.transaction_id },
                      { label: "Delivery Charge", value: `${currency_symbol} ${viewData?.delivery_charge}` },
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className={index < 20 ? "border border-gray-200" : ""}
                      >
                        <td className="py-2 px-4 description-2 text-[#05073C] whitespace-pre">
                          {i18n.t(item.label)}
                        </td>
                        <td className={`${getStatusClass(item.value)} py-2 px-4 my-1 description-1 text-[#717171] capitalize`}>
                          {item.value || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-10">
                  <h3 className="heading-4 mb-4 text-[#05073C]">
                    {i18n.t("Products")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewData?.products?.map((item, idx) => (
                      <div
                        key={item._id || idx}
                        className="flex items-center gap-4 border p-4 rounded-md"
                      >
                        {
                          item?.thumb_image && (
                            <Image
                              src={item?.thumb_image}
                              alt={item?.name}
                              width={100}
                              height={100}
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                          )
                        }
                        <div>
                          <p className="font-medium text-[#05073C]">Name:{item?.name}</p>
                          <p className="text-sm text-[#717171]">Quantity: {item?.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ProductOrder;
