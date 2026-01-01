/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
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
import Button from "@/app/(dashboard)/components/common/button";
import { noSelected } from "@/app/helper/utils";
import { useRouter } from "next/navigation";
import { MapSelector } from "@/app/components/form/location";
const DestinationForm = ({ isEdit = false, data }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const i18n = useI18n();
  let { languages, langCode } = useI18n();
  const [selectedLang, setSelectedLang] = useState(langCode);
  const [googleAddress, setGoogleAddress] = useState(null);


  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    if (isEdit && data) {

      form.resetFields();
      form.setFieldsValue({
        ...data,
        ...setGoogleAddress(data?.address),
        address: data?.address || null,
        expert: data?.expert?._id,
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

        images:
          data?.images?.length > 0
            ? data.images.map((url, index) => ({
              uid: `${index}`,
              name: `package-image-${index}.png`,
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
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
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

          const address = {
            name: googleAddress?.name,
            lat: googleAddress?.lat,
            lng: googleAddress?.lng,
          };
          const requestData = {
            ...values,
            _id: isEdit ? values._id : undefined,
            banner_image: bannerImageUrl,
            card_image: cardImageUrl,
            images: images,
            address: address,
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
          <MultipleImageInput
            label="Banner Image"
            name="banner_image"
            required
          />
          <MultipleImageInput label="Card Image" name="card_image" required />
        </div>
        <MultipleImageInput
          name="images"
          label="Destination Images"
          required
          max={12}
        />
        {languages?.map((l) => (
          <div
            key={l.code}
            style={{
              display: l.code === selectedLang ? "block" : "none",
            }}
          >
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
            type="text"
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Destination Name")}
          />
          <FormInput
            label="Destination Capital Name"
            name="capital"
            required
            type="text"
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Destination Capital Name")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Destination Language Name"
            name="language"
            required
            type="text"
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Destination Language Name")}
          />
          <FormInput
            label="Destination Currency Name"
            name="currency"
            required
            type="text"
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Destination Currency Name")}
          />
        </div>
        <FormInput
          label="Destination Video URL"
          name="video_url"
          required
          type="text"
          className="w-full rounded bg-transparent p-3 dashinput"
          placeholder={i18n.t("Destination Video URL")}
        />
        <Form.Item label="Location" required name="address">
          <MapSelector
            height={360}
            name="address"
            isGoogleMap={true}
            onChange={(e) => {
              setGoogleAddress(e);
              form.setFieldsValue({ address: e });
            }}
            placeholder={i18n.t("Enter your full address")}
            value={googleAddress}

          />
        </Form.Item>
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
