/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { Form } from "antd";
import {
  postDestination,
  singleImageUpload,
  updateDestination,
} from "@/app/helper/backend";
import { useAction } from "@/app/helper/hooks";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormSelect from "@/app/components/form/select";
import Button from "@/app/(dashboard)/components/common/button";
import { noSelected } from "@/app/helper/utils";
import { useRouter } from "next/navigation";
import { countries } from "countries-list";

const DestinationForm = ({ isEdit = false, data }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const i18n = useI18n();
  let { languages, langCode } = useI18n();
  const [selectedLang, setSelectedLang] = useState(langCode);

  const countryOptions = useMemo(
    () =>
      Object.entries(countries)
        .map(([code, country]) => ({
          value: country.name,
          label: country.name,
          searchLabel: `${country.name} ${code}`.toLowerCase(),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    if (isEdit && data) {
      form.resetFields();
      const previewImage =
        data?.image || data?.card_image || data?.banner_image || data?.images?.[0] || "";

      form.setFieldsValue({
        ...data,
        image: previewImage
          ? [{ uid: "-1", name: "destination-image.png", status: "done", url: previewImage }]
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
            type="button"
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
          let imageUrl = "";
          if (values?.image?.[0]?.originFileObj) {
            const { data } = await singleImageUpload({
              image: values.image[0].originFileObj,
              image_name: "destination_image",
            });
            imageUrl = data?.image || "";
          } else {
            imageUrl = values?.image?.[0]?.url || "";
          }

          const requestData = {
            ...values,
            _id: isEdit ? data._id : undefined,
            image: imageUrl,
            card_image: imageUrl,
            banner_image: imageUrl,
            images: imageUrl ? [imageUrl] : [],
          };

          await useAction(
            isEdit ? updateDestination : postDestination,
            { body: requestData },
            () => {
              form.resetFields();
              router.push("/admin/destination");
            }
          );
        }}
        className="mt-2"
      >
        {isEdit && <HiddenInput name="_id" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 ">
          <MultipleImageInput label="Destination Image" name="image" required max={1} />
          <FormSelect
            label="Destination Country"
            name="country"
            required
            options={countryOptions}
            placeholder="Select country"
            search
          />
        </div>

        {languages?.map((l) => (
          <div key={l.code} style={{ display: l.code === selectedLang ? "block" : "none" }}>
            <FormInput
              label="Title"
              name={["short_description", l.code]}
              required
              className="!w-full rounded bg-transparent p-3 dashinput"
              placeholder={i18n.t("Title")}
            />
            <FormInput
              textArea={true}
              rows={4}
              label="About Destination"
              name={["description", l.code]}
              required
              className="!w-full rounded bg-transparent p-3 dashinput"
              placeholder={i18n.t("About Destination")}
            />
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Destination Name"
            name="name"
            required
            className="dashinput"
          />
        </div>

        <Button
          type="submit"
          onClick={() => noSelected({ form, setSelectedLang })}
          className="my-6"
        >
          {i18n.t(isEdit ? "Update Destination" : "Submit")}
        </Button>
      </Form>
    </div>
  );
};

export default DestinationForm;