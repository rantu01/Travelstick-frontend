"use client";
import React from 'react';
import {
    Check, Info, Wifi, Car, ChevronDown, Clock,
    CigaretteOff, Cigarette, Bed, Gift, Wind
} from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/app/contexts/site';
// useCurrency ইমপোর্ট করা হলো

export default function BookingDetailsPage() {
    // কারেন্সি কনটেক্সট থেকে প্রয়োজনীয় মেথড নেওয়া হলো
    const { formatPrice, exchangeRate, currency } = useCurrency();

    return (
        <div className="bg-[#f2f2f2] min-h-screen p-4 md:p-8 font-sans text-[#1a1a1a]">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">

                {/* LEFT: FORM SECTION */}
                <div className="flex-1 space-y-4">

                    {/* Payment Option */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Choose your payment option</h3>
                        <div className="space-y-3">
                            <div className="border-2 border-blue-600 bg-blue-50 p-4 rounded-lg flex gap-3">
                                <input type="radio" checked readOnly className="mt-1 w-4 h-4" />
                                <div>
                                    <p className="font-bold text-sm">Pay on 3 March 2026</p>
                                    <ul className="text-green-700 text-xs mt-1 space-y-1 font-medium">
                                        <li className="flex items-center gap-1"><Check size={12} /> Stay flexible! No payment today</li>
                                        <li className="flex items-center gap-1"><Check size={12} /> Cancel for free before 5 March 2026</li>
                                    </ul>
                                    <button className="text-blue-600 text-[10px] font-bold mt-1 underline">Learn more about the effect on price</button>
                                </div>
                            </div>
                            <div className="border border-gray-200 p-4 rounded-lg flex gap-3">
                                <input type="radio" className="mt-1 w-4 h-4" />
                                <div>
                                    <p className="font-bold text-sm text-gray-700">Pay now</p>
                                    <p className="text-[10px] text-gray-500">You can also choose to pay now with a credit card or other payment methods.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Who are you booking for? */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Who are you booking for?</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name="bookingFor"
                                        defaultChecked
                                        className="w-5 h-5 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#003580] checked:border-[6px] transition-all"
                                    />
                                </div>
                                <span className="text-sm font-medium text-[#1a1a1a]">I am the main guest</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name="bookingFor"
                                        className="w-5 h-5 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#003580] checked:border-[6px] transition-all"
                                    />
                                </div>
                                <span className="text-sm font-medium text-[#1a1a1a]">I'm booking for someone else</span>
                            </label>
                        </div>
                    </div>

                    {/* Lead Guest Form */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-1">Who's the lead guest?</h3>
                        <p className="text-red-500 text-[10px] mb-4 font-bold">*Required field</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold">First name *</label>
                                <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Last name *</label>
                                <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Email *</label>
                                <input type="email" className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Country/region of residence *</label>
                                <select className="w-full border border-gray-300 rounded p-2 bg-white outline-none">
                                    <option>Bangladesh</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Mobile number</label>
                                <div className="flex gap-2">
                                    <select className="border border-gray-300 rounded p-2 bg-white text-xs outline-none"><option>+880</option></select>
                                    <input type="text" className="flex-1 border border-gray-300 rounded p-2 outline-none" placeholder="Mobile number" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Your arrival time */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={20} className="text-[#1a1a1a]" />
                            <h3 className="font-bold text-lg text-[#1a1a1a]">Your arrival time</h3>
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-4 flex items-start gap-3">
                            <Check size={18} className="text-green-700 mt-0.5" />
                            <p className="text-xs font-medium text-[#1a1a1a]">
                                Your room will be ready for check-in at <span className="font-bold">02:00 PM</span>.
                                If you arrive early, you can drop off your luggage.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold block">Add your estimated arrival time (optional)</label>
                            <div className="relative max-w-xs">
                                <select className="w-full border border-gray-300 rounded p-2.5 bg-white text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer pr-10">
                                    <option value="dont_know">I don't know</option>
                                    <option value="09:00">09:00 AM - 10:00 AM</option>
                                    <option value="10:00">10:00 AM - 11:00 AM</option>
                                    <option value="11:00">11:00 AM - 12:00 PM</option>
                                    <option value="12:00">12:00 PM - 01:00 PM</option>
                                    <option value="13:00">01:00 PM - 02:00 PM</option>
                                    <option value="14:00">02:00 PM - 03:00 PM</option>
                                    <option value="15:00">03:00 PM - 04:00 PM</option>
                                    <option value="16:00">04:00 PM - 05:00 PM</option>
                                    <option value="17:00">05:00 PM - 06:00 PM</option>
                                    <option value="18:00">06:00 PM - 07:00 PM</option>
                                    <option value="19:00">07:00 PM - 08:00 PM</option>
                                    <option value="20:00">08:00 PM - 09:00 PM</option>
                                    <option value="21:00">09:00 PM - 10:00 PM</option>
                                    <option value="22:00">10:00 PM - 11:00 PM</option>
                                    <option value="23:00">11:00 PM - 12:00 AM (midnight)</option>
                                    <option value="00:00">12:00 AM - 01:00 AM (next day)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 italic mt-1">Times are based on the property's local time</p>
                        </div>
                    </div>

                    {/* Special Requests */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-1">Special requests</h3>
                        <p className="text-gray-500 text-xs mb-4 leading-tight">Subject to availability. Your selections will be sent to the property right after you book.</p>
                        <label className="text-xs font-bold block mb-1">Any additional requests?</label>
                        <textarea className="w-full border border-gray-300 rounded p-3 h-24 text-sm outline-none" placeholder="Let us know in English"></textarea>
                        <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold">
                            <label className="flex items-center gap-2"><input type="radio" name="smoke" /><CigaretteOff size={16} /> Non smoking</label>
                            <label className="flex items-center gap-2"><input type="radio" name="smoke" /><Cigarette size={16} /> Smoking</label>
                            <label className="flex items-center gap-2 ml-4 border-l pl-4"><input type="radio" name="bed" /><Bed size={16} /> 1 large bed</label>
                            <label className="flex items-center gap-2"><input type="radio" name="bed" /><div className="flex"><Bed size={14} /><Bed size={14} /></div> 2 twin beds</label>
                        </div>
                        <button className="text-blue-600 text-xs font-bold mt-4 flex items-center gap-1 uppercase tracking-tight">Show additional preferences <ChevronDown size={14} /></button>
                    </div>

                    {/* Free Benefits */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-green-700 mb-4">Free room benefits</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Fully refundable", desc: "Cancel for free before 5 March 2026", icon: <Clock className="text-blue-800" size={20} /> },
                                { label: "No payment until 3 March 2026", desc: "No payment today", icon: <Check className="text-blue-800" size={20} /> },
                                { label: "Free WiFi", desc: "", icon: <Wifi className="text-blue-800" size={20} /> },
                                { label: "Parking", desc: "", icon: <Car className="text-blue-800" size={20} /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">{item.icon}</div>
                                        <div><p className="font-bold text-sm">{item.label}</p><p className="text-[10px] text-gray-500">{item.desc}</p></div>
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded">FREE</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BUTTON SECTION WITH HOVER DETAILS */}
                    <div className="text-right pt-4 relative group">
                        <p className="text-orange-600 text-[11px] font-bold italic mb-2">Hurry! Our last room for your dates at this price</p>

                        {/* Hover Tooltip/Card */}
                        <div className="absolute bottom-full right-0 mb-4 w-72 bg-white border border-gray-200 shadow-xl rounded-xl p-4 text-left hidden group-hover:block z-50 transition-all">
                            <h4 className="font-bold text-sm border-b pb-2 mb-2">Booking Summary</h4>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Lead Guest:</span>
                                    <span className="font-bold">Selected Name</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Arrival:</span>
                                    <span className="font-bold">I don't know</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Room:</span>
                                    <span className="font-bold">1x Standard Room</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 mt-2">
                                    <span className="text-gray-500">Total Price:</span>
                                    {/* formatPrice ব্যবহার করা হলো */}
                                    <span className="font-bold text-[#003580]">{formatPrice(154.96)}</span>
                                </div>
                            </div>
                            {/* Triangle Arrow */}
                            <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45"></div>
                        </div>

                        <Link href={`/hotel/1/booking/final`}>
                            <button className="w-full bg-[#003580] text-white font-black py-4 rounded-lg text-lg uppercase tracking-wider hover:bg-blue-900 transition-colors">Next: Final Step</button>
                        </Link>
                        {/* formatPrice ব্যবহার করা হলো */}
                        <p className="text-green-600 text-xs font-bold mt-2">You will pay {formatPrice(0)} today</p>
                    </div>
                </div>

                {/* RIGHT: SIDEBAR SECTION */}
                <div className="lg:w-[370px] space-y-4">

                    {/* 1. Date Summary Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-sans">
                        <div className="flex text-center border-b font-bold text-[13px]">
                            <div className="flex-1 p-3 border-r bg-white">
                                <p className="text-[10px] text-gray-400 uppercase mb-0.5">Check-in</p>
                                <p className="text-[#1a1a1a]">Fri, Mar 13</p>
                                <p className="text-[10px] text-gray-400 font-normal">02:00 PM</p>
                            </div>
                            <div className="flex-1 p-3 border-r bg-white">
                                <p className="text-[10px] text-gray-400 uppercase mb-0.5">Check-out</p>
                                <p className="text-[#1a1a1a]">Sun, Mar 15</p>
                                <p className="text-[10px] text-gray-400 font-normal">12:30 PM</p>
                            </div>
                            <div className="bg-[#f9f9f9] p-3 flex flex-col justify-center min-w-[70px]">
                                <p className="text-[#1a1a1a]">2</p>
                                <p className="text-[10px] text-gray-400 font-normal">nights</p>
                            </div>
                        </div>

                        {/* Hotel Info */}
                        <div className="p-4">
                            <div className="flex gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300"
                                    className="w-20 h-20 rounded-lg object-cover"
                                    alt="Hotel"
                                />
                                <div className="flex-1">
                                    <h4 className="font-bold text-[15px] leading-tight text-[#1a1a1a] mb-1">Hotel Kollol by J&Z Group</h4>
                                    <div className="flex text-[#febb02] text-[10px] gap-0.5 mb-1.5">
                                        {"★".repeat(3)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#003580] text-white text-[11px] px-1.5 py-0.5 font-bold rounded-md">7.6</span>
                                        <span className="text-[12px] font-bold text-[#003580]">Very good</span>
                                        <span className="text-[11px] text-gray-400">148 reviews</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
                                Laboni point, Sea Beach Road, Cox's Bazar, Cox...
                                <button className="text-[#006ce4] font-bold ml-1">What's nearby?</button>
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[#008009] text-[11px] font-bold">
                                <Check size={14} />
                                <span>Stay flexible! Cancel for free before 5 March 2026</span>
                            </div>
                        </div>

                        {/* Room Summary Box */}
                        <div className="mx-4 mb-4 p-3 bg-[#f2f7ff] border border-[#ceddf5] rounded-xl">
                            <div className="flex gap-3 mb-3">
                                <img
                                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=150"
                                    className="w-14 h-14 rounded-md object-cover border border-white"
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-[13px] text-[#1a1a1a]">1 x Standard Room</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Size: 20 m²</p>
                                    <p className="text-[11px] text-gray-500">Max: 2 adults</p>
                                    <p className="text-[11px] text-gray-500">1 queen bed</p>
                                </div>
                            </div>

                            <div className="space-y-1.5 border-t border-[#ceddf5] pt-3">
                                <div className="flex items-center gap-2 text-[11px] text-gray-600">
                                    <Car size={13} className="text-gray-400" />
                                    <span>Luggage storage available</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-[#008009] font-bold">
                                    <Check size={13} />
                                    <span>No payment until 3 March 2026</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-[#c00] font-bold">
                                    <span>⏰</span>
                                    <span>Hurry! Our last room for your dates at this price</span>
                                </div>
                                <div className="grid grid-cols-2 gap-y-1.5 pt-1">
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#008009] font-medium"><Check size={12} /> Parking</div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#008009] font-medium"><Check size={12} /> Express check-in</div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#008009] font-medium"><Check size={12} /> Free WiFi</div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#008009] font-medium"><Check size={12} /> Air conditioning</div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#008009] font-medium"><Check size={12} /> Electric kettle</div>
                                </div>
                                <div className="flex gap-4 pt-1">
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500"><CigaretteOff size={13} /> Non-smoking</div>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500"><Wind size={13} /> Air conditioning</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Urgent Message */}
                    <div className="bg-[#fff0f0] border border-[#fcc] p-3 rounded-xl flex items-center gap-3">
                        <span className="text-lg">⏰</span>
                        <p className="text-[11px] font-bold text-[#c00]">Hurry! Our last room for your dates at this price</p>
                    </div>

                    {/* 3. Cancellation Policy Timeline */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <h4 className="font-bold text-[14px] text-[#1a1a1a] mb-2">How much will it cost to cancel?</h4>
                        <p className="text-[#008009] text-[11px] font-bold mb-1">
                            Stay flexible! Cancel for free before 5 Mar 2026. Quickly edit your booking online - no added cost!
                        </p>
                        <button className="text-[#006ce4] text-[11px] font-bold mb-4">See more details</button>

                        <div className="relative mt-6 pb-6">
                            <div className="h-1.5 bg-gray-200 rounded-full w-full">
                                <div className="absolute h-1.5 bg-[#008009] rounded-full w-[60%]"></div>
                            </div>
                            <div className="absolute -top-1.5 left-0 w-4 h-4 rounded-full bg-white border-[3px] border-[#008009]"></div>
                            <div className="absolute -top-1.5 left-[60%] w-4 h-4 rounded-full bg-white border-[3px] border-[#008009]"></div>
                            <div className="absolute -top-1.5 right-0 w-4 h-4 rounded-full bg-white border-[3px] border-gray-300"></div>
                            <div className="flex justify-between mt-3 text-[10px] font-bold">
                                <span className="text-[#1a1a1a]">today</span>
                                <span className="text-[#1a1a1a] absolute left-[56%]">5 Mar</span>
                                <span className="text-gray-400">Arrival</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Coupons */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-3 border-b border-gray-100 flex items-center gap-2">
                            <div className="bg-[#008009] text-white p-1 rounded">
                                <Gift size={14} />
                            </div>
                            <span className="font-bold text-[13px] text-[#1a1a1a]">Coupons</span>
                        </div>
                        <div className="p-4">
                            <div className="border-2 border-dashed border-[#008009] rounded-xl p-3 bg-[#f2faf3] flex justify-between items-center relative">
                                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-r border-gray-200 rounded-full"></div>
                                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-gray-200 rounded-full"></div>

                                <div className="flex items-center gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/726/726448.png" className="w-8 h-8" alt="Gift" />
                                    <div>
                                        {/* formatPrice ব্যবহার করা হলো */}
                                        <p className="font-bold text-[14px] text-[#1a1a1a]">{formatPrice(18)} off</p>
                                        <p className="text-[10px] text-gray-500 italic">Instant discount</p>
                                    </div>
                                </div>
                                <div className="border-l border-gray-200 pl-4">
                                    <Gift className="text-[#008009]" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Price Match Info */}
                    <div className="p-4 bg-[#f2faf3] border border-[#d1e9d4] rounded-xl">
                        <p className="text-[11px] text-gray-700">
                            <span className="font-bold text-[#008009]">We price match.</span> Find it for less, and we'll match it! <Info size={12} className="inline ml-1 text-gray-400" />
                        </p>
                        {/* formatPrice ব্যবহার করা হলো */}
                        <p className="text-[11px] text-[#008009] font-bold mt-1">You saved {formatPrice(17.76)} on this booking!</p>
                    </div>

                    {/* 6. Pricing Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex justify-end mb-3">
                            <span className="bg-[#cc0000] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">12% OFF TODAY</span>
                        </div>

                        <div className="space-y-2.5 text-[13px]">
                            <div className="flex justify-between text-gray-500">
                                <span>Original price (1 room x 2 nights)</span>
                                {/* formatPrice ব্যবহার করা হলো */}
                                <span className="line-through">{formatPrice(180.78)}</span>
                            </div>
                            <div className="flex justify-between text-[#003580] font-bold">
                                <span>Our price</span>
                                {/* formatPrice ব্যবহার করা হলো */}
                                <span className="underline decoration-[#cc0000] decoration-2 underline-offset-4">{formatPrice(160.78)}</span>
                            </div>
                            <div className="flex justify-between text-[#008009] font-bold">
                                <span>Instant discount</span>
                                {/* formatPrice ব্যবহার করা হলো */}
                                <span>- {formatPrice(17.76)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-[#1a1a1a] pt-1">
                                <span>Room price (1 room x 2 nights)</span>
                                {/* formatPrice ব্যবহার করা হলো */}
                                <span>{formatPrice(133.02)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Taxes and fees</span>
                                {/* formatPrice ব্যবহার করা হলো */}
                                <span>{formatPrice(21.94)}</span>
                            </div>
                            <div className="flex justify-between text-[#008009] font-bold">
                                <span>Booking fees</span>
                                <span className="uppercase">Free</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-gray-100">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[16px] font-black text-[#1a1a1a]">Price</span>
                                        <Info size={15} className="text-gray-300" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        Included in price: tax 16.5%
                                    </p>
                                </div>
                                <div className="text-right">
                                    {/* formatPrice ব্যবহার করা হলো */}
                                    <p className="text-[26px] font-black text-[#1a1a1a] leading-none tracking-tighter">{formatPrice(154.96)}</p>
                                </div>
                            </div>
                            <div className="mt-4 text-[10px] text-gray-400 leading-relaxed">
                                Your <button className="text-[#006ce4] font-bold underline">currency selections</button> affect the prices charged or displayed to you under <button className="text-[#006ce4] font-bold underline">these terms</button>.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}