import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import { getStatusClass } from "@/app/helper/utils";
import { Image, Modal } from "antd";
import dayjs from "dayjs";
const PackageBookingModal = ({
  viewModalOpen,
  setViewModalOpen,
  viewData,
  setViewData,
  slug = "admin",
}) => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const { currency_symbol } = useCurrency();
  return (
    <div className="w-full overflow-x-auto">
      <Modal
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
            <div className="mt-4">
              <h2 className="text-[#05073C] heading-3 text-center">
                {i18n.t("Package Booking Details")}
              </h2>
              <div className="mt-4 flex gap-5">
                {(viewData?.package?.banner_image ||
                  viewData?.package?.card_image) && (
                  <div className="">
                    <p className="text-[#05073C] description-2">
                      {i18n.t("Package Image")}:
                    </p>

                    <Image
                      src={
                        viewData?.package?.banner_image ||
                        viewData?.package?.card_image
                      }
                      width={200}
                      height={100}
                      alt="image"
                    />
                  </div>
                )}
                {slug === "admin" && (
                  <div className="">
                    {viewData?.user?.image && (
                      <div>
                        <p className="text-[#05073C] description-2">
                          {i18n.t("User Image")}:
                        </p>
                        <Image
                          src={viewData?.user?.image}
                          width={100}
                          height={100}
                          alt="image"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <table className="w-full text-left text-[#05073C] mt-6">
                <tbody>
                  {[
                    { label: "Booking Id", value: viewData?.booking_id },
                    {
                      label: "Package name",
                      value: viewData?.package?.name?.[langCode],
                    },
                    {
                      label: "Package Price",
                      value: `${currency_symbol} ${viewData?.amount.toFixed(
                        2
                      )}`,
                    },
                    {
                      label: "Check In Date",
                      value: dayjs(viewData?.check_in).format("DD MMM YYYY"),
                    },
                    {
                      label: "Check out Date",
                      value: dayjs(viewData?.check_out).format("DD MMM YYYY"),
                    },
                    { label: "Booking Person", value: viewData?.person },
                    { label: "Order Status", value: viewData?.status },
                    { label: "User Name", value: viewData?.user?.name },
                    {
                      label: "Payment Method",
                      value: viewData?.payment?.method,
                    },
                    {
                      label: "Transaction Id",
                      value: viewData?.payment?.transaction_id,
                    },
                    {
                      label: "Payment Status",
                      value: viewData?.payment?.status,
                    },
                    {
                      label: "Order Date",
                      value: dayjs(viewData?.createdAt).format("DD MMM YYYY"),
                    },
                  ].map((item, index) => (
                    <tr
                      key={index}
                      className={index < 20 ? "border border-gray-200" : ""}
                    >
                      <td className="py-2 px-4 description-2 text-[#05073C] whitespace-pre">
                        {i18n.t(item.label)}
                      </td>
                      <td
                        className={`${getStatusClass(
                          item.value
                        )} my-1 py-2 px-4 description-1 text-[#717171] capitalize`}
                      >
                        {item.value || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PackageBookingModal;
