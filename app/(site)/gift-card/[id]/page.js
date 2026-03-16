"use client";
import React, { useState } from 'react';
import { LeftOutlined, MinusOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Input, Radio, Button, Checkbox } from 'antd';

const GiftCardDetails = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedService, setSelectedService] = useState('Flight');

    return (
        <div className="bg-[#f0f4f9] min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
                
                {/* Left Side: Steps Navigation */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex items-center gap-2 cursor-pointer text-gray-600">
                            <LeftOutlined /> <span>Gift Cards</span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 p-4 bg-blue-50 border-l-4 border-blue-600 text-blue-600 font-semibold">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                Gift Card
                            </div>
                            <div className="flex items-center gap-3 p-4 text-gray-400">
                                <span className="bg-gray-200 text-gray-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                Payment Options
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle: Main Form */}
                <div className="w-full lg:w-2/4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6">Gift Card</h2>

                        {/* Gift Card Banner Preview */}
                        <div className="relative rounded-xl overflow-hidden mb-4 bg-purple-600 h-48 flex items-center justify-between p-8 text-white">
                            <div className="w-1/2">
                                <img src="https://via.placeholder.com/150" alt="Balloons" className="absolute left-0 top-0 h-full opacity-50" />
                                <div className="relative z-10">
                                    <h3 className="text-3xl font-serif italic italic">Birthday</h3>
                                    <p className="font-bold tracking-widest text-xs">GIFT CARD</p>
                                    <p className="text-[10px] mt-2 italic opacity-80">Because the best gift is a ticket to adventure.</p>
                                </div>
                            </div>
                            <div className="z-10 text-right font-bold text-sm opacity-60 italic">ShareTrip</div>
                        </div>

                        {/* Banner Thumbnails */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`h-16 rounded-md overflow-hidden border-2 cursor-pointer ${i === 1 ? 'border-blue-500' : 'border-transparent'}`}>
                                    <img src={`https://picsum.photos/seed/${i+10}/200/100`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Custom Message on Card <span className="float-right text-gray-400 font-normal">47/60</span></label>
                                <Input.TextArea 
                                    rows={2} 
                                    defaultValue="Because the best gift is a ticket to adventure." 
                                    className="rounded-md"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Select the Service you want to Purchase <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Flight', 'Hotel', 'Shop'].map(service => (
                                        <div 
                                            key={service}
                                            onClick={() => setSelectedService(service)}
                                            className={`p-3 border rounded-md text-center cursor-pointer transition-all ${selectedService === service ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
                                        >
                                            {service}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Gift Card amount</label>
                                <Input defaultValue="500" size="large" className="bg-gray-50" />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Select No. of Gift Card</label>
                                <div className="flex items-center justify-between border rounded-md p-2 bg-gray-50">
                                    <span className="font-bold text-gray-700 ml-2">0{quantity} <span className="font-normal text-gray-400 text-sm ml-2">x ৳ 500</span></span>
                                    <div className="flex gap-2">
                                        <Button icon={<MinusOutlined />} size="small" onClick={() => setQuantity(Math.max(1, quantity))} />
                                        <Button icon={<PlusOutlined />} size="small" onClick={() => setQuantity(quantity + 1)} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-2">Purchase Options</label>
                                    <Radio.Group defaultValue="myself" className="w-full">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Radio.Button value="myself" className="text-center rounded-md h-12 flex items-center justify-center">Buy for myself</Radio.Button>
                                            <Radio.Button value="gift" className="text-center rounded-md h-12 flex items-center justify-center">Send as Gift</Radio.Button>
                                        </div>
                                    </Radio.Group>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-2">How do you want to Gift?</label>
                                    <Radio.Group defaultValue="e-gift" className="w-full">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Radio.Button value="e-gift" className="text-center rounded-md h-12 flex items-center justify-center">E-Gift Card</Radio.Button>
                                            <Radio.Button value="physical" className="text-center rounded-md h-12 flex items-center justify-center">Physical Gift Card</Radio.Button>
                                        </div>
                                    </Radio.Group>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-bold mb-2">Receiver Details</h3>
                                <p className="text-xs text-gray-400 mb-4">Delivery Confirmation and details will be sent on below e-mail and mobile number.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500">Receiver Name <span className="text-red-500">*</span></label>
                                        <Input placeholder="Enter full name" size="large" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Email Address <span className="text-red-500">*</span></label>
                                            <Input placeholder="abcd@gmail.com" size="large" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Phone Number <span className="text-red-500">*</span></label>
                                            <Input placeholder="01812-345678" prefix={<span className="text-gray-400">+880 | </span>} size="large" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button type="primary" block size="large" className="mt-8 h-12 font-bold bg-blue-600">
                            Proceed to Purchase
                        </Button>
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
                        <div className="flex items-center gap-2 font-bold text-gray-700 mb-4">
                            <span className="text-lg">🛒</span>
                            <span>1 Items to checkout</span>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                                <span>🎁 Gift Card ▲</span>
                                <span>500 BDT</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-gray-400 mt-2">
                                <span>1 x 500</span>
                                <span>৳ 500</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-bold text-gray-800 border-t pt-4 mb-6">
                            <span>Total Price</span>
                            <span>500 BDT</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-700 uppercase mb-1">Terms & Policies</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed">
                                    A particular Gift card is redeemable only for the designated service like Flight, Hotel or Shop. To understand the policy better please go through full <span className="text-blue-500 cursor-pointer">Terms and Conditions</span>
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-700 uppercase mb-1">Delivery Terms & Policies</h4>
                                <div className="text-[10px] text-gray-500 space-y-1">
                                    <div className="flex justify-between"><span>Inside Dhaka</span> <span>: 3 working days (60 BDT)</span></div>
                                    <div className="flex justify-between"><span>Outside Dhaka</span> <span>: 5 to 9 days (120 BDT)</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GiftCardDetails;