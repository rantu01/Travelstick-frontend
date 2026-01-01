import React from 'react';

const InnovativeBtn = ({radious = " ", color = "bg-[#32BA7D]", text = "text-white"}) => {
    return (
        <div className='flex justify-end ml-auto space-x-2'>
            <button className={`px-5 py-2 md:px-3 md:text-sm font-inter font-medium hover:text-textMain hover:${color} border-2 ${radious} text-textBody hover:shadow-[0_2px_15px_-1px_#000033] border-primary hover:border-none`}>Show All</button>
            <button className={`px-5 py-2 md:px-3 md:text-sm font-inter font-medium hover:text-textMain border-2 ${radious} hover:${color} text-textBody hover:shadow-[0_2px_15px_-1px_#000033] border-primary hover:border-none`}>Ui/UX Design</button>
            <button className= {`px-5 py-2 md:px-3 md:text-sm font-inter font-medium hover:text-textMain bg-[#fff] border-2 ${radious} hover:${color} text-textBody hover:shadow-[0_2px_15px_-1px_#000033] border-primary hover:border-none`}>App Development</button>
        </div>
    );
};

export default InnovativeBtn;