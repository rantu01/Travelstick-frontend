"use client";
import { Form, Modal, Tooltip } from "antd";
import { useEffect, useState } from "react";
import BackButton from "../../components/common/backButton";
import Table from "../../components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import { useAction, useFetch } from "@/app/helper/hooks";
import {
  deleteContact,
  getAllContacts,
  replyContact,
} from "@/app/helper/backend";
import dayjs from "dayjs";
import Button from "../../components/common/button";
import { Loader } from "../../components/common/loader";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import JodiEditor from "@/app/components/form/jodiEditor";

const Contact = () => {
  let { langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getAllContacts);
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [isReset, setIsReset] = useState(false);
  const [replyId, setReplyId] = useState("");
  const [mailLoading, setMailLoading] = useState(false);

  const columns = [
    {
      text: "Name",
      dataField: "name",
    },
    {
      text: "Email",
      dataField: "email",
    },
    {
      text: "Subject",
      dataField: "subject",
      formatter: (subject) => {
        const formattedTitle = subject || ""; // Ensure it's accessible
        const shouldTruncate = formattedTitle.length > 20;

        return (
          <Tooltip title={shouldTruncate ? formattedTitle : ""}>
            <span className="cursor-help">
              {shouldTruncate
                ? formattedTitle.slice(0, 20) + "..."
                : formattedTitle}
            </span>
          </Tooltip>
        );
      },
    },
    {
      text: "Message",
      dataField: "message",
      formatter: (value) => {
        const formattedValue = value || ""; // Ensure it's accessible
        const shouldTruncate = formattedValue.length > 30;

        return (
          <Tooltip title={shouldTruncate ? formattedValue : ""}>
            <span className="cursor-help">
              {shouldTruncate
                ? formattedValue.slice(0, 30) + "..."
                : formattedValue}
            </span>
          </Tooltip>
        );
      },
    },
    {
      text: "Contact At",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMM, YYYY")}</span>
      ),
    },
    {
      text: i18n.t("Reply"),
      dataField: "mailSent",
      formatter: (_, d) => (
        <Button
          className="rounded-lg bg-primary !duration-500 text-[#C7D1DA] hover:text-primary !py-2 !px-4 !text-sm"
          onClick={() => {
            setIsReset(true);
            setReplyId(d?._id);
          }}
        >
          {i18n.t("Reply")}
        </Button>
      ),
    },
  ];
  const handleSendReply = async (values) => {
    setMailLoading(true);
    values._id = replyId;
    const submitData = {
      body: { ...values },
    };

    await useAction(
      replyContact,
      submitData,
      () => {
        setIsReset(false);
        getData();
        form.resetFields();
        setMailLoading(false); 
      },
      i18n.t("Mail Sent Successfully")
    ).catch(() => setMailLoading(false));
  };
  return (
    <>
      <div className="w-full overflow-x-auto mt-7 px-6">
        <div className="rounded dashboardInput bg-white">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">
              {i18n.t("Contact Us List")}
            </h1>
            <BackButton />
          </div>
          {data && (
            <Table
              columns={columns}
              data={data}
              loading={loading}
              onReload={getData}
              pagination
              onDelete={deleteContact}
              indexed
              langCode={langCode}
            />
          )}
        </div>
        <Modal
          className=" xl:!w-[700px]"
          open={isReset}
          onCancel={() => {
            setIsReset(false);
            form.resetFields();
          }}
          footer={null}
          title={
            <h2 className="text-[#05073C] heading-4 text-center">
              {i18n?.t("Send reply for Contact User")}
            </h2>
          }
        >
          {mailLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <Form
              form={form}
              onFinish={handleSendReply}
              layout="vertical"
              className="space-y-4"
            >
              <HiddenInput name="_id" />

              <FormInput
                name="subject"
                label={i18n.t("Subject")}
                required
                placeholder={i18n.t("Enter Subject")}
                className="w-full rounded bg-transparent p-3 dashinput"
              />

              <JodiEditor
                name="message"
                label={"Message"}
                className="w-full rounded bg-transparent p-3 dashinput"
                required
                value={form.getFieldValue("message") || ""}
                onChange={(newDescription) =>
                  form.setFieldValue("message", newDescription)
                }
              />

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setIsReset(false)}
                  className="bg-primary text-[#2b2b2b] px-4 py-2 rounded-lg"
                >
                  {i18n?.t("Close")}
                </Button>

                <Button
                  type="submit"
                  loading={mailLoading}
                  className="bg-primary text-[#2b2b2b] px-4 py-2 !rounded-lg"
                >
                  {i18n?.t("Send")}
                </Button>
              </div>
            </Form>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Contact;
