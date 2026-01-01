import React from "react"
import { Form, DatePicker } from "antd"

const FormDatePicker = ({ name, label, disabledDate, initialValue, className, onChange, placeholder, extra, disabled = false, tooltip = '', required = false, showTime = false }) => {
  return (
    <Form.Item
      name={name}
      label={label}
      initialValue={initialValue || ''}
      placeholder={placeholder}
      extra={extra && extra}
      rules={[
        {
          required: required,
          message: 'Please input your ' + label + '!',
        },
      ]}
    >
      <DatePicker title={disabled && tooltip} disabled={disabled}  disabledDate={disabledDate} showTime={showTime} onChange={onChange} onOk={onChange} className={className} />
    </Form.Item>
  )
}
export default FormDatePicker




