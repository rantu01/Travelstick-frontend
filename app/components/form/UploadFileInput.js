import { Button, Form, Upload } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useActionConfirm } from "@/app/helper/hooks";
import { deleteImage } from "@/app/helper/backend";

const UploadFileInput = (props) => {
  let max = props.max || 1;
  let name = props.name || "video";
  let label = props.label;
  let onChange = props.onChange;
  let listType = props.listType || "file-card";

  return (
    <div >
      <Form.Item
        name={name}
        label={label}
        rules={[
          {
            required: props?.required,
            message: `Please upload ${!!label ? label : "a file"}`,
          },
        ]}
      >
        <Input max={max} listType={listType} onChange={onChange} />
      </Form.Item>
    </div>
  );
};

export default UploadFileInput;

const Input = ({ value, onChange, listType, max, noWebp, pdf }) => {

  const handleChange = ({ fileList }) => {
    if (fileList.length < (value?.length || 0)) {
      // Find the removed file
      const removedFile = value.find(file => !fileList.includes(file));
      if (removedFile) {
        useActionConfirm(
          deleteImage,
          { file: removedFile?.url },
        );
      }
    }

    onChange(fileList);
  };
  const customUpload = async ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  return (
    <>
      <Upload
        accept={`image/png, image/gif, image/jpeg, ${!noWebp && "image/webp"}, application/pdf `}
        listType={listType}
        fileList={value || []}
        onChange={handleChange}
        maxCount={max}
        customRequest={customUpload}
      >
        {(value?.length || 0) < max && <Button icon={<UploadOutlined />}>Upload File</Button>}
      </Upload>
    </>
  );
};
