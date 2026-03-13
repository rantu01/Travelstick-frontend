/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { Form, notification } from "antd";
import {
  createRoom,
  getAllHotel,
  getAllSidePublicHotel,
  singleImageUpload,
  updateRoom,
} from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormSelect from "@/app/components/form/select";
import Button from "@/app/(dashboard)/components/common/button";
import { noSelected } from "@/app/helper/utils";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";

const RoomForm = ({ isEdit = false, data }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [hotels] = useFetch(getAllHotel, { limit: 100 });
  const [hotelSidebarOptions] = useFetch(getAllSidePublicHotel);
  let { languages, langCode } = useI18n();
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
        name: data?.name,
        hotel: data?.hotel?._id || data?.hotel,

        images: Array.isArray(data?.images)
          ? data.images.map((url, index) => ({
            uid: String(index),
            name: `image-${index}.png`,
            status: "done",
            url,
          }))
          : [],
      });
    }
  }, [data, form, isEdit]);

  const sidebarMap = useMemo(() => {
    const map = {};
    (hotelSidebarOptions || []).forEach((item) => {
      map[item.key] = item.values;
    });
    return map;
  }, [hotelSidebarOptions]);

  const mealPlanOptions = (sidebarMap.meal_plans || []).map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const refundabilityOptions = (sidebarMap.refundability || []).map((item) => ({
    value: item.name,
    label: item.name === "non_refundable" ? "Non Refundable" : "Refundable",
  }));

  const fallbackMealPlans = [
    "Bed & Breakfast (BB)",
    "Half Board (HB)",
    "Room Only (RO)",
  ].map((value) => ({ value, label: value }));

  const fallbackRefundability = [
    { value: "refundable", label: "Refundable" },
    { value: "non_refundable", label: "Non Refundable" },
  ];

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
          setSubmitLoading(true);
          try {
            let images = [];

            if (values?.images?.length > 0) {
              const uploadPromises = values.images.map(async (file) => {
                if (!file.url) {
                  const res = await singleImageUpload({
                    image: file.originFileObj,
                  });
                  if (res.success) {
                    return res.data?.image || "";
                  } else {
                    throw new Error(res.message || "Image upload failed");
                  }
                }
                return file.url;
              });

              images = await Promise.all(uploadPromises);
            }

            const multiLangFields = ["name"];
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
              images,
            };

            await useAction(
              isEdit ? updateRoom : createRoom,
              isEdit ? { id: requestData._id, body: requestData } : { body: requestData },
              () => {
                form.resetFields();
                setSubmitLoading(false);
                router.push("/admin/hotelManagement/room");
              }
            );
          } catch (error) {
            notification.error({
              message: error.message || "Failed to upload images",
            });
            setSubmitLoading(false);
          }
        }}
        className="mt-2"
      >
        {isEdit && <HiddenInput name="_id" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormSelect
            label={i18n.t("Select Hotel")}
            name="hotel"
            placeholder={i18n.t("Select Hotel")}
            required
            className="!w-full rounded bg-transparent py-6 px-2 dashinput"
            options={hotels?.docs?.map((hotel) => ({
              label: hotel?.name?.[langCode] || hotel?.name?.en,
              value: hotel?._id,
            }))}
          />
        </div>

        <MultipleImageInput
          name="images"
          label="Room Images"
          required
          max={8}
        />

        {languages?.map((l) => (
          <div
            key={l.code}
            style={{
              display: l.code === selectedLang ? "block" : "none",
            }}
          >
            <FormInput
              label="Room Name"
              name={["name", l.code]}
              required
              className="!w-full rounded bg-transparent p-3 dashinput"
              placeholder={i18n.t("Room Name")}
            />
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormInput
            label="Bed Type"
            name="bed_type"
            required
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder="e.g., King, Queen, Twin"
          />
          <FormInput
            label="Room Size"
            name="size"
            required
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder="e.g., 20 m²"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormInput
            label="Adults Capacity"
            name={["capacity", "adults"]}
            type="number"
            required
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder="Number of adults"
          />
          <FormInput
            label="Children Capacity"
            name={["capacity", "children"]}
            type="number"
            required
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder="Number of children"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormSelect
            label={i18n.t("Meal Plans")}
            name="meal_plan"
            placeholder={i18n.t("Select Meal Plan")}
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={mealPlanOptions.length ? mealPlanOptions : fallbackMealPlans}
          />
          <FormSelect
            label={i18n.t("Refundability")}
            name="refundability"
            placeholder={i18n.t("Select Refundability")}
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={refundabilityOptions.length ? refundabilityOptions : fallbackRefundability}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <FormInput
            label={i18n.t("Price")}
            name={["price", "amount"]}
            type="number"
            required
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Input Price")}
          />
          <FormSelect
            label={i18n.t("Discount Type")}
            name={["price", "discount_type"]}
            placeholder={i18n.t("Select Discount Type")}
            required
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={[
              { value: "percent", label: "Percentage" },
              { value: "flat", label: "Flat" },
            ]}
          />
          <FormInput
            label={i18n.t("Discount Amount")}
            name={["price", "discount"]}
            type="number"
            required
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("Discount Amount")}
          />
        </div>

        {/* Amenities */}
        <div className="mt-5 border rounded-md p-3">
          <h3 className="description-2 mb-2">{i18n.t("Amenities")}</h3>
          <Form.List name="amenities" initialValue={["Free WiFi"]}>
            {(fields, { add, remove }) => (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {fields.map(({ key, name: fieldName }, index) => (
                    <div key={key} className="w-full md:w-[48%] rounded">
                      <FormSelect
                        label={`Amenity ${index + 1}`}
                        name={fieldName}
                        placeholder={i18n.t("Select Amenity")}
                        required
                        className="!w-full rounded bg-transparent py-6 px-2 dashinput"
                        options={[
                          { label: "Free WiFi", value: "Free WiFi" },
                          { label: "Air Conditioning", value: "Air Conditioning" },
                          { label: "Private Bathroom", value: "Private Bathroom" },
                          { label: "Flat-screen TV", value: "Flat-screen TV" },
                          { label: "Balcony/Terrace", value: "Balcony/Terrace" },
                          { label: "Mini Bar", value: "Mini Bar" },
                          { label: "Coffee Machine", value: "Coffee Machine" },
                          { label: "Safe Box", value: "Safe Box" },
                          { label: "Ironing Facilities", value: "Ironing Facilities" },
                          { label: "Electric Kettle", value: "Electric Kettle" },
                        ]}
                      />
                      <div className="text-right mt-3">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-primary"
                            onClick={() => remove(fieldName)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => add("Free WiFi")}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  Add Amenity
                </button>
              </div>
            )}
          </Form.List>
        </div>

        <Button
          type="submit"
          onClick={() => noSelected({ form, setSelectedLang })}
          className="my-6"
          loading={submitLoading}
        >
          {isEdit ? "Update Room" : "Create Room"}
        </Button>
      </Form>
    </div>
  );
};

export default RoomForm;
