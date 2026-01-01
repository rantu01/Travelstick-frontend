/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { useAction, useFetch } from "@/app/helper/hooks";
import Table, { TableImage } from "../../components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import {
  deleteUserByAdmin,
  fetchUserList,
  updatePasswordByAdmin,
} from "@/app/helper/backend";
import { Form, Modal } from "antd";
import { HiddenInput } from "@/app/components/form/input";
import FormPassword, {
  PasswordInputField,
} from "@/app/components/form/password";
import Button from "../../components/common/button";
import Image from "next/image";

const UserList = () => {
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [data, getData, { loading }] = useFetch(fetchUserList);
  const [isReset, setIsReset] = useState(false);
  const [employeId, setEmployeId] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const columns = [
    {
      text: "Image",
      dataField: "image",
      formatter: (_, d) => (
        <div className="flex space-x-1 rounded-full">
          <TableImage url={d?.image ? d?.image : "/man.png"} />
        </div>
      ),
    },
    {
      text: "Name",
      dataField: "name",
      formatter: (_, d) => <span>{d?.name}</span>,
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (d) => (d ? <span>{d}</span> : N / A),
    },
    {
      text: "Phone",
      dataField: "phone",
      formatter: (_, d) =>
        d?.phone ? (
          <span dir="ltr">{d?.phone}</span>
        ) : (
          <span dir="ltr">N/A</span>
        ),
    },
    {
      text: "Joined At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },

    {
      text: i18n.t("Password"),
      dataField: "password",
      formatter: (_, d) => (
        <>
          {
            <Button
              className="rounded bg-primary !duration-500 text-[#fff] hover:text-[#fff] !py-3 !px-4 !text-sm "
              onClick={() => {
                setIsReset(true);
                setEmployeId(d?._id);
              }}
            >
              {i18n.t("Reset Password")}
            </Button>
          }
        </>
      ),
    },
  ];

  const handleResetPassword = async (values) => {
    values._id = employeId;
    const submitData = {
      body: {
        ...values,
      },
    };
    return useAction(
      updatePasswordByAdmin,
      submitData,
      () => {
        setIsReset(false);
        getData();
        form.resetFields();
      },
      i18n.t("Password Changed Successfully")
    );
  };

  const handleView = (user) => {
    setViewData(user);
    setViewOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto mt-7 dashboardModal">
           <div className="rounded dashboardInput mx-8 bg-white">
           <div className="flex justify-between px-8 pt-8 items-center">
          <h1 className="text-[#05073C]  heading-3">{i18n.t("User List")}</h1>
        </div>
        <Table
          columns={columns}
          data={data}
          loading={loading}
          onReload={getData}
          onView={handleView}
          onDelete={deleteUserByAdmin}
          indexed
          pagination
          permission={"user_list"}
        />
      </div>

      <Modal
        className=""
        open={isReset}
        onCancel={() => {
          setIsReset(false);
          form.resetFields();
        }}
        footer={null}
        title={
          <h2 className="text-[#05073C] heading-3">
            {i18n?.t("Change User Password")}
          </h2>
        }
      >
        <Form
          form={form}
          onFinish={handleResetPassword}
          layout="vertical"
          className="space-y-4"
        >
          <HiddenInput name="_id" />

          {/* Password Field */}
          <FormPassword
            name="password"
            label={<span className="text-[#05073c]">{i18n.t("Password")}</span>}
            type="password"
            placeholder={i18n.t("Password")}
            required
            className="w-full rounded bg-transparent p-3 dashinput"
            rules={[
              { required: true, message: i18n.t("please enter password") },
            ]}
          />

          {/* Confirm Password Field */}
          <Form.Item
            name="confirm_password"
            label={
              <span className="text-[#05073c]">
                {i18n.t("Confirm Password")}
              </span>
            }
            className="mb-4"
            rules={[
              {
                required: true,
                message: i18n.t("Please enter a password"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      i18n.t("The two passwords that you entered do not match!")
                    )
                  );
                },
              }),
            ]}
          >
            <PasswordInputField
              placeholder={i18n.t("Confirm Password")}
              className="w-full rounded bg-transparent p-3 dashinput"
            />
          </Form.Item>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setIsReset(false)}
              className="bg-primary text-[#2b2b2b] px-4 py-2 rounded"
            >
              {i18n?.t("Close")}
            </Button>

            <Button
              type="submit"
              loading={loading}
              className="bg-primary text-[#2b2b2b] px-4 py-2 !rounded"
            >
              {i18n?.t("Save")}
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        className=""
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={null}
        destroyOnClose
        width={500}
        centered
      >
        {viewData && (
          <div className="modal-wrapper">
            <div className="">
              <div className="profile-container">
                { viewData?.image && (
                  <Image
                    height={100}
                    width={100}
                    src={viewData?.image || "/man.png"}
                    alt="User"
                    className="profile-image "
                  />
                )}
              </div>
            </div>

            <div className="info-container">
              <table className="w-full text-left border-collapse text-[#05073C]">
                <tbody>
                  {[
                    { label: "Name", value: viewData?.name },
                    { label: "Email", value: viewData?.email },
                    { label: "Address", value: viewData?.address },
                    { label: "Phone", value: viewData?.phone },
                    {
                      label: "Date Of Birth",
                      value: dayjs(viewData?.dob).format("DD-MMM-YYYY"),
                    },
                  ].map((item, index) => (
                    <tr
                      key={index}
                      className={index < 6 ? "border border-gray-200" : ""}
                    >
                      <td className="py-2 px-4 font-semibold text-[#05073C] description-2">
                        {i18n?.t(item.label)}
                      </td>
                      <td className="py-2 px-4 text-[#717171] description-1">
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
export default UserList;
