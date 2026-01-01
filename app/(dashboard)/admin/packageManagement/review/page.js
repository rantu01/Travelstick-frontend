/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Rate, Switch, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { useActionConfirm, useFetch } from "@/app/helper/hooks";
import { deletePackageReviewByAdmin, getPackageReviewByAdmin, updatePackageReviewStatusByAdmin } from "@/app/helper/backend";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Table, { TableImage } from "@/app/(dashboard)/components/common/table";

const PackageReview = () => {
  let { langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getPackageReviewByAdmin, {}, false);
  useEffect(() => {
    getData();
  }, []);
  const [selectedLang, setSelectedLang] = useState(undefined);
  const i18n = useI18n();
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  const columns = [
    {
      text: "Reviewer Image",
      dataField: "user",
      formatter: (value) => (
        <>
          <TableImage url={value?.image || "/theme1/user.jpg"} />
        </>
      )
    },
    {
      text: "Reviewer Name",
      dataField: "user",
      formatter: (value) => {
        return (
          <p className="capitalize">{value?.name}</p>
        )
      }
    },
    {
      text: "Comment",
      dataField: "comment",
      formatter: (title) => (
        <span>
          <Tooltip
            title={
              title?.length > 40 ? title : undefined
            }
          >
            <span className="cursor-help">
              {title?.length > 40
                ? title?.slice(0, 40) + "..."
                : title}
            </span>
          </Tooltip>
        </span>
      )
    },
    {
      text: "Rating",
      dataField: "rating",
      formatter: (value) => (
        <Rate className="text-primary" disabled count={5} defaultValue={value} />
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
                updatePackageReviewStatusByAdmin,
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
        <div className="rounded dashboardInput bg-white">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">{i18n.t("Package Review")}</h1>
            <BackButton />
          </div>
          {
            langCode && (
              <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                onDelete={deletePackageReviewByAdmin}
                indexed
                langCode={langCode}
                pagination
              />
            )
          }
        </div>
      </div>
    </>
  );
};

export default PackageReview;
