/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { Form } from "antd";
import {
  blogCategoriesGet,
  blogCreate,
  blogTagGet,
  blogUpdate,
  singleImageUpload,
} from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormSelect from "@/app/components/form/select";
import Button from "@/app/(dashboard)/components/common/button";
import { noSelected } from "@/app/helper/utils";
import { useRouter } from "next/navigation";
import JodiEditor from "@/app/components/form/jodiEditor";

const BlogForm = ({ isEdit = false, data }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [category] = useFetch(blogCategoriesGet, { limit: 100 });
  const [tags] = useFetch(blogTagGet, { limit: 100 });
  let { languages, langCode } = useI18n();
  const [selectedLang, setSelectedLang] = useState(langCode);
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    if (isEdit && data) {
      form.resetFields();
      form.setFieldsValue({
        ...data,
        tags: data?.tags?.map((tag) => tag?._id),
        category: data?.category?._id,
        banner_image: data?.banner_image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: data?.banner_image,
              },
            ]
          : [],
        card_image: data?.card_image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: data?.card_image,
              },
            ]
          : [],
      });
    }
  }, [data, form, isEdit]);
  return (
    <div className="">
      <div className="flex justify-start flex-wrap gap-3 mt-4">
        {languages?.map((l) => (
          <button
            key={l.code}
            onClick={() => setSelectedLang(l.code)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              l.code === selectedLang
                ? "bg-primary text-white"
                : "bg-gray-200 text-[#05073C] hover:bg-gray-300"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          let bannerImageUrl = "";
          let cardImageUrl = "";
          if (values?.banner_image?.[0]?.originFileObj) {
            const { data } = await singleImageUpload({
              image: values.banner_image[0].originFileObj,
              image_name: "blog_banner",
            });
            bannerImageUrl = data?.image || "";
          } else {
            bannerImageUrl = values?.banner_image?.[0]?.url || "";
          }
          if (values?.card_image?.[0]?.originFileObj) {
            const { data } = await singleImageUpload({
              image: values.card_image[0].originFileObj,
              image_name: "blog_card",
            });
            cardImageUrl = data?.image || "";
          } else {
            cardImageUrl = values?.card_image?.[0]?.url || "";
          }
          const multiLangFields = ["title", "description", "short_description"];
          const formattedData = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            languages?.forEach((lang) => {
              acc[field][lang.code] = values[field]?.[lang.code] || "";
            });
            return acc;
          }, {});

          const requestData = {
            ...formattedData,
            _id: isEdit ? values._id : undefined,
            type: values.type,
            category: values.category,
            tags: values.tags,
            read_time: values.read_time,
            banner_image: bannerImageUrl,
            card_image: cardImageUrl,
          };

          await useAction(
            isEdit ? blogUpdate : blogCreate,
            { body: requestData },
            () => {
              router.push("/admin/blog-management/blogs");
              getData();
            }
          );
        }}
        className="mt-2 text-black"
      >
        {isEdit && <HiddenInput name="_id" />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <MultipleImageInput
            label="Banner Image"
            name="banner_image"
            required
          />
          <MultipleImageInput label="Card Image" name="card_image" required />
        </div>

        {languages?.map((l) => (
          <div
            key={l.code}
            style={{
              display: l.code === selectedLang ? "block" : "none",
            }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <FormInput
                  label="Title"
                  name={["title", l.code]}
                  required
                  initialValue={data?.title?.[l.code] || ""}
                  className="w-full rounded bg-transparent p-3 dashinput"
                  placeholder={i18n.t("Title")}
                />
              </div>
              <div className="w-full md:w-1/2">
                <FormInput
                  label="Read Time"
                  name='read_time'
                  getValueFromEvent={(e) => +e.target.value}
                  required
                  type="number"
                  initialValue={data?.read_time || "20"}
                  className="w-full rounded bg-transparent p-3 dashinput"
                  placeholder={i18n.t("eg: 20")}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <FormSelect
                  label={i18n.t("Category")}
                  name="category"
                  placeholder={i18n.t("Select Blog Category")}
                  required
                  className="w-full mt-1 rounded bg-transparent py-6 px-2 dashinput"
                  options={category?.docs?.map((cat) => ({
                    label: cat?.name[l.code] ?? cat?.name["en"],
                    value: cat?._id,
                  }))}
                />
              </div>
              <div className="multiselect w-full md:w-1/2 mt-1">
                <FormSelect
                  label={i18n.t("Tags")}
                  name="tags"
                  placeholder={i18n.t("Select Blog Tags")}
                  required
                  multi
                  className="w-full rounded bg-transparent p-2 dashinput !text-white"
                  options={tags?.docs?.map((tag) => ({
                    label: tag?.name[l.code] ?? tag?.name["en"],
                    value: tag?._id,
                  }))}
                />
              </div>
            </div>

            <FormInput
              label="Short Description"
              name={["short_description", l.code]}
              required
              initialValue={data?.short_description?.[l.code] || ""}
              className="w-full rounded bg-transparent p-3 dashinput"
              textArea
              placeholder={i18n.t("Short Description")}
            />
            <JodiEditor
              name={["description", l.code]}
              label={i18n?.t("Description")}
              className="w-full rounded bg-transparent p-3 dashinput"
              required
              value={form.getFieldValue("description") || ""}
              onChange={(newDescription) =>
                form.setFieldValue("description", newDescription)
              }
            />
          </div>
        ))}

        <Button
          type="submit"
          onClick={() => noSelected({ form, setSelectedLang })}
          className="mt-2.5"
        >
          {i18n.t("Submit")}
        </Button>
      </Form>
    </div>
  );
};

export default BlogForm;
