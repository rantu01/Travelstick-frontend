"use client";
import React from 'react';
import { Input, DatePicker, Button, Select } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

const CustomTourRequest = () => {
  return (
    <div className=" min-h-screen mb-20">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Help Banner Section */}
        <div className="bg-[#FFF5E9] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Need More Help!</h1>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Call our experts and share any questions you have. Our team is ready to assist you every step of the way.
            </p>
          </div>
          <a 
            href="tel:13701" 
            className="bg-[#F38120] hover:bg-[#e67610] text-white px-8 py-3 rounded-lg flex items-center gap-2 font-bold text-lg transition-all shadow-md active:scale-95"
          >
            <PhoneOutlined rotate={90} /> 13701
          </a>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-10 space-y-10">
          
          {/* Section 1: Destination */}
          <section className="">
            <h3 className="text-lg font-bold text-[#0D2E5E] mb-6 border-b pb-2">Tell us where do you want to go?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Select a destination from list</label>
                <Select
                  showSearch
                  placeholder="City"
                  className="w-full h-12"
                  options={[
                    { value: 'dubai', label: 'Dubai' },
                    { value: 'maldives', label: 'Maldives' },
                    { value: 'thailand', label: 'Thailand' },
                  ]}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">When do you want to go?</label>
                <DatePicker 
                  className="w-full h-12" 
                  defaultValue={dayjs()} 
                  format="D MMM YY"
                />
              </div>

              <div className="space-y-2 md:col-span-1">
                <label className="text-sm font-semibold text-gray-700">Or, Write it down</label>
                <Input placeholder="Write City Name" className="h-12" />
              </div>
            </div>
          </section>

          {/* Section 2: Personal Info */}
          <section className="">
            <h3 className="text-lg font-bold text-[#0D2E5E] mb-6 border-b pb-2">Tell us about Yourself</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input placeholder="First Name" className="h-12" />
              <Input placeholder="Last Name" className="h-12" />
              <Input placeholder="Mobile Number" className="h-12" />
              <Input placeholder="Email" className="h-12" />
            </div>
          </section>

          {/* Section 3: Requirements */}
          <section className="">
            <h3 className="text-lg font-bold text-[#0D2E5E] mb-6 border-b pb-2">Share your Requirements</h3>
            <TextArea 
              rows={5} 
              placeholder="Enter Your requirements" 
              className="rounded-lg p-4"
            />
          </section>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="primary" 
              className="bg-[#2185FF] hover:bg-blue-600 h-14 px-10 text-base font-bold rounded-lg"
            >
              Submit Your Request
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomTourRequest;