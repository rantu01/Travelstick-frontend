/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Button from "@/app/(dashboard)/components/common/button";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import {
  deleteHotel,
  getAllHotel,
  updateHotel,
} from "@/app/helper/backend";
import { useActionConfirm, useFetch } from "@/app/helper/hooks";
import { Switch, Tooltip } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const Hotel = () => {
  const router = useRouter();
  let { langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getAllHotel);
  const i18n = useI18n();
  const { currency_symbol } = useCurrency();
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
      text: "Name",
      dataField: "name",
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
      dataField: "destination",
      formatter: (title) => (
        <span>
          <Tooltip
            title={
              title?.name?.length > 40 ? title?.name : undefined
            }
          >
            <span className="cursor-help">
              {title?.name?.length > 40
                ? title?.name?.slice(0, 40) + "..."
                : title?.name}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      text: "Price",
      dataField: "price",
      formatter: (price) => (
        <span> {currency_symbol} {price?.amount} </span>
      ),
    },
    {
      text: "Capacity",
      dataField: "limit",
      formatter: (value) => (
        <span> {value} </span>
      ),
    },
    {
      text: "Hotel Type",
      dataField: "hotel_type",
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
                updateHotel,
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
            <h1 className="text-[#05073C] heading-3">{i18n.t("Hotel List")}</h1>
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
                  router.push("/admin/hotelManagement/hotel/addHotel");
                }}
              >
                {"Add New"}
              </Button>
            }
            onEdit={(values) => {
              router.push(
                `/admin/hotelManagement/hotel/editHotel?_id=${values._id}`
              );
            }}
            onView={(values) => {
              router.push(
                `/admin/hotelManagement/hotel/view?_id=${values._id}`
              );
            }}
            onDelete={deleteHotel}
            indexed
            langCode={langCode}
            pagination
          />
        </div>
      </div>
    </>
  );
};

export default Hotel;
