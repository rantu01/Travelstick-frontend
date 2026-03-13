'use client'
import { useI18n } from "@/app/contexts/i18n";
import { Form, Select } from "antd";

const FormSelect = ({
  label,
  name,
  required,
  onSearch,
  initialValue,
  options,
  search,
  showSearch,
  filterOption,
  className,
  rules = [],
  multi,
  tags,
  placeholder,
  onSelect,
  onChange,
  allowClear,
  disabled,
  title,
}) => {
  const i18n = useI18n();
  let initRules = [
    { required: required, message: `${i18n?.t(`Please select`)} ${label || 'a option'}` },
  ]
  return (
    <Form.Item
      label={i18n?.t(label)}
      name={name}
      className="mb-3 select-package"
      rules={[...initRules, ...rules]}
      initialValue={initialValue}
    >
      <Select
        mode={multi ? 'multiple' : tags ? 'tags' : 'default'}
        popupClassName={tags ? 'd-none' : ''}
        className={className}
        allowClear={allowClear}
        onSelect={onSelect}
        disabled={disabled}
        onChange={onChange}
        placeholder={i18n?.t(placeholder)}
        filterOption={
          filterOption ||
          ((input, option) => {
            try {
              const searchLabel = option?.props?.['data-search'] || (typeof option.children === 'string' ? option.children : '');
              return String(searchLabel).toLowerCase().includes(String(input).toLowerCase());
            } catch (e) {
              return false;
            }
          })
        }
        showSearch={showSearch ?? search}
        title={title}
        onSearch={onSearch}
      >
        {options?.map((option, index) => (
          <Select.Option
            key={index}
            disabled={option.disabled}
            value={option?._id || option?.value}
            data-search={option?.searchLabel || (typeof option?.label === 'string' ? (option.label || option.name) : '')}
          >
            {option?.label || option?.name || option?.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

  )
}

export default FormSelect