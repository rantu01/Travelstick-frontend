/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Form, Modal, Rate, Tooltip } from "antd";
import { useEffect, useState } from "react";
import FormInput from "@/app/components/form/input";
import { useI18n } from "@/app/contexts/i18n";
import { useAction, useFetch } from "@/app/helper/hooks";
import {
  createTestimonialByUser,
  deleteTestimonialByUser,
  getSpecificUserTestimonial
} from "@/app/helper/backend";
import { noSelected } from "@/app/helper/utils";
import Button from "@/app/(dashboard)/components/common/button";
import UserTable from "@/app/(dashboard)/components/common/userTable";
import { useUser } from "@/app/contexts/user";
const Testimonials = () => {
  const [form] = Form.useForm();
  const { user } = useUser();
  let { languages, langCode } = useI18n();
  const [open, setOpen] = useState(false);
  const [data, getData, { loading }] = useFetch(
    getSpecificUserTestimonial,
    {},
    false
  );
  useEffect(() => {
    getData({ user: user?.id });
  }, []);
  const [selectedLang, setSelectedLang] = useState(undefined);
  const [rating, setRating] = useState(0);

  const i18n = useI18n();
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  const columns = [
    {
      text: "Comment",
      dataField: "comment",
      formatter: (title) => (
        <span>
          <Tooltip
            title={
              title?.length > 30 ? title : undefined
            }
          >
            <span className="cursor-help">
              {title?.length > 30
                ? title?.slice(0, 30) + "..."
                : title}
            </span>
          </Tooltip>
        </span>
      )
    },
    
    {
      text: "Rating",
      dataField: "rating",
      formatter: (_, d) => (
        <Rate className="!text-primary" disabled defaultValue={d?.rating} />
      ),
    },

    {
      text: "Approve Status",
      dataField: "status",
      formatter: (_, d) => <div className="'!w-[100px]'">
        {d?.status === true ? <p className='bg-primary !w-[100px] text-white px-2 py-2 text-center rounded-xl font-poppins'>{i18n?.t("Active") || "Active"}</p> : <p className='bg-red-300 text-white font-poppins text-center !w-[100px] px-2 py-2 rounded-xl'>{i18n?.t("Inactive") || "Inactive"}</p>}
      </div>,
    },

  ];
  return (
    <div className="w-full overflow-x-auto">
      <h4 className="description-3 text-[#05073C]">{i18n?.t("Testimonials") }</h4>
      <div className="mt-6 rating_dashed">
        {langCode && (
          <UserTable
            columns={columns}
            data={data?.docs}
            loading={loading}
            onReload={getData}
            indexed
            title={" "}
            langCode={langCode}
            onDelete={deleteTestimonialByUser}
            action={
              data?.docs?.length <= 0 && (
                <Button
                  onClick={() => {
                    form.resetFields();
                    setOpen(true);
                    setRating(3);
                  }}
                >
                  {i18n?.t("Add New")}
                </Button>
              )
            }
          />
        )}
        <Modal
          className="xl:!w-[700px]"
          open={open}
          onCancel={() => setOpen(false)}
          title={
            <h2 className="description-3 text-[#05073C]">
              {" "}
              {i18n.t("Add Review")}{" "}
            </h2>
          }
          footer={null}
          destroyOnClose={true}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              return useAction(
                createTestimonialByUser,
                {
                  body: {
                    ...values,
                    rating: rating,
                  },
                },
                () => {
                  setOpen(false);
                  getData();
                }
              );
            }}
            className="mt-2"
          >
            <div>
              <Form.Item
                name="rating"
                label={i18n?.t("Rating")}
                rules={[
                  {
                    required: true,
                    message: i18n?.t("Please provide a rating"),
                  },
                ]}
              >
                <Rate
                  onChange={setRating}
                  value={rating}
                  count={5}
                  className="!text-primary"
                />
              </Form.Item>
            </div>
            <FormInput
              name="comment"
              textArea={true}
              rows={4}
              label={i18n?.t("Comment")}
              required
              placeholder={i18n?.t("Write Comment")}
              className="w-full rounded bg-transparent p-3 dashinput"
            />
            <Button
              type="submit"
              onClick={() => noSelected({ form, setSelectedLang })}
              className="mt-2.5"
            >
              {"Submit"}
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Testimonials;
