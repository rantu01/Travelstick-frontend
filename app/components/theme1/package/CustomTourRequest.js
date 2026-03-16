"use client";
import React, { useState } from 'react';
import { Input, DatePicker, Button, Select, Form } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAction } from '@/app/helper/hooks';
import { createCustomTourRequest } from '@/app/helper/backend';

const { TextArea } = Input;

const CustomTourRequest = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const payload = {
      selectedDestination: values?.selectedDestination,
      customDestination: values?.customDestination,
      travelDate: values?.travelDate
        ? dayjs(values.travelDate).format('YYYY-MM-DD')
        : undefined,
      firstName: values?.firstName,
      lastName: values?.lastName,
      phone: values?.phone,
      email: values?.email,
      requirements: values?.requirements,
    };

    setLoading(true);
    await useAction(
      createCustomTourRequest,
      payload,
      () => {
        form.resetFields();
      },
      true,
      'Your custom tour request has been submitted successfully'
    );
    setLoading(false);
  };

  return (
    <div className=" min-h-screen mb-20 mt-20">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Help Banner Section */}
        <div className="bg-[#a9c7f5] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Need More Help!</h1>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Call our experts and share any questions you have. Our team is ready to assist you every step of the way.
            </p>
          </div>
          <a 
            href="tel:13701" 
            className="bg-[#1a4fa0] hover:bg-[#164080] text-white px-8 py-3 rounded-lg flex items-center gap-2 font-bold text-lg transition-all shadow-md active:scale-95"
          >
            <PhoneOutlined rotate={90} /> +880 1913-751185
          </a>
        </div>

        {/* Form Body */}
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{ travelDate: dayjs() }}
          className="p-6 md:p-10 space-y-10"
          layout="vertical"
        >
          {/* Section 1: Destination */}
          <section className="">
            <h3 className="text-lg font-bold text-[#0D2E5E] mb-6 border-b pb-2">Tell us where do you want to go?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label="Select a destination from list"
                name="selectedDestination"
                className="mb-0"
              >
                <Select
                  showSearch
                  placeholder="City"
                  className="w-full h-12"
                  options={[
                    { value: 'Dubai', label: 'Dubai' },
                    { value: 'Maldives', label: 'Maldives' },
                    { value: 'Thailand', label: 'Thailand' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="When do you want to go?"
                name="travelDate"
                className="mb-0"
              >
                <DatePicker className="w-full h-12" format="D MMM YY" />
              </Form.Item>

              <Form.Item
                label="Or, Write it down"
                name="customDestination"
                className="mb-0 md:col-span-1"
              >
                <Input placeholder="Write City Name" className="h-12" />
              </Form.Item>
            </div>
          </section>

          {/* Section 2: Personal Info */}
          <section className="">
            <h3 className="text-lg font-bold text-[#0D2E5E] mb-6 border-b pb-2">Tell us about Yourself</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: 'First name is required' }]}
                className="mb-0"
              >
                <Input placeholder="First Name" className="h-12" />
              </Form.Item>
              <Form.Item name="lastName" className="mb-0">
                <Input placeholder="Last Name" className="h-12" />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Mobile number is required' }]}
                className="mb-0"
              >
                <Input placeholder="Mobile Number" className="h-12" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
                className="mb-0"
              >
                <Input placeholder="Email" className="h-12" />
              </Form.Item>
            </div>
          </section>

          {/* Section 3: Requirements */}
          <section className="">
            <h3 className="text-lg font-bold text-[#0D2E5E] mb-6 border-b pb-2">Share your Requirements</h3>
            <Form.Item name="requirements" className="mb-0">
              <TextArea
                rows={5}
                placeholder="Enter Your requirements"
                className="rounded-lg p-4"
              />
            </Form.Item>
          </section>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              htmlType="submit"
              type="primary"
              loading={loading}
              className="bg-[#2185FF] hover:bg-blue-600 h-14 px-10 text-base font-bold rounded-lg"
            >
              Submit Your Request
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CustomTourRequest;