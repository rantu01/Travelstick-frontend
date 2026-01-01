/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { FaEye, FaPencilAlt, FaTimes, FaTrashAlt } from "react-icons/fa";
import { Modal } from "antd";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SearchInput from "@/app/components/form/search";
import { Loader } from "./loader";
import Pagination from "./pagination";
import { useI18n } from "@/app/contexts/i18n";
import { useActionConfirm } from "@/app/helper/hooks";
import Image from "next/image";

const UserTable = ({
  columns,
  data,
  indexed,
  loading = false,
  noActions,
  actions,
  action,
  onView,
  onEdit,
  onDelete,
  onReload,
  pagination = false,
  shadow = false,
  title,
  noHeader = false,
  afterSearch,
  onSearchChange,
  langCode,
}) => {
  const i18n = useI18n();
  const handleEditClick = (data) => {
    onEdit(data);
  };
  const pathname = usePathname();

  const handleDeleteClick = async (data) => {
    if (onDelete) {
      await useActionConfirm(
        onDelete,
        { _id: data._id },
        onReload,
        "Are you sure you want to delete this item?",
        "Yes, Delete"
      );
    }
  };

  let cols = noActions
    ? columns
    : [
      ...columns,
      {
        text: i18n.t("Action"),
        dataField: "no_actions",
        className: " text-right mr-2",
        formatter: (noActions, data) => {
          return (
            <div className="flex justify-end gap-2.5">
              {actions && actions(data)}
              {onView && (
                <button
                  className="btn btn-outline-success btn-sm focus:shadow-none border border-primary text-primary p-2 rounded hover:bg-primary hover:text-[#fff] transition-all duration-300 ease-in-out"
                  title="View"
                  onClick={() => onView(data)}
                >
                  <FaEye />
                </button>
              )}
              {data.disableEdit === 1 &&
                !onView &&
                data.disableDelete === 1 &&
                !actions &&
                "-"}
              {onEdit && data?.disableEdit !== 1 && (
                <button
                  className="border border-primary text-primary p-2 rounded hover:bg-primary hover:text-[#fff] transition-all duration-300 ease-in-out"
                  title="Edit"
                  onClick={() => handleEditClick(data)}
                >
                  <FaPencilAlt size={12} />
                </button>
              )}
              {onDelete && data?.disableDelete !== 1 && (
                <button
                  className="border border-red-700 p-2 rounded hover:bg-red-700 text-red-600 hover:text-[#fff] focus:shadow-none"
                  title="Delete"
                  onClick={() => handleDeleteClick(data)}
                >
                  <FaTrashAlt size={12} />
                </button>
              )}
            </div>
          );
        },
      },
    ];

  return (
    <>
      <div
        className={`w-full pl-[2px] ${shadow ? "shadow" : ""
          } rounded-sm mb-4 ${pathname === "/vendor" ? "seller" : ""}`}
      >
        {noHeader || (
          <header className="gap-3 border-primary/80 flex justify-between flex-wrap">
            {title ? (
              <>
                {typeof title === "string" ? (
                  <h4 className="text-base font-medium text-[#05073C]">
                    {i18n?.t(title)}
                  </h4>
                ) : (
                  title
                )}
              </>
            ) : (
              <div className="flex justify-between">
                <div className="flex flex-wrap">
                  <SearchInput
                    className="w-44 border border-primary focus:outline-primary"
                    onChange={(e) => {
                      const search = e.target.value || undefined;
                      onReload({ search, langCode, page: 1 });
                      onSearchChange && onSearchChange(search, langCode);
                    }}
                  />
                  {afterSearch}
                </div>
              </div>
            )}
            {action}
          </header>
        )}
        <div
          className={`pt-7 relative ${pathname === "/vendor" ? "seller-scroller" : ""
            } overflow-x-auto`}
        >
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase text-[#05073C] border-[1px] bg-primary/20 border-primary/80">
                <tr>
                  {indexed && (
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left ">#</div>
                    </th>
                  )}
                  {cols?.map((column, index) => (
                    <th
                      className="py-4 whitespace-nowrap  text-left "
                      key={index}
                    >
                      <div
                        className={`font-semibold ${column?.className || ""}`}
                      >
                        {i18n?.t(column?.text)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y-[1px] divide-primary/80">
                {loading ? (
                  <tr>
                    <td className="h-96 pb-16">
                      <div
                        style={{ blockSize: 200 }}
                        className="absolute w-full flex justify-center"
                      >
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {(pagination ? data?.docs : data)?.map((row, index) => (
                      <tr key={index}>
                        {indexed && (
                          <td className="py-8 whitespace-nowrap text-[#05073C]">
                            {(pagination ? (data?.page - 1) * data.limit : 0) +
                              index +
                              1}
                          </td>
                        )}
                        {cols?.map((column, index) => (
                          <td
                            className={`p-2 whitespace-nowrap text-[#05073C] ${column?.className || ""
                              }`}
                            key={index}
                          >
                            {column.formatter
                              ? column.formatter(row[column.dataField], row)
                              : row[column.dataField] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {pagination && (
            <div className="pt-5 border-t-2 border-primary/80">
              <Pagination
                page={data?.page}
                total={data?.totalDocs}
                onSizeChange={(limit) => onReload({ limit, langCode })}
                limit={data?.limit}
                totalPages={data?.totalPages}
                onPageChange={(page) => onReload({ page, langCode })}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default UserTable;

export const DetailTable = ({ data, columns, title, actions }) => {
  const i18n = useI18n();
  return (
    <div className="rounded-md p-4">
      {!!title && (
        <div className="text-xl font-semibold mb-4">{i18n?.t(title)}</div>
      )}
      <div className="body">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <tbody>
              {columns?.map((column, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-2 px-4">{i18n?.t(column?.text)}</td>
                  <td className="py-2 px-4 text-sm">
                    {!!data
                      ? !!column?.formatter
                        ? column?.formatter(data[column.dataIndex], data)
                        : data[column.dataIndex]
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {actions}
      </div>
    </div>
  );
};

export const TableImage = ({ url }) => {
  const [image, setImage] = useState();
  return (
    <div className="w-inline-block h-10 w-10 !rounded-full">
      <Image
        role="button"
        src={url}
        width={100}
        height={100}
        alt="Image"
        onClick={() => setImage(url)}
        style={{ inlineSize: "100%", blockSize: "100%" }}
      />
      <Modal
        width={800}
        open={image}
        onCancel={() => setImage(undefined)}
        footer={null}
        styles={{ body: { padding: 0, zIndex: 60 } }} 
        closeIcon={
          <FaTimes size={18} className="rounded hover:!bg-none text-primary" />
        }
      >
        <div className="flex justify-center items-center">
          <Image
            width={100}
            height={100}
            className="w-[100px]"
            style={{ blockSize: 400 }}
            src={image}
            alt="image"
          />
        </div>
      </Modal>
    </div>
  );
};
