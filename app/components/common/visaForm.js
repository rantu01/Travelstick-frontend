"use client";

import { Form, DatePicker, Modal, Radio, message } from "antd";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import FormInput from "../form/input";
import { useAction } from "@/app/helper/hooks";
import {
  createVisaQuery,
  createVisaApply,
  singlePDFUpload,
} from "@/app/helper/backend";
import Button from "@/app/(dashboard)/components/common/button";
import UploadFileInput from "../form/UploadFileInput";
import { useUser } from "@/app/contexts/user";
import AuthModal from "../site/common/component/authModal";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const getLocalizedText = (value, langCode) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value?.[langCode] || value?.en || Object.values(value)?.[0] || "";
  }
  return "";
};

const VisaForm = ({ id, visaTypeId, pricePerPerson = 0, visaTitle, visaTypeName }) => {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const i18n = useI18n();
  const { user } = useUser();
  const { langCode } = useI18n();
  const [activeTab, setActiveTab] = useState("apply");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // ── Inquiry form ──
  const [inquiryForm] = Form.useForm();

  // ── Apply form ──
  const [applyForm] = Form.useForm();
  const [applyDetailsForm] = Form.useForm();
  const [applicants, setApplicants] = useState(1);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const subtotal = pricePerPerson * applicants;
  const currentVisaName = getLocalizedText(visaTitle, langCode);
  const currentVisaTypeName = getLocalizedText(visaTypeName, langCode);
  const resolvedVisaTypeId = visaTypeId || null;

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
      applyDetailsForm.setFieldsValue({
        email: user?.email || "",
        phone: user?.phone || "",
      });
    }
  }, [user, inquiryForm, applyForm, applyDetailsForm]);

  useEffect(() => {
    if (activeTab === "inquiry" && id) {
      inquiryForm.setFieldsValue({
        visa: id,
      });
    }
  }, [activeTab, id, inquiryForm]);

  useEffect(() => {
    if (id) {
      inquiryForm.setFieldsValue({
        visa: id,
      });
    }
  }, [id, inquiryForm]);

  // ── Inquiry Submit ──
  const onInquiryFinish = async (values) => {
    if (!user) return setAuthModalOpen(true);

    const visaId = values?.visa || id;
    if (!visaId) {
      message.error("Unable to identify visa. Please reload the page and try again.");
      setSubmitLoading(false);
      return;
    }

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

      const inquiryPayload = {
        full_name: values.name,
        email: values.email,
        phone: values.phone,
        visa: visaId,
        visa_type: resolvedVisaTypeId,
        visa_name: currentVisaName,
        visa_type_name: currentVisaTypeName,
        message: values.message,
        file,
      };

      await useAction(createVisaQuery, {
        body: inquiryPayload,
      });
      inquiryForm.resetFields();
      router.push("/user/visaInquery");
    } catch (err) {
      console.error("Visa inquiry submission error:", err);
      message.error(err?.response?.data?.errorMessage || "Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenApplyModal = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!appointmentDate) {
      message.error("Please select appointment date first");
      return;
    }
    try {
      const values = await applyForm.validateFields();
      applyDetailsForm.setFieldsValue({
        email: values?.email || user?.email || "",
        phone: values?.phone || user?.phone || "",
      });
      setApplyModalOpen(true);
    } catch {
      // Form validation is handled by antd field rules.
    }
  };

  // ── Apply Submit ──  ← এটাই মূল fix
  const onApplyDetailsFinish = async () => {
    if (!user) return setAuthModalOpen(true);

    // onFinish এর values parameter এর উপর নির্ভর না করে
    // সরাসরি form থেকে getFieldsValue() দিয়ে data নিচ্ছি
    // এটাই production এ কাজ করে reliably
    const values = applyDetailsForm.getFieldsValue(true);

    try {
      const basicValues = await applyForm.validateFields();
      setSubmitLoading(true);

      const applyPayload = {
        visa: id,
        visa_type: resolvedVisaTypeId,
        visa_name: currentVisaName,
        visa_type_name: currentVisaTypeName,
        full_name: basicValues?.name || `${values.given_name || ""} ${values.last_name || ""}`.trim(),
        given_name: values.given_name,
        last_name: values.last_name,
        gender: values.gender,
        date_of_birth: values.date_of_birth?.toISOString?.() || null,
        nationality: values.nationality,
        visited_countries: values.visited_countries,
        passport_number: values.passport_number,
        passport_expiry_date: values.passport_expiry_date?.toISOString?.() || null,
        profession: values.profession,
        local_address: values.local_address,
        foreign_address: values.foreign_address,
        email: values.email,
        phone: values.phone,
        appointment_date: appointmentDate,
        number_of_applicants: applicants,
        price_per_person: pricePerPerson,
        total_price: subtotal,
        inquiry_type: "apply",
      };

      await useAction(createVisaApply, {
        body: applyPayload,
      });

      applyForm.resetFields();
      applyDetailsForm.resetFields();
      setApplicants(1);
      setAppointmentDate(null);
      setApplyModalOpen(false);
      router.push("/user/visaInquery");
    } catch (err) {
      console.error("Visa application submission error:", err);
      message.error(err?.response?.data?.errorMessage || "Failed to submit application. Please try again.");
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
        <Form form={applyForm} layout="vertical">
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
              type="button"
              className="w-full h-[48px] !rounded-xl text-base font-semibold"
              loading={submitLoading}
              onClick={handleOpenApplyModal}
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
            <Form.Item name="visa" hidden>
              <input type="hidden" />
            </Form.Item>
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
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
              <div className="text-sm font-semibold text-[#05073C]">{i18n.t("Current Visa")}</div>
              <div className="text-sm text-[#717171]">
                {id
                  ? currentVisaName || i18n.t("This inquiry will be attached to the current visa automatically.")
                  : i18n.t("N/A")}
              </div>
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

      {/* ── Apply Details Modal ── */}
      <Modal
        open={applyModalOpen}
        onCancel={() => setApplyModalOpen(false)}
        footer={null}
        // destroyOnClose সরিয়ে দিয়েছি — এটাই production এ form data নষ্ট করছিল
        width={760}
        centered
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-[#05073C]">Visa Application Submission</h3>
            <p className="text-sm text-[#717171] mt-1">Sign In to Continue</p>
          </div>

          <Form form={applyDetailsForm} layout="vertical" onFinish={onApplyDetailsFinish}>
            <div className="space-y-4">
              <div className="text-base font-semibold text-[#05073C]">Traveller 1 (Primary Contact)</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="given_name"
                  label="Given Name"
                  placeholder="Given name"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-primary"
                />
                <FormInput
                  name="last_name"
                  label="Last Name"
                  placeholder="Last name"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-primary"
                />
              </div>

              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Radio.Group className="flex gap-6">
                  <Radio value="male">MALE</Radio>
                  <Radio value="female">FEMALE</Radio>
                  <Radio value="other">OTHER</Radio>
                </Radio.Group>
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="date_of_birth"
                  label="Date of Birth"
                  rules={[{ required: true, message: "Please select date of birth" }]}
                >
                  <DatePicker className="w-full h-[46px] rounded-xl border" />
                </Form.Item>

                <FormInput
                  name="nationality"
                  label="Nationality"
                  placeholder="Nationality"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-primary"
                />
              </div>

              <FormInput
                name="visited_countries"
                textArea
                rows={2}
                label="Visited Countries"
                placeholder="Visited countries"
                required
                className="w-full p-3 border rounded-xl focus:outline-primary"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="passport_number"
                  label="Passport Number"
                  placeholder="Passport number"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-primary"
                />

                <Form.Item
                  name="passport_expiry_date"
                  label="Passport Expiry Date"
                  rules={[{ required: true, message: "Please select passport expiry date" }]}
                >
                  <DatePicker className="w-full h-[46px] rounded-xl border" />
                </Form.Item>
              </div>

              <FormInput
                name="profession"
                label="Profession"
                placeholder="Profession"
                required
                className="w-full p-3 border rounded-xl focus:outline-primary"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="local_address"
                  textArea
                  rows={2}
                  label="Local Address"
                  placeholder="Local address"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-primary"
                />
                <FormInput
                  name="foreign_address"
                  textArea
                  rows={2}
                  label="Foreign Address"
                  placeholder="Foreign address"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="phone"
                  label="Phone Number"
                  placeholder="Phone number"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-primary"
                />
                <FormInput
                  name="email"
                  label="Email Address"
                  placeholder="Email address"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-[48px] !rounded-xl text-base font-semibold"
                loading={submitLoading}
              >
                Submit Application
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      <AuthModal
        authModalOpen={authModalOpen}
        setAuthModalOpen={setAuthModalOpen}
        slug={`/visa/${id}`}
      />
    </div>
  );
};

export default VisaForm;