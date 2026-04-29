"use client";

import { Form, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import FormInput from "../form/input";
import FormSelect from "../form/select";
import { useAction, useFetch } from "@/app/helper/hooks";
import {
  createVisaQuery,
  createVisaApply,
  getAllPublicVisaType,
  singlePDFUpload,
} from "@/app/helper/backend";
import Button from "@/app/(dashboard)/components/common/button";
import UploadFileInput from "../form/UploadFileInput";
import { useUser } from "@/app/contexts/user";
import AuthModal from "../site/common/component/authModal";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const VisaForm = ({ id, pricePerPerson = 0 }) => {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const i18n = useI18n();
  const { user } = useUser();
  const { langCode } = useI18n();
  const [activeTab, setActiveTab] = useState("apply");
  const [submitLoading, setSubmitLoading] = useState(false);

  // ── Inquiry form ──
  const [inquiryForm] = Form.useForm();
  const [visaTypes] = useFetch(getAllPublicVisaType, { limit: 100 });

  // ── Apply form ──
  const [applyForm] = Form.useForm();
  const [applicants, setApplicants] = useState(1);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const subtotal = pricePerPerson * applicants;

  // Pre-fill user info
  useEffect(() => {
    if (user) {
      inquiryForm.setFieldsValue({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
      applyForm.setFieldsValue({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    }
  }, [user, inquiryForm, applyForm]);

  // ── Inquiry Submit ──
  const onInquiryFinish = async (values) => {
    if (!user) return setAuthModalOpen(true);
    setSubmitLoading(true);
    try {
      let file = "";
      if (values?.file?.[0]?.originFileObj) {
        const { data } = await singlePDFUpload({
          pdf: values.file[0].originFileObj,
          file_name: "file",
        });
        file = data || "";
      } else {
        file = values?.file?.[0]?.url || "";
      }
      await useAction(createVisaQuery, {
        body: {
          full_name: values.name,
          email: values.email,
          phone: values.phone,
          visa_type: values.visa_type,
          message: values.message,
          file,
        },
      });
      inquiryForm.resetFields();
      router.push("/user/visaInquery");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Apply Submit ──
  const onApplyFinish = async (values) => {
    if (!user) return setAuthModalOpen(true);
    setSubmitLoading(true);
    try {
      await useAction(createVisaApply, {
        body: {
          visa: id,
          full_name: values.name,
          email: values.email,
          phone: values.phone,
          appointment_date: appointmentDate,
          number_of_applicants: applicants,
          price_per_person: pricePerPerson,
          total_price: subtotal,
          inquiry_type: "apply",
        },
      });
      applyForm.resetFields();
      setApplicants(1);
      setAppointmentDate(null);
      router.push("/user/visaInquery");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* ── Tab Buttons ── */}
      <div className="flex border-b bg-white">
        {["apply", "inquiry"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab === "apply" ? i18n.t("Apply") : i18n.t("Enquiry")}
          </button>
        ))}
      </div>

      {/* ── Apply Tab ── */}
      {activeTab === "apply" && (
        <Form form={applyForm} layout="vertical" onFinish={onApplyFinish}>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FormInput
                name="name"
                label={i18n.t("Full Name")}
                placeholder="Full name"
                required
                className="w-full p-3 border rounded-xl focus:outline-primary"
              />
              <FormInput
                name="email"
                label={i18n.t("Email")}
                placeholder="Email address"
                required
                className="w-full p-3 border rounded-xl focus:outline-primary"
              />
              <FormInput
                name="phone"
                label={i18n.t("Phone")}
                placeholder="Phone number"
                required
                className="w-full p-3 border rounded-xl focus:outline-primary"
              />

              {/* Appointment Date */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {i18n.t("Appointment Date")} <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  className="w-full h-[46px] rounded-xl border"
                  disabledDate={(d) => d && d < dayjs().startOf("day")}
                  onChange={(date) => setAppointmentDate(date ? date.toISOString() : null)}
                  placeholder="Select date"
                />
              </div>
            </div>

            {/* Number of Applicants */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {i18n.t("Number of Applicants")} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 border rounded-xl px-4 py-2 w-fit">
                <button
                  type="button"
                  onClick={() => setApplicants((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-base font-bold w-6 text-center">{applicants}</span>
                <button
                  type="button"
                  onClick={() => setApplicants((p) => p + 1)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>{i18n.t("Per Person")}</span>
                <span className="font-semibold text-gray-700">৳ {pricePerPerson.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>{i18n.t("Applicants")}</span>
                <span className="font-semibold text-gray-700">× {applicants}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-[#05073C] text-base">
                <span>{i18n.t("Total")}</span>
                <span className="text-primary">৳ {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-[48px] !rounded-xl text-base font-semibold"
              loading={submitLoading}
            >
              {i18n.t("Apply Now")}
            </Button>
          </div>
        </Form>
      )}

      {/* ── Inquiry Tab ── */}
      {activeTab === "inquiry" && (
        <Form form={inquiryForm} layout="vertical" onFinish={onInquiryFinish}>
          <div className="p-4 space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FormInput
                name="name"
                label={i18n.t("Full Name")}
                placeholder="Full name"
                required
                className="w-full p-3 border rounded-xl focus:outline-primary"
              />
              <FormInput
                name="email"
                label={i18n.t("Email Address")}
                placeholder="Email address"
                required
                className="w-full p-3 border rounded-xl focus:outline-primary"
              />
              <FormInput
                name="phone"
                label={i18n.t("Phone Number")}
                placeholder="Phone number"
                required
                className="w-full p-3 border rounded-xl focus:outline-primary"
              />
              <FormSelect
                name="visa_type"
                required
                options={visaTypes?.docs?.map((visa) => ({
                  label: visa?.name?.[langCode],
                  value: visa?._id,
                }))}
                className="w-full border rounded-xl h-[50px]"
                placeholder="Select Visa Type"
                label={i18n.t("Visa Type")}
              />
            </div>
            <FormInput
              name="message"
              textArea
              rows={3}
              label={i18n.t("Your Message")}
              placeholder="Your message"
              required
              className="w-full p-3 border rounded-xl focus:outline-primary"
            />
            <div className="mt-1">
              <div className="relative inline-block group">
                <UploadFileInput
                  className="!h-[50px] !pt-2"
                  max={1}
                  accept=".pdf"
                  name="file"
                  label={i18n.t("Visa Document")}
                  required
                  rules={[{ required: true, message: i18n.t("Please upload visa document") }]}
                />

                {/* Tooltip shown on hover for the Enquiry upload button */}
                <div className="pointer-events-none opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 absolute left-0 bottom-full mb-2 w-56 bg-white border rounded-lg p-3 text-sm shadow-lg z-50">
                  <div className="font-medium mb-1">Accepted Documents</div>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Passport</li>
                    <li>Visa on Passport</li>
                    <li>Bank Statement</li>
                    <li>Bank Solvency</li>
                    <li>NID</li>
                    <li>Visiting Card/ID Card</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-3">
              <Button
                type="submit"
                className="w-full h-[48px] !rounded-xl text-base font-semibold"
                loading={submitLoading}
              >
                {i18n.t("Submit Now")}
              </Button>
            </div>
          </div>
        </Form>
      )}

      <AuthModal
        authModalOpen={authModalOpen}
        setAuthModalOpen={setAuthModalOpen}
        slug={`/visa/${id}`}
      />
    </div>
  );
};

export default VisaForm;