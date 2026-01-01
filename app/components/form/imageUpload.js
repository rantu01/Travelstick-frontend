/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Form, Upload, Modal, message } from "antd";
import Image from "next/image";
import { useState } from "react";
import { useActionConfirm } from "@/app/helper/hooks";
import { deleteImage } from "@/app/helper/backend";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
const { Dragger } = Upload;
const ImageUpload = (props) => {
  let max = props.max || 1;
  let name = props.name || "img";
  let label = props.label;
  let listType = props.listType || "picture-card";

  return (
    <div className="">
      <Form.Item
        className="w-full"
        name={name}
        label={label}
        rules={[
          {
            required: props?.required,
            message: `Please upload an Image`,
          }
        ]}
      >
        <Input
          max={max}
          listType={listType}
          pdf={props?.pdf}
          noWebp={props?.noWebp}
          video={props?.video}
        />
      </Form.Item>
    </div>
  );
};

const Input = ({ value, onChange, listType, max, noWebp }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file?.url || file?.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList }) => {
    onChange(fileList);
  };

  const handleRemove = async (file) => {
    try {
      const payload = { file: file.url };
      await useActionConfirm(() => deleteImage(payload));
    } catch (error) {
      message.error("Failed to delete file.");
      return false;
    }
  };

  return (
    <>
      <Upload
        accept={`image/png, image/gif, image/jpeg, ${!noWebp && "image/webp"}`}
        listType={listType}
        onPreview={handlePreview}
        fileList={value || []}
        onChange={handleChange}
        onRemove={handleRemove}
        maxCount={max}
        className="w-full"
        style={{ inlineSize: '100%' }}
      >
        {
          (value?.length || 0) < max && (
            <div className="w-full flex flex-col items-center justify-center text-[#999]">
              <UploadOutlined className="text-2xl mb-1" />
              <div>Upload</div>
            </div>
          )
        }
      </Upload>
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={handleCancel}
        title={"Preview"}
      >
        <Image alt="example" width={1000} height={600} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUpload;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

