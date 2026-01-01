/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import {
  deleteVisa,
  getAllVisa,
  updateVisa,
} from "@/app/helper/backend";
import { useActionConfirm, useFetch } from "@/app/helper/hooks";
import { Switch, Tooltip } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { use } from "react";

const Visa = () => {
  let { langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getAllVisa);
  const i18n = useI18n();
  const { currency_symbol } = useCurrency();
  const router = useRouter();
  const columns = [
    {
      text: "Image",
      dataField: "card_image",
      formatter: (value) => (
        <>
          <TableImage url={value || "/man.png"} />
        </>
      ),
    },
    {
      text: "Title",
      dataField: "title",
      formatter: (title) => (
        <span>
          <Tooltip
            title={
              (title?.[langCode])?.length > 40 ? (title?.[langCode]) : undefined
            }
          >
            <span className="cursor-help">
              {title?.[langCode]?.length > 40
                ? (title?.[langCode])?.slice(0, 40) + "..."
                : (title?.[langCode])}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Destination",
      dataField: "country",
    },
    {
      text: "Price",
      dataField: "current_price",
      formatter: (current_price) => (
        <span> {currency_symbol} {current_price.toFixed(2)} </span>
      ),
    },
    {
      text: "Validity",
      dataField: "validity",
      formatter: (value) => (
        <span> {value} </span>
      ),
    },
    {
      text: "Visa Type",
      dataField: "visa_type",
      formatter: (type) => (
        <span> {type?.name?.[langCode]} </span>
      ),
    },
        {
      text: "Visa Mode",
      dataField: "visa_mode",
      formatter: (type) => (
        <span> {type} </span>
      ),
    },
    {
      text: i18n.t("Status"),
      dataField: "is_active",
      formatter: (_, d) => {
        return (
          <Switch
            checked={d?.status}
            onChange={() => {
              const newStatus = !d?.status;
              useActionConfirm(
                updateVisa,
                {
                  body: {
                    _id: d?._id,
                    status: newStatus,
                  },
                },
                getData
              );
            }}
            checkedChildren={
              <span className="text-white">{i18n.t("Active")}</span>
            }
            unCheckedChildren={
              <span className="text-white">{i18n.t("Inactive")}</span>
            }
          />
        );
      },
    },
    {
      text: "Created At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
  ];

  return (
    <>
      <div className="w-full overflow-x-auto mt-7 px-6">
        <div className="rounded dashboardInput bg-white">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">{i18n.t("Visa List")}</h1>
            <BackButton />
          </div>
          <Table
            columns={columns}
            data={data}
            loading={loading}
            onReload={getData}
            action={
              <Button
                onClick={() => {  
                  router.push("/admin/visaManagement/visa/addVisa");
                }}
              >
                {"Add New"}
              </Button>
            }
            onEdit={(values) => {   
              router.push(`/admin/visaManagement/visa/editVisa?_id=${values._id}`);
            }}
            onView={(values) => {
              router.push(`/admin/visaManagement/visa/view?_id=${values._id}`);
            }}
            onDelete={deleteVisa}
            indexed
            langCode={langCode}
            pagination
          />
        </div>
      </div>
    </>
  );
};

export default Visa;
