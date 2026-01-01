/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getAllPackageBookingByUser, } from "@/app/helper/backend";
import { TableImage } from "@/app/(dashboard)/components/common/table";
import UserTable from "@/app/(dashboard)/components/common/userTable";
import { getStatusClass } from "@/app/helper/utils";
import dayjs from "dayjs";
import { useCurrency } from "@/app/contexts/site";
import PackageBookingModal from "@/app/(dashboard)/admin/packageManagement/packageBooking/packageBookingModal";
const PackageBooking = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const { currency_symbol } = useCurrency();
  let { languages, langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getAllPackageBookingByUser);
  const [selectedLang, setSelectedLang] = useState(undefined);
  const i18n = useI18n();
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  const columns = [
    {
      text: "Booking ID",
      dataField: "booking_id",
    },
    {
      text: "Package Name",
      dataField: "package",
      formatter: (value) => (
        <Tooltip title={value?.name?.[langCode]?.length > 20 ? value?.name?.[langCode] : undefined}>
          <span className="cursor-help">
            {
              value?.name?.[langCode]?.length > 20
                ? value?.name?.[langCode]?.slice(0, 20) + "..."
                : value?.name?.[langCode]
            }
          </span>
        </Tooltip>
      ),
    },
    {
      text: "Package Image",
      dataField: "package",
      formatter: (value) => <TableImage url={value?.card_image} />,
    },
    {
      text: "Booking Date",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    {
      text: "Status",
      dataField: "status",
      formatter: (value) => (
        <span className={getStatusClass(value)}>
          {value ? value : "N/A"}
        </span>
      ),
    },
    {
      text: "Amount",
      dataField: "amount",
      formatter: (value) => (
        <p>
          {currency_symbol} {value?.toFixed(2)}
        </p>
      ),
    },

  ];
  const handleView = (value) => {
    setViewModalOpen(true);
    setViewData(value);
  };
  return (
    <>
      <div className="w-full overflow-x-auto">
        <h4 className="description-3 mb-6 text-[#05073C]">{i18n?.t("Package Booking")}</h4>
        {
          langCode && (
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
          )
        }
      </div>
      <PackageBookingModal slug="user" viewModalOpen={viewModalOpen} setViewModalOpen={setViewModalOpen} viewData={viewData} setViewData={setViewData} />
    </>
  );
};

export default PackageBooking;
