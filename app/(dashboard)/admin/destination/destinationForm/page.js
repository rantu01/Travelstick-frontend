/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState, useMemo } from "react";
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

// OpenStreetMap (Leaflet) Imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet default icon fix (Required for production)
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Internal Component to handle map clicks
const LocationMarker = ({ position, setPosition, setGoogleAddress }) => {
  useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      // Reverse Geocoding to get Address Name (Free Nominatim API)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newPos.lat}&lon=${newPos.lng}`)
        .then(res => res.json())
        .then(data => {
          const addressData = {
            name: data.display_name || "Selected Location",
            lat: newPos.lat,
            lng: newPos.lng
          };
          setGoogleAddress(addressData);
        });
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

const DestinationForm = ({ isEdit = false, data }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const i18n = useI18n();
  let { languages, langCode } = useI18n();
  const [selectedLang, setSelectedLang] = useState(langCode);
  const [googleAddress, setGoogleAddress] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.6850, lng: 90.3563 }); // Default Center (Bangladesh)

  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    if (isEdit && data) {
      form.resetFields();
      if (data?.address) {
        setGoogleAddress(data.address);
        if (data.address.lat && data.address.lng) {
          setMapCenter({ lat: data.address.lat, lng: data.address.lng });
        }
      }
      form.setFieldsValue({
        ...data,
        address: data?.address || null,
        expert: data?.expert?._id,
        banner_image: data?.banner_image
          ? [{ uid: "-1", name: "image.png", status: "done", url: data?.banner_image }]
          : [],
        card_image: data?.card_image
          ? [{ uid: "-1", name: "image.png", status: "done", url: data?.card_image }]
          : [],
        images: data?.images?.length > 0
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
                const { data } = await singleImageUpload({ image: file.originFileObj });
                return data?.image || "";
              }
              return file.url;
            });
            images = await Promise.all(uploadPromises);
          }

          const requestData = {
            ...values,
            _id: isEdit ? data._id : undefined,
            banner_image: bannerImageUrl,
            card_image: cardImageUrl,
            images: images,
            address: googleAddress, // Saving OSM address data
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
          <MultipleImageInput label="Banner Image" name="banner_image" required />
          <MultipleImageInput label="Card Image" name="card_image" required />
        </div>
        <MultipleImageInput name="images" label="Destination Images" required max={12} />

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
          <FormInput label="Destination Name" name="name" required className="dashinput" />
          <FormInput label="Destination Capital Name" name="capital" required className="dashinput" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="Destination Language Name" name="language" required className="dashinput" />
          <FormInput label="Destination Currency Name" name="currency" required className="dashinput" />
        </div>
        <FormInput label="Destination Video URL" name="video_url" required className="dashinput" />

        {/* FREE OPEN STREET MAP SECTION */}
        <div className="mt-4">
          <label className="block mb-2 font-medium">Select Location (OpenStreetMap)</label>
          <div className="h-[400px] w-full border rounded-lg overflow-hidden z-0">
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={7}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker 
                position={googleAddress} 
                setPosition={setGoogleAddress} 
                setGoogleAddress={(val) => {
                  setGoogleAddress(val);
                  form.setFieldsValue({ address: val });
                }}
              />
            </MapContainer>
          </div>
          {googleAddress && (
            <p className="mt-2 text-sm text-gray-600">
              <strong>Selected:</strong> {googleAddress.name}
            </p>
          )}
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