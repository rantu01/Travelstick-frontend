/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { useAction, useFetch } from "@/app/helper/hooks";
import { Form, Modal } from "antd";
import Button from "../../components/common/button";
import Table from "../../components/common/table";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import FormPassword from "@/app/components/form/password";
import FormSelect from "@/app/components/form/select";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { GetAllEmployees, GetAllRoles, DeleteAEmployee, CreateEmployee, UpdateEmployee, updatePassword } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import { useState } from "react";
import dayjs from "dayjs";
import BackButton from "../../components/common/backButton";

const Employee = () => {
  const [data, getData, { loading }] = useFetch(GetAllEmployees);
  const [roles] = useFetch(GetAllRoles);
  const [viewOpen, setViewOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [isReset, setIsReset] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeId, setEmployeId] = useState("");
  const i18n = useI18n();
  const [form] = Form.useForm();

  const columns = [
    {
      text: i18n?.t("Registered At") || "Registered At",
      dataField: "createdAt",
      formatter: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    { text: i18n?.t("Name") || "Name", dataField: "name" },
    { text: i18n?.t("Phone") || "Phone", dataField: "phone" },
    { text: i18n?.t("Email") || "Email", dataField: "email" },
    {
      text: i18n.t("Password"),
      dataField: "password",
      formatter: (_, d) => (
        <>
          {
            <Button
              className="!border-none bg-primary/70 !duration-500 text-white !py-[6px] !px-4 !text-sm hover:bg-primary/80"
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
    {
      text: "Permissions",
      dataField: "permissions",
      formatter: (value) => <span className="capitalize">{(value?.name)}</span>,
    },
  ];

  const handleView = (user) => {
    setViewData(user);
    setViewOpen(true);
  };

  const handleEdit = (data) => {
    setEmployeeId(data._id);
    setOpenEditModal(true);
    form.setFieldsValue({
      name: data?.name,
      phone: data?.phone,
      email: data?.email,
      password: data?.password,
      role: data?.permissions?.name
    });
  };

  const handleSubmit = (values) => {
    // create employee
    const payload = {
      body: {
        name: values?.name,
        email: values?.email,
        phone: values?.phone,
        password: values?.password?.length < 6 ? undefined : values?.password,
        role: values?.role,
      }
    };
    // update employee
    const payload2 = {
      body: {
        _id: employeeId,
        name: values?.name,
        role: values?._id,
        password: values?.password || undefined,
      }
    };

    if (employeeId) {
      useAction(UpdateEmployee, payload2, () => {
        getData();
        form.resetFields();
        setOpenEditModal(false);
      });
    } else {
      useAction(CreateEmployee, payload, () => {
        getData();
        form.resetFields();
        setOpenEditModal(false);
      });
    }
  };

  const handleResetPassword = async (value) => {
    const payload = {
      body: {
        "old_password": value.old_password,
        "password": value.password,
        "confirm_password": value.confirm_password
      }
    }
    useAction(
      updatePassword, payload, () => {
        setIsReset(false);
        getData();
        form.resetFields();
      }
    );
  };

  return (
    <div className="w-full overflow-x-auto mt-7 px-6 rounded-xl">
        <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between px-8 pt-8 items-center">
          <h1 className="heading-3 text-[#05073C] ">{i18n.t("Employee List")}</h1>
          <BackButton />
        </div>
        {
          i18n && (
            <Table
              columns={columns}
              loading={loading}
              data={data}
              onReload={getData}
              indexed
              pagination
              onEdit={handleEdit}
              onView={handleView}
              onDelete={DeleteAEmployee}
              action={
                <Button
                  onClick={() => {
                    form.resetFields();
                    setEmployeeId(null);
                    setOpenEditModal(true);
                  }}
                >
                  {i18n.t("Add Employee")}
                </Button>
              }
            />
          )
        }
        {/* edit and add modal */}
        <Modal
          className=" xl:!w-[700px] auth"
          open={openEditModal}
          onCancel={() => setOpenEditModal(false)}
          title={
            <h2 className="text-[#05073C] heading-4 mb-6">
              {i18n.t(employeeId ? "Edit Employee" : "Add Employee")}
            </h2>
          }
          footer={null}
          destroyOnClose
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
          >
            <HiddenInput name="id" />
            <FormInput
              className='w-full rounded bg-transparent p-3 dashinput'
              placeholder="Employee Name"
              type="text"
              name="name"
              required
              label={i18n.t("Name")}
            />
            <FormInput
              className='w-full rounded bg-transparent p-3 dashinput'
              placeholder="Email"
              type="email"
              name="email"
              isEmail={true}
              required
              label={i18n.t("Email")}
              disabled={employeeId}
            />
            <FormInput
              className='w-full rounded bg-transparent p-3 dashinput'
              disabled={employeeId}
              placeholder="Phone Number"
              type="text"
              name="phone"
              required
              label={i18n.t("Phone Number")}
            />
            <FormPassword
              className='w-full rounded bg-transparent p-3 dashinput'
              placeholder="Password"
              name="password"
              label={i18n.t("Password")}
            />
            <FormSelect
              className="w-full rounded bg-transparent px-2 py-[23px] dashinput"
              name="role"
              label="Role"
              required={true}
              initialValue={employeeId ? data?.permissions?._id : 'Select role'}
              placeholder="Select Role"
              options={roles?.map((role) => ({
                value: role?._id,
                label: role?.name,
              }))}
            />
            <Button className="!mt-10" type="submit">
              {i18n.t("Submit")}
            </Button>
          </Form>
        </Modal>

        {/* View Modal */}
        <Modal
          open={viewOpen}
          className=""
          onCancel={() => setViewOpen(false)}
          footer={null}
          destroyOnClose
        >
          {viewData && (
            <div className="mt-6 gap-8 px-5 md:px-6 py-2 md:py-3 lg:py-4 xl:py-5">
              <h5 className="text-[#05073C] heading-4 text-center">{i18n.t(`Details of ${viewData?.name}`)}</h5>
              <div className="mt-4">
                <div>
                  {
                    viewData?.images?.length > 0 && viewData?.images[0] ? (
                      <Image
                        src={viewData?.images[0]}
                        alt="User Image"
                        width={1000}
                        height={1000}
                        className="Rounded-full bg-light mb-6 mx-auto object-cover"
                      />
                    ) :
                      <CgProfile className="lg:text-8xl text-6xl mx-auto mb-2 text-[#05073C]" />
                  }
                </div>
                <div className="w-full">
                  {[
                    { label: i18n.t("Name") || "Name", value: viewData?.name, icon: "👤" },
                    { label: i18n.t("Email") || "Email", value: viewData?.email, icon: "✉️" },
                    { label: i18n.t("Phone Number") || "Phone", value: viewData?.phone, icon: "📞" },
                    { label: i18n.t("Role") || "Phone", value: viewData?.permissions?.name, icon: "🧑‍💼" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center gap-4 pb-4 w-full ${index < 6 ? "border-b border-gray-200" : ""
                        }`}
                    >
                      <div className="flex items-center gap-2 mt-4">
                        <span className="text-[#05073C] description-2">{item?.icon}</span>
                        <h3 className="text-sm capitalize font-semibold text-[#05073C] description-2">
                          {i18n.t(item?.label) || item?.label}
                        </h3>
                      </div>
                      <h3 className="text-sm font-medium truncate mt-4 text-[#171717] description-1">
                        {i18n.t(item?.value) || "N/A"}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
        {/* resetPassword */}
        <Modal
          className="auth"
          open={isReset}
          onCancel={() => {
            setIsReset(false);
            form.resetFields();
          }}
          footer={null}
        >
          <h1 className="heading-4 text-[#05073C] !font-inter my-6">
            {i18n?.t("Reset Your Password")}
          </h1>
          <Form
            form={form}
            onFinish={handleResetPassword}
            layout="vertical"
            className="space-y-4"
          >
            <FormPassword
              className='w-full rounded bg-transparent p-3 dashinput'
              name="old_password"
              label={i18n.t("Old Password")}
              required
              placeholder={i18n.t("Old Password")}
            />
            <FormPassword
              className='w-full rounded bg-transparent p-3 dashinput'
              name="password"
              label={i18n.t("New Password")}
              required
              placeholder={i18n.t("New Password")}
            />
            <FormPassword
              confirm
              className='w-full rounded bg-transparent p-3 dashinput'
              name="confirm_password"
              label={i18n.t("Confirm Password")}
              required
              placeholder={i18n.t("Confirm Password")}
            />


            <Button className="!mt-6" type="submit" loading={loading}>
              {i18n?.t("Submit")}
            </Button>
          </Form>
        </Modal>
      </div>
    </div>

  );
};

export default Employee;
