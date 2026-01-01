/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { Form } from "antd";
import {
  createProduct,
  getAllProductCategories,
  singleImageUpload,
  updateProduct,
} from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormSelect from "@/app/components/form/select";
import Button from "@/app/(dashboard)/components/common/button";
import { noSelected } from "@/app/helper/utils";
import { useRouter } from "next/navigation";

const ProductForm = ({ isEdit = false, data }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [category] = useFetch(getAllProductCategories, { limit: 100 });
  let { languages, langCode } = useI18n();
  const [paid, setPaid] = useState(null);
  const [selectedLang, setSelectedLang] = useState(langCode);
  const [submitLoading, setSubmitLoading] = useState(false);
  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    if (isEdit && data) {
      form.resetFields();
      form.setFieldsValue({
        ...data,
        amount: data?.price?.amount,
        discount_type: data?.price?.discount_type,
        discount: data?.price?.discount,
        category: data?.category?._id,
        thumb_image: data?.thumb_image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: data?.thumb_image,
              },
            ]
          : [],
        images:
          data?.images?.length > 0
            ? data.images.map((url, index) => ({
                uid: `${index}`,
                name: `product-image-${index}.png`,
                status: "done",
                url,
              }))
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
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
          let thumb_image = "";
          if (values?.thumb_image[0]?.originFileObj) {
            const { data } = await singleImageUpload({
              image: values?.thumb_image[0]?.originFileObj,
              image_name: "image",
            });
            thumb_image = data?.image || "";
          } else {
            thumb_image = values?.thumb_image[0]?.url || "";
          }

          let images = [];
          if (values?.images?.length > 0) {
            const uploadPromises = values.images.map(async (file) => {
              if (!file.url) {
                const { data } = await singleImageUpload({
                  image: file.originFileObj,
                });
                return data?.image || "";
              }
              return file.url;
            });

            images = await Promise.all(uploadPromises);
          }
          const multiLangFields = ["description"];
          const formattedData = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            languages?.forEach((lang) => {
              acc[field][lang?.code] = values[field]?.[lang?.code] || "";
            });
            return acc;
          }, {});

          const requestData = {
            ...values,
            ...formattedData,
            _id: isEdit ? values._id : undefined,
            category: values.category,
            thumb_image: thumb_image,
            images: images,
            price: {
              amount: values.amount,
              discount_type: values.discount_type,
              discount: values.discount,
            },
          };
          setSubmitLoading(true);
          await useAction(
            isEdit ? updateProduct : createProduct,
            { body: requestData },
            () => {
              form.resetFields();
              setSubmitLoading(false);
              router.push("/admin/productManagement/products");
            }
          );
        }}
        className="mt-2"
      >
        {isEdit && <HiddenInput name="_id" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 ">
          <MultipleImageInput label="Thumb Image" name="thumb_image" required />
          <MultipleImageInput
            max={6}
            label="Image"
            name="images"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Name"
            name="name"
            required
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Product Name")}
          />
          <FormInput
            label="Price"
            name="amount"
            required
            type="number"
            getValueFromEvent={(e) => Number(e.target.value)}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Product Price")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label={i18n.t("Discount Type")}
            name="discount_type"
            placeholder={i18n.t("Select Discount Type")}
            required
            onChange={(value) => setPaid(value)}
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={[
              { value: "flat", label: "Flat" },
              { value: "percent", label: "Percent" },
            ]}
          />
          <Form.Item
            name="discount"
            label="Discount"
            className="product-error"
            getValueFromEvent={(e) => Number(e.target.value)}
            rules={[
              {
                required: true,
                message: i18n.t("Please input discount"),
              },
              {
                validator: (_, value) => {
                  const amount = form.getFieldValue("amount");
                  if (paid === "flat" && value >= amount) {
                    return Promise.reject(
                      new Error(
                        i18n.t("Flat discount must be less than the price")
                      )
                    );
                  }
                  if (paid === "percent" && value >= 100) {
                    return Promise.reject(
                      new Error(
                        i18n.t("Percent discount must be less than 100")
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <FormInput
              name="discount"
              type="number"
              className="w-full rounded bg-transparent p-3 dashinput"
              placeholder={i18n.t("Product Discount")}
            />
          </Form.Item>
        </div>
        {languages?.map((l) => (
          <div
            key={l.code}
            style={{
              display: l.code === selectedLang ? "block" : "none",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-4">
              <FormInput
                label="Quantity"
                name="quantity"
                required
                type="number"
                getValueFromEvent={(e) => Number(e.target.value)}
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("Product Quantity")}
              />
              <FormSelect
                label={i18n.t("Product Category")}
                name="category"
                placeholder={i18n.t("Select Product Category")}
                required
                className="!w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
                options={category?.docs?.map((cat) => ({
                  label: cat?.name[l.code] ?? cat?.name["en"],
                  value: cat?._id,
                }))}
              />
            </div>
            <FormInput
              label="Description"
              name={["description", l.code]}
              required
              textArea={true}
              rows={4}
              type="text"
              className="w-full rounded bg-transparent p-3 dashinput"
              placeholder={i18n.t("Product Description")}
            />
          </div>
        ))}
        <Button
          type="submit"
          onClick={() => noSelected({ form, setSelectedLang })}
          className="mt-6"
          loading={submitLoading}
        >
          {i18n.t("Submit")}
        </Button>
      </Form>
    </div>
  );
};

export default ProductForm;
