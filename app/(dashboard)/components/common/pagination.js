'use client'
import { useI18n } from "@/app/contexts/i18n";
import ReactPaginate from "react-paginate";
const Pagination = ({
  page,
  total,
  limit,
  show = true,
  totalPages,
  onPageChange,
  onSizeChange,
}) => {
  const pageCount = totalPages ? Math.ceil(totalPages) : 1;
  const i18n = useI18n()

  return (
    <div className="flex flex-wrap justify-between mb-2">
      { show && <div className="flex items-center !mb-6 md:!mb-0 ">
        {onSizeChange && (
          <div className="flex items-center mr-3 text-sm  text-[#05073C] h-[24px]">
            {i18n?.t('Show')}
            <select
              value={limit}
              onChange={(e) => {
                onSizeChange(+e.target.value);
              }}
              className="h-[24px] px-1 rounded mx-2 text-center bg-primary text-white focus:outline-0"
            >
              <option value={10}>{i18n?.t('10')}</option>
              {
                limit > 10 && <option value={limit}>{i18n?.t(limit)}</option>
              }
              <option value={25}>{i18n?.t('25')}</option>
              <option value={50}>{i18n?.t('50')}</option>
              <option value={100}>{i18n?.t('100')}</option>
            </select>
          </div>
        )}
        { show && <p className="text-sm text-[#05073C]">
          {i18n?.t('Showing')} {(page - 1) * limit + 1 || 0}
          &nbsp;{i18n?.t('to')} {Math.min(total || 0, page * limit || 0)} {i18n?.t('of')} {total || 0}{" "}
          {i18n?.t('entries')}
        </p>}
      </div>}

      <ReactPaginate
        breakLabel="..."
        previousLabel={'Previous'}
        nextLabel={'Next'}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        className="flex gap-2"
        pageClassName="rounded-lg font-semibold overflow-hidden"
        pageLinkClassName="flex items-center justify-center w-10 h-10 bg-primary bg-opacity-10 rounded-lg font-semibold text-primary cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-white"
        activeLinkClassName="!bg-primary !text-white"
        previousClassName="rounded-lg font-semibold overflow-hidden"
        previousLinkClassName="flex items-center justify-center w-20 h-10 bg-primary bg-opacity-10 rounded-lg font-semibold text-primary cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-white"
        nextClassName="rounded-lg font-semibold overflow-hidden"
        nextLinkClassName="flex items-center justify-center w-14 h-10 bg-primary bg-opacity-10 rounded-lg font-semibold text-primary cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-white"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </div>
  );
};
export default Pagination;
