/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Select, message } from "antd";
import {
  MdCloud,
  MdLocalPhone,
  MdLocationOn,
  MdLockOutline,
  MdOutlineFace,
} from "react-icons/md";
import { HiMail } from "react-icons/hi";
import axios from "axios";
import { useRouter } from "next/navigation";
import FormSelect from "@/app/components/form/select";
import { useI18n } from "@/app/contexts/i18n";

const { Option } = Select;

const Setting = () => {
  const router = useRouter();
  const [getSetting, setSetting] = useState(true);
  const [getLoader, setLoader] = useState(false);
  const i18n = useI18n();
  const [uploadType, setUploadType] = useState("local");
  const [form] = Form.useForm();
  
  useEffect(() => {
    const checkEnvFile = async () => {
      const { data } = await axios.get(
        process.env.BACKEND_URL + "/api/v1/settings/env-checks"
      );
      if (data?.data?.status === true && data?.data?.env === false) {
        setSetting(true);
      } else {
        router.push("/");
      }
    };
    checkEnvFile();
  }, []);

  const onFinish = async (values) => {
    setLoader(true);

    const adminInfo = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const valueString = {
      DB_STRING: values.DATABASE_URL,
      CLIENT_SIDE_URL: values.CLIENT_SIDE_URL,
      SERVER_SIDE_URL: values.SERVER_SIDE_URL,
      FILE_UPLOAD_TYPE: values.FILE_UPLOAD_TYPE,
      AWS_BUCKET_NAME: values.AWS_BUCKET_NAME,
      AWS_ACCESS_KEY_ID: values.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: values.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: values.AWS_REGION,
      WEBSITE_NAME: values.WEBSITE_NAME,
      NODE_ENV: "prod",
    };

    const { data } = await axios.post(
      process.env.BACKEND_URL + "/api/v1/settings/env-creates",
      {
        valueString,
        adminInfo,
      }
    );

    if (data?.status === true && data?.env === true) {
      message.success(
        "Setup Successful, Please Restart Frontend and Backend Server"
      );
    } else {
      message.warning(data?.message);
    }
    setLoader(false);
  };

  if (getSetting === true) {
    return (
      <div className="flex justify-center items-center pb-[5%] pt-[3%] bg-gray-200 min-h-screen">
        <div className="h-auto md:w-1/2 border rounded p-10 bg-white shadow">
          <h3 className="text-center text-primary pb-4 border-b-[1px] border-b-primary">
            {i18n.t("Quick Setup")}
          </h3>
          <Form
            layout="horizontal"
            form={form}
            onFinish={onFinish}
            className="my-4 theme4Env"
          >
            <div className="mb-5">
              <p className="text-xl font-semibold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
                {i18n.t("Create Admin")}
              </p>
              <div className="flex  mb-4">
                <MdOutlineFace className="text-2xl mt-3 text-gray-600 mr-2" />
                <Form.Item
                  name="name"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                  ]}
                >
                  <Input
                    className="p-3 border rounded-lg border-gray-300 "
                    placeholder={i18n.t("Enter Name")}
                  />
                </Form.Item>
              </div>

              <div className="flex mb-4">
                <HiMail className="text-2xl mt-3 text-gray-600 mr-2" />
                <Form.Item
                  name="email"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                    {
                      type: "email",
                      message: "Please input a valid email!",
                    },
                  ]}
                >
                  <Input
                    className="p-3 border rounded-lg border-gray-300 "
                    placeholder={i18n.t("Enter Admin Email")}
                  />
                </Form.Item>
              </div>

              <div className="flex mb-4 relative">
                <MdLocalPhone className="text-2xl mt-3 text-gray-600 mr-2" />
                <Form.Item
                  name="phone"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone!",
                    },
                  ]}
                >
                  <Input
                    className="p-3 border rounded-lg border-gray-300 "
                    placeholder={i18n.t("Enter Admin Phone")}
                  />
                </Form.Item>
              </div>

              <div className="flex mb-4">
                <MdLockOutline className="text-2xl mt-3 text-gray-600 mr-2" />
                <Form.Item
                  name="password"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please Input Valid Password!",
                    },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    className="p-3 border rounded-lg border-gray-300 "
                    placeholder={i18n.t("Enter Admin Password")}
                  />
                </Form.Item>
              </div>

              <div className="flex mb-4">
                <MdLockOutline className="text-2xl mt-3 text-gray-600 mr-2" />
                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Passwords do not match!");
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    className="p-3 border rounded-lg border-gray-300 "
                    placeholder={i18n.t("Confirm Admin Password")}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xl font-semibold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
                {i18n.t("Database Setup")}
              </p>
              <Form.Item
                name="DATABASE_URL"
                label={
                  <span className="font-medium text-gray-700">
                    {i18n.t("Database String")}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input the database string!",
                  },
                ]}
              >
                <Input
                  className="p-3 border rounded-lg border-gray-300 "
                  placeholder="eg. mongodb+srv://appstickltd:CqMAWLOJYeboJDRl@testdb01.0s3vo.mongodb.net......"
                />
              </Form.Item>

              <Form.Item
                name="WEBSITE_NAME"
                label={
                  <span className="font-medium text-gray-700">
                    {i18n.t("Website Name")}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input the website name!",
                  },
                ]}
              >
                <Input
                  className="p-3 border rounded-lg border-gray-300 "
                  placeholder="eg. Appstick"
                />
              </Form.Item>

              <Form.Item
                name="CLIENT_SIDE_URL"
                label={
                  <span className="font-medium text-gray-700">
                    {i18n.t("Client Side URL")}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input the Frontend URL!",
                  },
                ]}
              >
                <Input
                  className="p-3 border rounded-lg border-gray-300 "
                  placeholder="eg. http://localhost:3000"
                />
              </Form.Item>
              <Form.Item
                name="SERVER_SIDE_URL"
                label={
                  <span className="font-medium text-gray-700">
                    {i18n.t("Server Side URL")}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input the Backend URL!",
                  },
                ]}
              >
                <Input
                  className="p-3 border rounded-lg border-gray-300 "
                  placeholder="eg. http://localhost:5000/"
                />
              </Form.Item>
            </div>

            <div className="mb-5 setting">
              <p className="text-xl font-semibold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
                {i18n.t("AWS Bucket Information")}
              </p>

              <FormSelect
                label={i18n.t("File Upload Type")}
                name="FILE_UPLOAD_TYPE"
                placeholder={i18n.t("Select Upload Type")}
                required
                className="w-full rounded-lg bg-transparent px-2 py-[23px] dashinput"
                options={[
                  { label: "Local", value: "local" },
                  { label: "Amazon S3", value: "s3" },
                ]}
                onChange={(value) => setUploadType(value)}
              />
              {uploadType === "s3" && (
                <>
                  <div className="flex mb-4">
                    <MdCloud className="text-2xl text-gray-600 mr-2 mb-4" />
                    <Form.Item
                      name="AWS_BUCKET_NAME"
                      className="w-full"
                      label={i18n.t("AWS Bucket Name")}
                      rules={[
                        {
                          required: true,
                          message: "Please input AWS Bucket Name!",
                        },
                      ]}
                    >
                      <Input className="p-3 border rounded-lg border-gray-300 " />
                    </Form.Item>
                  </div>

                  <div className="flex mb-4">
                    <MdCloud className="text-2xl text-gray-600 mr-2 mb-4" />
                    <Form.Item
                      name="AWS_ACCESS_KEY_ID"
                      className="w-full"
                      label={i18n.t("AWS Access Key")}
                      rules={[
                        {
                          required: true,
                          message: "Please input AWS Access Key!",
                        },
                      ]}
                    >
                      <Input className="p-3 border rounded-lg border-gray-300 " />
                    </Form.Item>
                  </div>

                  <div className="flex mb-4">
                    <MdLockOutline className="text-2xl text-gray-600 mr-2 mb-4" />
                    <Form.Item
                      name="AWS_SECRET_ACCESS_KEY"
                      className="w-full"
                      label={i18n.t("AWS Secret Access Key")}
                      rules={[
                        {
                          required: true,
                          message: "Please input AWS Secret Access Key!",
                        },
                      ]}
                    >
                      <Input className="p-3 border rounded-lg border-gray-300 " />
                    </Form.Item>
                  </div>

                  <div className="flex mb-4">
                    <MdLocationOn className="text-2xl text-gray-600 mr-2 mb-4" />
                    <Form.Item
                      name="AWS_REGION"
                      className="w-full"
                      label={i18n.t("AWS Region")}
                      rules={[
                        { required: true, message: "Please input AWS Region!" },
                      ]}
                    >
                      <Input className="p-3 border rounded-lg border-gray-300 " />
                    </Form.Item>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <Form.Item>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary text-white px-6 py-2 rounded shadowHover mt-5"
                >
                  {i18n.t("Submit")}
                </button>
              </Form.Item>

              {getLoader == true && (
                <div className="flex justify-center absolute top-0 left-[40%]">
                  <div>
                    <p className="text-purple-700 font-semibold text-[14px]">
                      {i18n.t("Please Wait")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Form>
        </div>
      </div>
    );
  }
};

export default Setting;
