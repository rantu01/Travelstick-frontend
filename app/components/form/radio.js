import React, { useState } from "react";
import { Form, Radio } from "antd";

const FormRadio = ({
  name,
  label,
  initialValue,
  options = [],
  onSelect,
  onChange,
  placeholder,
  required = false,
  rules = [],
  search = false,
  isMulti = false,
  className,
  radiul = false,
}) => {
  let initRules = [];
  if (required) {
    initRules.push({ required: true, message: "Please select an option" });
  }

  const [value, setValue] = useState(initialValue || "");

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[...initRules, ...rules]}
      initialValue={initialValue}
    >
      
        <Radio.Group
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e);
          }}
        >
          {options.map((option, i) => (
            <Radio key={i} value={option.value}>
              {option.text}
            </Radio>
          ))}
        </Radio.Group>
     
    </Form.Item>
  );
};

export default FormRadio;
