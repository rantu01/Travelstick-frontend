
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import { getStatusClass } from "@/app/helper/utils";
import { Image, Modal } from "antd";
import dayjs from "dayjs";
const ProductOrderModal = ({ viewModalOpen, setViewModalOpen, viewData, setViewData }) => {
  const { currency_symbol } = useCurrency();
  const {langCode} = useI18n();
  const i18n = useI18n();
  return (
    <div>
      <Modal
        className=""
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false), setViewData(null);
        }}
        footer={null}
        destroyOnClose
        width={800}
        centered
      >
        {viewData && (

          <div className="modal-wrapper">
            <div className="mt-8">
              <h2 className="heading-4 mb-6 text-[#05073C]">
                {i18n.t("Order Details")}
              </h2>
              {/* Order Details Table */}
              <table className="w-full text-left text-[#C7D1DA] mt-6">
                <tbody>
                  {[
                    { label: "Order Id", value: viewData?.order_id },
                    { label: "Product Price", value: `${currency_symbol} ${viewData?.amount}` },
                    { label: "Order Date", value: dayjs(viewData?.createdAt).format("DD MMM YYYY") },
                    { label: "Order Status", value: viewData?.status },
                    { label: "User Name", value: viewData?.user?.name },
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
                        {item.label}
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
                      { item?.thumb_image && (
                                              <Image
                        src={item?.thumb_image}
                        alt={item?.name}
                        width={100}
                        height={100}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      )
                    }
                    { item?.product?.thumb_image && (
                                              <Image
                        src={item?.product?.thumb_image}
                        alt={item?.name}
                        width={100}
                        height={100}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      )
                    }


                      <div>
                        {item?.product?.name && <p className="font-medium text-[#05073C]">{item?.product?.name}</p>}
                        {item?.name && <p className="font-medium text-[#05073C]">Name:{item?.name}</p> }
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
  );
}

export default ProductOrderModal;

