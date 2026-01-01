"use client";
import { Checkbox, Form } from "antd";

const FormCheckbox = ({ name, label, onChange }) => {
  return (
    <Form.Item
      name={name}
      noStyle
    >
      <Checkbox onChange={onChange}>{label}</Checkbox>
    </Form.Item>
  );
};

export default FormCheckbox;
