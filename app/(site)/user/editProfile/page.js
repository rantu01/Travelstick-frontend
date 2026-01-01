"use client";
import FormInput from "@/app/components/form/input";
import MultipleImageInput from "@/app/components/form/multiImage";
import { useI18n } from "@/app/contexts/i18n";
import { getUser, singleImageUpload, updateUser } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { Form, message } from "antd";
import { useEffect } from "react";

const EditProfile = () => {
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [user, getCurrentUser, { loading }] = useFetch(getUser);
  useEffect(() => {
    form.setFieldsValue({
      ...user,
      image:
        user?.image?.length > 0
          ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: user?.image,
            },
          ]
          : [],
    });
  }, [user, form]);

  const handleSubmit = async (value) => {
    let image;
    if (!value?.image?.[0]?.url) {
      const { errorMessage, data } = await singleImageUpload({
        image: value?.image?.[0]?.originFileObj,
      });
      if (data) {
        image = data.image;
      } else {
        message.error(errorMessage || "Image upload failed");
      }
    } else {
      image = value?.image?.[0]?.url;
    }
    if (!image) {
      return;
    }
    const data = await updateUser({
      body: {
        ...value,
        image: image,
      },
    });
    if (data.success) {
      message.success(data.message);
      getCurrentUser();
    } else {
      message.error(data.message);
    }
  };
  return (
    <div>
      <Form
        className=""
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
        initialValues={{
          name: "",
          phone: "",
          email: "",
          address: "",
          city: "",
          country: "",
          state: "",
          zip_code: "",
          image: [],
        }}
      >
        <h4 className="description-3 text-[#05073C] pb-5 border-b !border-primary">
          {i18n.t("Edit Profile")}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:gap-8 lg:gap-6 gap-3 mt-5">
          <div>
            <FormInput
              className="w-full rounded bg-transparent p-3  focus:outline-primary"
              type={"text"}
              label="Full Name"
              name="name"
              placeholder="Enter your name"
              required={true}
            />
          </div>
          <div>
            <FormInput
              className="w-full rounded bg-transparent p-3 focus:outline-primary"
              type={"number"}
              label="Phone Number"
              name="phone"
              placeholder="Enter your Phone Number"
              required={true}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:gap-8 lg:gap-6 gap-3">
          <div className="">
            <FormInput
              className="w-full rounded bg-transparent p-3  focus:outline-primary "
              isEmail={true}
              readOnly={true}
              type={"email"}
              label="Email"
              name="email"
              placeholder="Enter your email"
              required={true}
            />
          </div>
          <div>
            <FormInput
              className="w-full rounded bg-transparent p-3  focus:outline-primary "
              type={"text"}
              label="Address"
              name="address"
              placeholder="Enter your Address"
              required={true}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:gap-8 lg:gap-6 gap-3">
          <div className="">
            <FormInput
              className="w-full rounded bg-transparent p-3  focus:outline-primary "
              type={"text"}
              label="City"
              name="city"
              placeholder="Enter your city"
              required={true}
            />
          </div>
          <div className="">
            <FormInput
              className="w-full rounded bg-transparent p-3  focus:outline-primary "
              type={"text"}
              label="Country"
              name="country"
              placeholder="Enter your Country"
              required={true}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:gap-8 lg:gap-6 gap-3">
          <div className="">
            <FormInput
              className="w-full rounded bg-transparent p-3  focus:outline-primary "
              type={"text"}
              label="State"
              name="state"
              placeholder="Enter your state"
              required={true}
            />
          </div>
          <div className="">
            <FormInput
              className="w-full rounded bg-transparent p-3  focus:outline-primary "
              type={"text"}
              label="Zip Code"
              name="zip_code"
              placeholder="Enter your Zip Code"
              required={true}
            />
          </div>
        </div>
        <MultipleImageInput
          label="Upload Profile Picture"
          name="image"
          required={true}
        />
        <button className=" md:mt-6 sm:mt-5 mt-4 common-btn bg-primary text-[#02050A] !rounded">
          {i18n.t("Save Changes")}
        </button>
      </Form>
    </div>
  );
};

export default EditProfile;
