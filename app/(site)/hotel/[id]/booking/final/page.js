"use client";
import React from 'react';
import { 
    Lock, CreditCard, ShieldCheck, ChevronLeft, 
    Info, Calendar, MapPin, Star 
} from 'lucide-react';

export default function FinalBookingStep() {
    return (
        <div className="bg-[#f2f2f2] min-h-screen p-4 md:p-8 font-sans text-[#1a1a1a]">
            <div className="max-w-6xl mx-auto">
                
                {/* Header / Back Button */}
                <button className="flex items-center gap-2 text-[#006ce4] font-bold text-sm mb-6 hover:underline">
                    <ChevronLeft size={18} />
                    Back to guest details
                </button>

                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* LEFT: PAYMENT & FINAL DETAILS */}
                    <div className="flex-1 space-y-4">
                        
                        {/* Security Alert */}
                        <div className="bg-[#f2faf3] border border-[#d1e9d4] p-4 rounded-xl flex items-center gap-3">
                            <ShieldCheck className="text-[#008009]" size={24} />
                            <div>
                                <p className="font-bold text-sm text-[#1a1a1a]">Secure payment</p>
                                <p className="text-[11px] text-gray-600">All your information is encrypted and transmitted securely.</p>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl">How would you like to pay?</h3>
                                <div className="flex gap-1">
                                    <Lock size={14} className="text-gray-400" />
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Secure</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Credit/Debit Card Option */}
                                <div className="border-2 border-blue-600 bg-blue-50/30 p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <input type="radio" checked readOnly className="w-5 h-5" />
                                            <span className="font-bold text-sm italic">Credit/Debit Card</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="visa" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="mastercard" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold">Cardholder's name *</label>
                                            <input type="text" className="w-full border border-gray-300 rounded p-2.5 outline-none focus:ring-1 focus:ring-blue-500" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold">Card number *</label>
                                            <div className="relative">
                                                <input type="text" className="w-full border border-gray-300 rounded p-2.5 outline-none focus:ring-1 focus:ring-blue-500" placeholder="0000 0000 0000 0000" />
                                                <CreditCard className="absolute right-3 top-2.5 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold">Expiry date *</label>
                                            <input type="text" className="w-full border border-gray-300 rounded p-2.5 outline-none" placeholder="MM / YY" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold">CVC / CVV *</label>
                                            <input type="text" className="w-full border border-gray-300 rounded p-2.5 outline-none" placeholder="123" />
                                        </div>
                                    </div>
                                </div>

                                {/* Digital Wallet / Others */}
                                <div className="border border-gray-200 p-4 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="pay" className="w-5 h-5" />
                                        <span className="font-bold text-sm text-gray-700">Mobile Banking (bKash/Nagad)</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-5 bg-gray-100 rounded"></div>
                                        <div className="w-8 h-5 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms & Conditions Checkbox */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex gap-3">
                                <input type="checkbox" className="mt-1 w-5 h-5 min-w-[20px]" />
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    By clicking "Book Now", you agree to the <span className="text-[#006ce4] cursor-pointer">Terms and Conditions</span> and <span className="text-[#006ce4] cursor-pointer">Privacy Policy</span>. Your booking is with Hotel Kollol by J&Z Group directly.
                                </p>
                            </div>
                            
                            <button className="w-full bg-[#003580] text-white font-black py-4 rounded-lg text-lg uppercase tracking-wider mt-6 hover:bg-blue-900 transition-colors shadow-lg">
                                Complete Booking
                            </button>
                            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-[11px]">
                                <Lock size={12} />
                                <span>Encrypted and Secure</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: SUMMARY (STICKY) */}
                    <div className="lg:w-[370px] space-y-4">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
                            <div className="p-4 bg-gray-50 border-b">
                                <h4 className="font-bold text-sm">Your booking details</h4>
                            </div>
                            
                            <div className="p-4 space-y-4">
                                <div className="flex gap-3">
                                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200" className="w-16 h-16 rounded object-cover" alt="hotel" />
                                    <div>
                                        <p className="font-bold text-xs">Hotel Kollol by J&Z Group</p>
                                        <div className="flex text-[#febb02] text-[10px] mb-1">{"★".repeat(3)}</div>
                                        <p className="text-[10px] text-gray-500 line-clamp-1">Cox's Bazar, Bangladesh</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500">Dates:</span>
                                        <span>13 Mar - 15 Mar (2 nights)</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500">Room:</span>
                                        <span>1x Standard Room</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500">Guests:</span>
                                        <span>2 Adults</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-lg">Total Price</span>
                                        <span className="font-black text-2xl text-[#1a1a1a]">USD 154.96</span>
                                    </div>
                                    <p className="text-[10px] text-green-700 font-bold text-right">Includes taxes and fees</p>
                                </div>

                                <div className="bg-blue-50 p-3 rounded-lg flex gap-2">
                                    <Info size={16} className="text-blue-600 shrink-0" />
                                    <p className="text-[10px] text-blue-800 leading-tight">
                                        <strong>Free cancellation</strong> until 5 March. No immediate payment needed if you choose "Pay Later".
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}