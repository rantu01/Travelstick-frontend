import { useI18n } from "@/app/contexts/i18n";
import { FiSearch } from "react-icons/fi";

const SearchInput = ({ className, wrapperClassName, value, onChange, placeholder }) => {
  const i18n = useI18n();
  return (
    <div className={`relative mr-2 ${wrapperClassName || ''}`}>
      <input
        className={`text-[#05073C] ${className || ''}`}
        style={{ borderRadius: 4, padding: '8px 8px 8px 32px' }}
        value={value} onChange={onChange} placeholder={placeholder || 'Search'} />
      <FiSearch className="absolute  top-3  left-2.5 text-[#05073C]" />
    </div>

  )
}
export default SearchInput

export const SearchInput1 = ({ className, wrapperClassName, value, onChange, placeholder }) => {
  return (
    <div className={`relative mr-2 ${wrapperClassName || ''}`}>
      <input
        className={`text-[#05073C] ${className || ''}`}
        style={{ borderRadius: 4, padding: '8px 8px 8px 32px' }}
        value={value} onChange={onChange} placeholder={placeholder || 'Search'} />
      <FiSearch className="absolute lg:top-5 top-3 left-2.5 text-gray-500" />
    </div>
  )
}