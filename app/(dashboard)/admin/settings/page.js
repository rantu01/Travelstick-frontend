/* eslint-disable react/no-children-prop */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import {
  fetchSettings,
  postSettings,
  singleImageUpload,
} from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { Form } from "antd";
import BackButton from "../../components/common/backButton";
import FormInput from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import { useEffect } from "react";
import FormSelect from "@/app/components/form/select";
import { useI18n } from "@/app/contexts/i18n";
import Button from "../../components/common/button";
import MultiImageWithTextInput from "@/app/components/form/MultiImageWithTextInput";
export default function Setting() {
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [data, getData, { loading }] = useFetch(fetchSettings);
  useEffect(() => {
    if (data) {
      getData();
    }
  }, []);
  const handleSubmit = async (values) => {
    // ১. ইমেজ আপলোডের জন্য একটি কমন হেল্পার ফাংশন (যাতে কোড বারবার না লিখতে হয়)
    const processSingleFile = async (fileList) => {
      const file = fileList?.[0]; // প্রথম ফাইলটি নেওয়া
      if (!file) return ""; // ফাইল না থাকলে খালি স্ট্রিং

      // যদি ফাইলটি আগে থেকেই সার্ভারে থাকে (url আছে)
      if (file.url) return file.url;

      // যদি নতুন ফাইল হয় এবং আপলোড করার মতো অবজেক্ট থাকে
      if (file.originFileObj) {
        try {
          const { data } = await singleImageUpload({
            image: file.originFileObj,
          });
          return data?.image || "";
        } catch (error) {
          console.error("Image upload failed:", error);
          return "";
        }
      }
      return "";
    };

    // লোগো, ফেভিকন এবং ব্যানার প্রসেস করা
    const site_logo = await processSingleFile(values?.site_logo);
    const fav_icon = await processSingleFile(values?.fav_icon);
    const banner_image = await processSingleFile(values?.banner_image);
    const login_upper_bg_image = await processSingleFile(values?.login_upper_bg_image);
    const login_lower_bg_image = await processSingleFile(values?.login_lower_bg_image);

    // ২. পার্টনার ইমেজ হ্যান্ডেল করা (অবজেক্ট ফরম্যাট: {url, text})
    let partnerImages = [];
    if (values?.partner && Array.isArray(values.partner)) {
      const uploadPromises = values.partner.map(async (file) => {
        let imageUrl = file.url;

        if (!file.url && file.originFileObj) {
          try {
            const { data } = await singleImageUpload({ image: file.originFileObj });
            // এখানে \ স্ল্যাশগুলোকে / স্ল্যাশ দিয়ে রিপ্লেস করা হয়েছে
            imageUrl = (data?.image || "").replace(/\\/g, '/');
          } catch (err) {
            imageUrl = "";
          }
        } else if (imageUrl) {
          // যদি ডাটাবেজ থেকে আসা পুরনো ইমেজেও \ থাকে, সেটিও ঠিক হবে
          imageUrl = imageUrl.replace(/\\/g, '/');
        }

        // শুধুমাত্র ইমেজ ইউআরএল থাকলেই ডাটাবেজে পাঠাবো
        return imageUrl ? { url: imageUrl, text: file.text || "" } : null;
      });

      const results = await Promise.all(uploadPromises);
      partnerImages = results.filter(item => item !== null);
    }

    // ৩. গ্যালারি ইমেজ হ্যান্ডেল করা (স্ট্রিং ফরম্যাট: ["url1", "url2"])
    let galleryImages = [];
    if (values?.gallery && Array.isArray(values.gallery)) {
      const uploadPromises = values.gallery.map(async (file) => {
        if (!file.url && file.originFileObj) {
          try {
            const { data } = await singleImageUpload({ image: file.originFileObj });
            return data?.image || "";
          } catch (err) {
            return "";
          }
        }
        return file.url || "";
      });

      const results = await Promise.all(uploadPromises);
      galleryImages = results.filter(url => url !== ""); // খালি স্ট্রিং বাদ দেওয়া
    }

    // ৪. সোশ্যাল মিডিয়া লিংকের জন্য ফিল্টারিং
    const socialMediaLinks = [
      { name: "facebook", link: values?.facebook },
      { name: "twitter", link: values?.twitter },
      { name: "instagram", link: values?.instagram },
      { name: "linkedin", link: values?.linkedin },
      { name: "youtube", link: values?.youtube },
    ].filter((item) => item.link);

    // ৫. ফাইনাল রিকোয়েস্ট বডি
    const requestBody = {
      body: {
        site_name: values?.site_name || "",
        site_email: values?.site_email || "",
        site_phone: values?.site_phone || "",
        site_address: values?.site_address || "",
        site_description: values?.site_description || "",
        site_logo: site_logo,
        fav_icon: fav_icon,
        banner_image: banner_image,
        login_upper_bg_image: login_upper_bg_image,
        login_lower_bg_image: login_lower_bg_image,
        currency_code: values?.currency_code || "",
        currency_symbol: values?.currency_symbol || "",
        file_upload_type: values?.file_upload_type || "local",
        otp_verification_type: values?.otp_verification_type || "email",
        client_side_url: values?.client_side_url || "",
        server_side_url: values?.server_side_url || "",
        social_media_link: socialMediaLinks,
        per_kiloliter_charge: values?.per_kiloliter_charge || 0,
        delivery_charge: values?.delivery_charge || 0,
        is_product_module: values?.is_product_module ?? false,
        partner: partnerImages,
        gallery: galleryImages,
      },
    };

    // ফাইনাল অ্যাকশন কল
    await useAction(postSettings, requestBody, () => {
      getData(); // ডাটা রিফ্রেশ করা
    });
  };

  useEffect(() => {
    if (data) {
      const socialMediaValues = {};
      data?.social_media_link?.forEach((item) => {
        socialMediaValues[item.name] = item.link;
      });

      form.setFieldsValue({
        ...data,
        ...socialMediaValues,
        site_logo:
          data?.site_logo?.length > 0
            ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: data?.site_logo,
              },
            ]
            : [],
        fav_icon:
          data?.fav_icon?.length > 0
            ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: data?.fav_icon,
              },
            ]
            : [],
        banner_image:
          data?.banner_image?.length > 0
            ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: data?.banner_image,
              },
            ]
            : [],
        login_upper_bg_image:
          data?.login_upper_bg_image?.length > 0
            ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: data?.login_upper_bg_image,
              },
            ]
            : [],
        login_lower_bg_image:
          data?.login_lower_bg_image?.length > 0
            ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: data?.login_lower_bg_image,
              },
            ]
            : [],
        // useEffect এর ভেতর partner ফিল্ড আপডেট করুন
        partner: data?.partner?.length > 0
          ? data.partner.map((item, index) => ({
            uid: `${index}`,
            name: `partner-${index}.png`,
            status: "done",
            url: item.url, // আপনার API যদি অবজেক্ট পাঠায় {url, text}
            text: item.text,
          }))
          : [],
        gallery:
          data?.gallery?.length > 0
            ? data.gallery.map((url, index) => ({
              uid: `${index}`,
              name: `gallery-image-${index}.png`,
              status: "done",
              url,
            }))
            : [],
      });
    }
  }, [data, form]);

  return (
    <>
      <div className="w-full overflow-x-auto mt-7   dashboardModal">
        <div className="rounded dashboardInput mx-6 bg-white ">
          <div className="flex justify-between px-8 pt-8 items-center">
            <h1 className="text-[#05073C] heading-3">{i18n.t("Site Settings")}</h1>
            <BackButton />
          </div>
          <div className="w-full login-form1 mt-6 shadow-md p-7 rounded-lg">
            <Form
              className="w-full"
              onFinish={handleSubmit}
              form={form}
              layout="vertical"
            >
              <div className="flex flex-row gap-6 sm:gap-10">
                <MultipleImageInput
                  name="site_logo"
                  label="Upload Logo"

                />

                <MultipleImageInput
                  name="fav_icon"
                  label="Favicon"

                />
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 ">
                <FormInput
                  name="site_name"
                  placeholder="Name"
                  label="Name"
                  type="text"
                  className="w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="site_description"
                  placeholder="Description"
                  label="Description"
                  type="text"
                  className="w-full rounded bg-transparent p-3 dashinput"

                />

                <FormInput
                  name="site_email"
                  placeholder="Email"
                  isEmail
                  type="email"
                  label="Email"
                  className="w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="site_phone"
                  placeholder="Phone Number"
                  label="Phone Number"
                  type="tel"
                  className=" w-full rounded bg-transparent p-3 dashinput"

                />

                <FormInput
                  name="site_address"
                  placeholder="Address"
                  label="Address"
                  type="text"
                  className=" w-full rounded bg-transparent p-3 dashinput"

                />
                <FormSelect
                  label={i18n.t("File Upload Type")}
                  name="file_upload_type"
                  placeholder={i18n.t("Select Upload Type")}

                  className="w-full rounded bg-transparent px-2 py-[23px] dashinput"
                  options={[
                    { label: "Local", value: "local" },
                    { label: "Amazon S3", value: "s3" },
                  ]}
                />
                <FormSelect
                  label={i18n.t("Otp Verification Type")}
                  name="otp_verification_type"
                  placeholder={i18n.t("Select Otp Type")}

                  className="w-full rounded bg-transparent px-2 py-[23px] dashinput"
                  options={[
                    { label: "Email", value: "email" },
                    { label: "Phone Number", value: "phone" },
                  ]}
                />
                <FormInput
                  name="client_side_url"
                  placeholder="Enter Client Side URL"
                  label="Client Side URL"
                  type="url"
                  className="w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="server_side_url"
                  placeholder="Enter Server Side URL"
                  label="Server Side URL"
                  type="url"
                  className="w-full rounded bg-transparent p-3 dashinput"

                />

                <FormInput
                  name="facebook"
                  placeholder="Facebook"
                  label="Facebook Url"
                  type="url"
                  className=" w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="twitter"
                  placeholder="Twitter Link"
                  label="Twitter Url"
                  type="url"
                  className=" w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="instagram"
                  placeholder="Instagram Link"
                  label="Instagram Url"
                  type="url"
                  className=" w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="linkedin"
                  placeholder="Linkedin Link"
                  label="Linkedin Url"
                  type="url"
                  className=" w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="youtube"
                  placeholder="Youtube Link"
                  label="Youtube Url"
                  type="url"
                  className=" w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="currency_code"
                  placeholder="Enter Currency Code"
                  label="Currency Code"
                  type="text"
                  className=" w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="currency_symbol"
                  placeholder="Currency Symbol"
                  label="Currency Symbol"
                  type="text"
                  className=" w-full rounded bg-transparent p-3 dashinput"

                />
                <FormInput
                  name="per_kiloliter_charge"
                  placeholder="Per Kiloliter Charge"
                  label="Per Kiloliter Charge"
                  getValueFromEvent={(e) => +e.target.value}
                  type="number"
                  className="w-full rounded bg-transparent p-3 dashinput"

                />

                <FormInput
                  name="delivery_charge"
                  placeholder="eg. 10 "
                  label="Delivery Charge"
                  getValueFromEvent={(e) => +e.target.value}
                  type="number"
                  className="w-full rounded bg-transparent p-3 dashinput"

                />
              </div>
              <div className="w-full">
                <FormSelect
                  label={i18n.t("Need a Product Module?")}
                  name="is_product_module"
                  placeholder={i18n.t("Select Status")}

                  className="w-full  rounded bg-transparent py-[22px] px-2 dashinput !text-white"
                  options={[
                    { label: "Active", value: true },
                    { label: "Inactive", value: false },
                  ]}
                />
              </div>
              <MultiImageWithTextInput
                name="partner"
                label="Partnership with Title"
                max={12}
              />
              <MultipleImageInput
                name="gallery"
                label="Gallery"

                max={6}
              />
              <MultipleImageInput
                name="banner_image"
                label="Banner Image"

                max={1}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <MultipleImageInput
                  name="login_upper_bg_image"
                  label="Login Upper Section BG"
                  max={1}
                />
                <MultipleImageInput
                  name="login_lower_bg_image"
                  label="Login Lower Section BG"
                  max={1}
                />
              </div>
              <Button className="mt-10 border border-red-600" children={i18n.t("Submit")} type="submit" />
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
