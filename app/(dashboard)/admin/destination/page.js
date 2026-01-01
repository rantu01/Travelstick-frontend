/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import {
  deleteDestination,
  getDestination,
  updateDestination,
} from "@/app/helper/backend";
import { useActionConfirm, useFetch } from "@/app/helper/hooks";
import { Switch, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Destination = () => {
  const router = useRouter();
  let {  langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getDestination);
  const [selectedLang, setSelectedLang] = useState(undefined);

  const i18n = useI18n();
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  const columns = [
    {
      text: "Image",
      dataField: "card_image",
      formatter: (value) => (
        <div>
          <TableImage url={value || "/man.png"} />
        </div>
      ),
    },
    {
      text: "Name",
      dataField: "name",
      formatter: (title) => (
        <span>
          <Tooltip title={title?.length > 30 ? title : undefined}>
            <span className="cursor-help">
              {title?.length > 30 ? title?.slice(0, 30) + "..." : title}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Title",
      dataField: "short_description",
      formatter: (title) => (
        <span>
          <Tooltip title={title?.[langCode]?.length > 30 ? title?.[langCode] : undefined}>
            <span className="cursor-help">
              {title?.[langCode]?.length > 30 ? title?.[langCode]?.slice(0, 30) + "..." : title?.[langCode]}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Capital",
      dataField: "capital",
      formatter: (status) => <p className="capitalize">{status}</p>,
    },
    {
      text: "Language",
      dataField: "language",
      formatter: (status) => <p className="capitalize">{status}</p>,
    },
    {
      text: "Currency",
      dataField: "currency",
      formatter: (status) => <p className="capitalize">{status}</p>,
    },
    {
      text: "Address",
      dataField: "address",
      formatter: (title) => (
        <span>
          <Tooltip title={title?.name?.length > 30 ? title?.name : undefined}>
            <span className="cursor-help">
              {title?.name?.length > 30
                ? title?.name?.slice(0, 30) + "..."
                : title?.name}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Created At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },
    {
      text: i18n.t("Status"),
      dataField: "status",
      formatter: (_, d) => {
        return (
          <Switch
            checked={d?.status}
            onChange={() => {
              const newStatus = !d?.status;
              useActionConfirm(
                updateDestination,
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
  ];
  return (
    <>
      <div className="w-full overflow-x-auto mt-7 px-6">
        <div className=" rounded dashboardInput bg-white">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">
              {" "}
              {i18n.t("Destination List")}{" "}
            </h1>
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
                  router.push("/admin/destination/addDestination");
                }}
              >
                {i18n.t("Add New")}
              </Button>
            }
            onEdit={(values) => {
              router.push(
                `/admin/destination/editDestination?_id=${values._id}`
              );
            }}
            onView={(values) => {
              router.push(`/admin/destination/view?_id=${values._id}`);
            }}
            onDelete={deleteDestination}
            indexed
            langCode={langCode}
            pagination
          />
          
        </div>
      </div>
    </>
  );
};

export default Destination;
