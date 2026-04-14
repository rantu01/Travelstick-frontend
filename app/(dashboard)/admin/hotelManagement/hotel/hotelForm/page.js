/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/contexts/i18n";
import { Form } from "antd";
import {
  createHotel,
  getDestination,
  getAllSidePublicHotel,
  singleImageUpload,
  updateHotel,
} from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import FormInput, { HiddenInput } from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import FormSelect from "@/app/components/form/select";
import JodiEditor from "@/app/components/form/jodiEditor";
import Button from "@/app/(dashboard)/components/common/button";
import { noSelected } from "@/app/helper/utils";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";

const HotelForm = ({ isEdit = false, data }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [destination] = useFetch(getDestination, { limit: 100 });
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
        banner_video_url: data?.banner_video_url,
        about: data?.about || {},
        destination: data?.destination?._id,
        mapLink: data?.mapLink,

        banner_image: data?.banner_image
          ? [
            {
              uid: "-1",
              name: "image",
              status: "done",
              url: data.banner_image,
            },
          ]
          : [],

        card_image: data?.card_image
          ? [
            {
              uid: "-1",
              name: "card.png",
              status: "done",
              url: data.card_image,
            },
          ]
          : [],

        images: Array.isArray(data?.images)
          ? data.images.map((url, index) => ({
            uid: String(index),
            name: `image-${index}.png`,
            status: "done",
            url,
          }))
          : [],

        highlight: Array.isArray(data?.highlight) ? data.highlight : [],
        include: Array.isArray(data?.include) ? data.include : [],
        exclude: Array.isArray(data?.exclude) ? data.exclude : [],
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

  const mapOptionValues = (values = []) =>
    values
      .filter((item) => item?.name)
      .map((item) => ({ label: item.name, value: item.name }));

  const hotelTypeOptions =
    mapOptionValues(sidebarMap.hotel_type) || [];
  const roomTypeOptions =
    mapOptionValues(sidebarMap.room_type) || [];
  const neighborhoodOptions =
    mapOptionValues(sidebarMap.neighborhood) || [];
  const mealPlanOptions =
    mapOptionValues(sidebarMap.meal_plans) || [];
  const reservationPolicyOptions =
    mapOptionValues(sidebarMap.reservation_policies) || [];
  const refundabilityOptions =
    mapOptionValues(sidebarMap.refundability) || [];
  const facilitiesOptions =
    mapOptionValues(sidebarMap.facilities_services) || [];

  const fallbackHotelTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "bungalow", label: "Bungalow" },
    { value: "villa", label: "Villa" },
    { value: "hostel", label: "Hostel" },
    { value: "guesthouse", label: "Guesthouse" },
    { value: "boutique", label: "Boutique Hotel" },
    { value: "resort", label: "Resort" },
    { value: "palace", label: "Palace" },
    { value: "motel", label: "Motel" },
    { value: "serviced_apartment", label: "Serviced Apartment" },
  ];

  const fallbackRoomTypes = [
    { value: "single", label: "Single Room" },
    { value: "double", label: "Double Room" },
    { value: "twin", label: "Twin Room" },
    { value: "deluxe", label: "Deluxe King Suite" },
    { value: "family", label: "Family Room" },
    { value: "suite", label: "Suite" },
    { value: "junior_suite", label: "Junior Suite" },
    { value: "executive_suite", label: "Executive Suite" },
    { value: "studio", label: "Studio" },
    { value: "sea_view", label: "Sea View Room" },
  ];

  const fallbackMealPlans = [
    { label: "Bed & Breakfast (BB)", value: "bb" },
    { label: "Half Board (HB)", value: "hb" },
    { label: "Full Board (FB)", value: "fb" },
    { label: "All Inclusive (AI)", value: "ai" },
    { label: "Room Only (RO)", value: "ro" },
  ];

  const fallbackReservationPolicies = [
    { label: "Free cancellation", value: "free_cancellation" },
    { label: "Book without credit card", value: "no_credit_card" },
    { label: "No prepayment", value: "no_prepayment" },
    { label: "Prepayment required", value: "prepayment_required" },
    { label: "Deposit required", value: "deposit_required" },
    { label: "Pay at hotel", value: "pay_at_hotel" },
  ];

  const fallbackFacilities = [
    { label: "Free Wi-Fi", value: "wifi" },
    { label: "Swimming Pool", value: "swimming_pool" },
    { label: "Fitness Center", value: "fitness_center" },
    { label: "Spa", value: "spa" },
    { label: "Restaurant", value: "restaurant" },
    { label: "Bar", value: "bar" },
    { label: "Airport Shuttle", value: "airport_shuttle" },
    { label: "Free Parking", value: "parking" },
    { label: "Room Service", value: "room_service" },
    { label: "Laundry", value: "laundry" },
    { label: "24-hour Reception", value: "24h_reception" },
    { label: "Concierge", value: "concierge" },
    { label: "Pet Friendly", value: "pet_friendly" },
    { label: "Family Rooms", value: "family_rooms" },
    { label: "Wheelchair Accessible", value: "wheelchair_accessible" },
  ];

  const fallbackRefundability = [
    { label: "Refundable", value: "refundable" },
    { label: "Non Refundable", value: "non_refundable" },
    { label: "Partially Refundable", value: "partially_refundable" },
  ];

  const fallbackNeighborhoods = [
    { label: "Sukhumvit", value: "sukhumvit" },
    { label: "Silom", value: "silom" },
    { label: "Khaosan", value: "khaosan" },
    { label: "Rattanakosin", value: "rattanakosin" },
    { label: "Chatuchak", value: "chatuchak" },
    { label: "Riverside", value: "riverside" },
    { label: "Phra Khanong", value: "phra_khanong" },
    { label: "Thonglor", value: "thonglor" },
  ];

  const getDestinationLabel = (item) =>
    item?.name?.[langCode] || item?.name || item?.address?.name || item?._id;

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
              image_name: "hotel_banner",
            });
            bannerImageUrl = data?.image || "";
          } else {
            bannerImageUrl = values?.banner_image?.[0]?.url || "";
          }

          if (values?.card_image?.[0]?.originFileObj) {
            const { data } = await singleImageUpload({
              image: values.card_image[0].originFileObj,
              image_name: "hotel_card",
            });
            cardImageUrl = data?.image || "";
          } else {
            cardImageUrl = values?.card_image?.[0]?.url || "";
          }
          const feathersData = await Promise.all(
            (values?.feathers || []).map(async (feather) => {
              let logo = "";

              if (feather?.logo?.[0]?.originFileObj) {
                const { data } = await singleImageUpload({
                  image: feather.logo[0].originFileObj,
                  image_name: "feature_logo",
                });
                logo = data?.image || "";
              } else {
                logo = feather?.logo?.[0]?.url || "";
              }

              const text = {};
              languages?.forEach((lang) => {
                text[lang.code] = feather?.text?.[lang.code] || "";
              });

              return {
                logo,
                text,
              };
            })
          );

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

          // Normalize single-value fields that may be submitted as tags (array)
          const normalizeSingleTag = (field) => {
            const val = values[field];
            if (Array.isArray(val)) return val.length ? val[0] : "";
            return val;
          };

          values.hotel_type = normalizeSingleTag("hotel_type");
          values.room_type = normalizeSingleTag("room_type");
          values.neighborhood = normalizeSingleTag("neighborhood");

          const multiLangFields = ["name", "about"];
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
            banner_image: bannerImageUrl,
            card_image: cardImageUrl,
            images,
          };

          setSubmitLoading(true);
          await useAction(
            isEdit ? updateHotel : createHotel,
            { body: requestData },
            () => {
              form.resetFields();
              setSubmitLoading(false);
              router.push("/admin/hotelManagement/hotel");
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
          label="Images"
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
              label="Hotel Name"
              name={["name", l.code]}
              required
              className="!w-full rounded bg-transparent p-3 dashinput"
              placeholder={i18n.t("Hotel Name")}
            />
            <JodiEditor
              name={["about", l.code]}
              label={i18n?.t("About Hotel")}
              className="w-full rounded bg-transparent p-3 dashinput"
              required
              value={form.getFieldValue("about") || ""}
              onChange={(newDescription) =>
                form.setFieldValue("about", newDescription)
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <FormSelect
                label={i18n.t("Hotel Destination")}
                name="destination"
                placeholder={i18n.t("Select Hotel Destination")}
                required
                className="!w-full rounded bg-transparent py-6 px-2 dashinput"
                options={destination?.docs?.map((cat) => ({
                  label: getDestinationLabel(cat),
                  value: cat?._id,
                }))}
              />
              <FormInput
                label="Video URL"
                name="banner_video_url"
                required
                type={"url"}
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("Banner Video URL")}
              />
            </div>
            <div className="mt-5">
              <FormInput
                label="Map Link"
                name="mapLink"
                type={"url"}
                className="w-full rounded bg-transparent p-3 dashinput"
                placeholder={i18n.t("Enter Google Maps or similar map link")}
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormInput
            label="Hotel Reputation"
            name="star"
            required
            type={"number"}
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("eg 3, 4, 5")}
          />
          <FormInput
            label="Hotel Contain Capacity"
            name="limit"
            required
            type={"number"}
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("eg 200, 500, 1000")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormSelect
            label={i18n.t("Hotel Type")}
            name={"hotel_type"}
            placeholder={i18n.t("Select Hotel Type")}
            required
            tags
            allowClear
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={hotelTypeOptions.length ? hotelTypeOptions : fallbackHotelTypes}
          />
          <FormSelect
            label={i18n.t("Room Type")}
            name={"room_type"}
            placeholder={i18n.t("Select Room Type")}
            required
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            tags
            allowClear
            options={roomTypeOptions.length ? roomTypeOptions : fallbackRoomTypes}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormInput
            label={i18n.t("Distance from City (KM)")}
            name="distance_from_city"
            type={"number"}
            getValueFromEvent={(e) => +e.target.value}
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("e.g. 5")}
          />
          <FormSelect
            label={i18n.t("Neighborhood")}
            name="neighborhood"
            placeholder={i18n.t("Select Neighborhood")}
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            tags
            allowClear
            options={neighborhoodOptions.length ? neighborhoodOptions : fallbackNeighborhoods}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormSelect
            label={i18n.t("Hotel Card Badges")}
            name="card_badges"
            placeholder={i18n.t("Add card badges")}
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={facilitiesOptions.length ? facilitiesOptions : fallbackFacilities}
            tags
          />
          <FormInput
            label={i18n.t("Hotel Card Room Label")}
            name="card_room_label"
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("e.g. Standard")}
          />
        </div>
        <div className="mt-5">
          <FormInput
            label={i18n.t("Hotel Card Room Details")}
            name="card_room_details"
            className="w-full rounded bg-transparent p-3 dashinput"
            placeholder={i18n.t("e.g. Non Refundable • Breakfast Included")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormSelect
            label={i18n.t("Meal Plans")}
            name="meal_plans"
            placeholder={i18n.t("Select Meal Plans")}
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={mealPlanOptions.length ? mealPlanOptions : fallbackMealPlans}
            tags
          />
          <FormSelect
            label={i18n.t("Reservation policy")}
            name="reservation_policies"
            placeholder={i18n.t("Select Reservation Policy")}
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={reservationPolicyOptions.length ? reservationPolicyOptions : fallbackReservationPolicies}
            tags
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormSelect
            label={i18n.t("Refundability")}
            name="refundability"
            placeholder={i18n.t("Select Refundability")}
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={refundabilityOptions.length ? refundabilityOptions : fallbackRefundability}
          />
          <FormSelect
            label={i18n.t("Facilities and Services")}
            name="facilities_services"
            placeholder={i18n.t("Select Facilities and Services")}
            className="w-full rounded bg-transparent py-6 px-2 dashinput !text-white"
            options={facilitiesOptions.length ? facilitiesOptions : fallbackFacilities}
            tags
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
        {/* Highlights */}
        <div className="mt-1 border rounded-md p-3">
          <h3 className="description-2 mb-2">{i18n.t("Highlights")}</h3>
          <Form.List name="highlight" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {fields.map(({ key, name: fieldName }, index) => (
                    <div key={key} className="w-full md:w-[48%] rounded">
                      {languages?.map((l) => (
                        <div
                          key={l.code}
                          style={{
                            display: l.code === selectedLang ? "block" : "none",
                          }}
                        >
                          <FormInput
                            name={[fieldName, l.code]}
                            placeholder={`Highlight (${l.code})`}
                            type="text"
                            required
                            className="!w-full rounded bg-transparent p-3 dashinput"
                            label={`Highlight ${index + 1} (${l.code})`}
                          />
                        </div>
                      ))}
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
                  onClick={() => add({})}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  Add Highlight
                </button>
              </div>
            )}
          </Form.List>
        </div>

        {/* Include */}
        <div className="mt-5 border rounded-md p-3">
          <h3 className="description-2 mb-2">{i18n.t("Includes")}</h3>
          <Form.List name="include" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {fields.map(({ key, name: fieldName }, index) => (
                    <div key={key} className="w-full md:w-[48%] rounded">
                      {languages?.map((l) => (
                        <div
                          key={l.code}
                          style={{
                            display: l.code === selectedLang ? "block" : "none",
                          }}
                        >
                          <FormInput
                            name={[fieldName, l.code]}
                            placeholder={`Input include ${index + 1}`}
                            type="text"
                            required
                            className="!w-full rounded bg-transparent p-3 dashinput"
                            label={`Include ${index + 1} (${l.code})`}
                          />
                        </div>
                      ))}
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
                  onClick={() => add({})}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  Add Include
                </button>
              </div>
            )}
          </Form.List>
        </div>
        {/* exclude */}
        <div className="mt-5 border rounded-md p-3">
          <h3 className="description-2 mb-2">{i18n.t("Excludes")}</h3>
          <Form.List name="exclude" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {fields.map(({ key, name: fieldName }, index) => (
                    <div key={key} className="w-full md:w-[48%] rounded">
                      {languages?.map((l) => (
                        <div
                          key={l.code}
                          style={{
                            display: l.code === selectedLang ? "block" : "none",
                          }}
                        >
                          <FormInput
                            name={[fieldName, l.code]}
                            placeholder={`Input exclude ${index + 1}`}
                            type="text"
                            required
                            className="!w-full rounded bg-transparent p-3 dashinput"
                            // label={`Exclude ${index + 1}`}
                            label={`Exclude ${index + 1} (${l.code})`}
                          />
                        </div>
                      ))}
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
                  onClick={() => add({})}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                >
                  Add Exclude
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
          {i18n.t("Submit")}
        </Button>
      </Form>
    </div>
  );
};

export default HotelForm;
