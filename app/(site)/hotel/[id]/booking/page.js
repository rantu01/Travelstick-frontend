"use client";
import React, { useEffect, useMemo, useState } from 'react';
import {
    Check, Wifi, Car, ChevronDown, Clock,
    CigaretteOff, Cigarette, Bed, Wind,
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useFetch } from '@/app/helper/hooks';
import { getAllPublicHotel, getRoomById } from '@/app/helper/backend';
import { useI18n } from '@/app/contexts/i18n';
import { useCurrency } from '@/app/contexts/site';
import { useUser } from '@/app/contexts/user';
import { FaStar } from 'react-icons/fa6';

export default function BookingDetailsPage() {
    const { formatPrice } = useCurrency();
    const { langCode } = useI18n();
    const { user } = useUser();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const hotelId = params?.id;
    const roomId = searchParams.get('room');
    const roomCount = Number(searchParams.get('count') || 1);

    const [hotel, getHotel] = useFetch(getAllPublicHotel, {}, false);
    const [room, getRoom] = useFetch(getRoomById, {}, false);

    useEffect(() => {
        if (hotelId) getHotel({ _id: hotelId });
        if (roomId) getRoom({ id: roomId });
    }, [hotelId, roomId]);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const fmt = (d) => d.toISOString().split('T')[0];

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        country: 'Bangladesh',
        phone: '',
        arrival_time: 'dont_know',
        special_requests: '',
        smoking_preference: 'non-smoking',
        bed_preference: 'large',
        check_in: fmt(today),
        check_out: fmt(tomorrow),
        adults: 2,
        children: 0,
    });

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                first_name: prev.first_name || user.name?.split(' ')[0] || '',
                last_name: prev.last_name || user.name?.split(' ').slice(1).join(' ') || '',
                email: prev.email || user.email || '',
            }));
        }
    }, [user]);

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const hotelName = useMemo(() => {
        if (!hotel?.name) return '';
        if (typeof hotel.name === 'object') return hotel.name[langCode] || hotel.name.en || '';
        return String(hotel.name || '');
    }, [hotel, langCode]);

    const roomName = useMemo(() => {
        if (!room?.name) return '';
        if (typeof room.name === 'object') return room.name[langCode] || room.name.en || '';
        return String(room.name || '');
    }, [room, langCode]);

    const nights = useMemo(() => {
        const d1 = new Date(form.check_in);
        const d2 = new Date(form.check_out);
        const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    }, [form.check_in, form.check_out]);

    const roomPrice = useMemo(() => {
        if (!room?.price) return 0;
        const { amount, discount_type, discount } = room.price;
        const p = discount_type === 'flat'
            ? amount - (discount || 0)
            : amount - (amount * (discount || 0)) / 100;
        return Math.max(0, p);
    }, [room]);

    const totalAmount = roomPrice * nights * roomCount;

    const handleContinue = () => {
        if (!form.first_name || !form.last_name || !form.email || !form.phone || !form.country) {
            alert('Please fill in all required fields.');
            return;
        }
        if (new Date(form.check_out) <= new Date(form.check_in)) {
            alert('Check-out must be after check-in.');
            return;
        }
        const bookingData = {
            ...form,
            hotel: hotelId,
            room: roomId,
            rooms_count: roomCount,
            person: form.adults + form.children,
            adults: form.adults,
            children: form.children,
            amount: totalAmount,
            room_details: [{ room: roomId, count: roomCount }],
            _hotel_name: hotelName,
            _room_name: roomName,
            _hotel_image: hotel?.card_image || hotel?.banner_image || '',
            _hotel_star: hotel?.star || 3,
            _destination: hotel?.destination?.name?.[langCode] || hotel?.destination?.name?.en || '',
            _nights: nights,
            _room_price: roomPrice,
        };
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('hotelBookingData', JSON.stringify(bookingData));
        }
        router.push(`/hotel/${hotelId}/booking/final`);
    };

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
                                    <p className="font-bold text-sm">Pay on arrival</p>
                                    <ul className="text-green-700 text-xs mt-1 space-y-1 font-medium">
                                        <li className="flex items-center gap-1"><Check size={12} /> Stay flexible! No credit card required today</li>
                                        <li className="flex items-center gap-1"><Check size={12} /> Pay at the property upon check-in</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Who are you booking for? */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Who are you booking for?</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="radio" name="bookingFor" defaultChecked className="w-5 h-5" />
                                <span className="text-sm font-medium">I am the main guest</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="radio" name="bookingFor" className="w-5 h-5" />
                                <span className="text-sm font-medium">I'm booking for someone else</span>
                            </label>
                        </div>
                    </div>

                    {/* Stay Details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Stay details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Check-in date *</label>
                                <input
                                    type="date"
                                    value={form.check_in}
                                    min={fmt(today)}
                                    onChange={e => set('check_in', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Check-out date *</label>
                                <input
                                    type="date"
                                    value={form.check_out}
                                    min={form.check_in || fmt(today)}
                                    onChange={e => set('check_out', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Adults *</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={form.adults}
                                    onChange={e => set('adults', Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded p-2 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Children</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.children}
                                    onChange={e => set('children', Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded p-2 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lead Guest Form */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-1">Who's the lead guest?</h3>
                        <p className="text-red-500 text-[10px] mb-4 font-bold">*Required field</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold">First name *</label>
                                <input
                                    type="text"
                                    value={form.first_name}
                                    onChange={e => set('first_name', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Last name *</label>
                                <input
                                    type="text"
                                    value={form.last_name}
                                    onChange={e => set('last_name', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Email *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Country *</label>
                                <select
                                    value={form.country}
                                    onChange={e => set('country', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 bg-white outline-none"
                                >
                                    {['Bangladesh', 'India', 'Pakistan', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Saudi Arabia', 'UAE', 'Qatar'].map(c => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold">Mobile number *</label>
                                <div className="flex gap-2">
                                    <select className="border border-gray-300 rounded p-2 bg-white text-xs outline-none">
                                        <option>+880</option><option>+91</option>
                                        <option>+1</option><option>+44</option>
                                        <option>+966</option><option>+971</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={form.phone}
                                        onChange={e => set('phone', e.target.value)}
                                        className="flex-1 border border-gray-300 rounded p-2 outline-none"
                                        placeholder="Mobile number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Arrival time */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={20} />
                            <h3 className="font-bold text-lg">Your arrival time</h3>
                        </div>
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-4 flex items-start gap-3">
                            <Check size={18} className="text-green-700 mt-0.5" />
                            <p className="text-xs font-medium">
                                Your room will be ready for check-in at <span className="font-bold">02:00 PM</span>.
                            </p>
                        </div>
                        <div className="relative max-w-xs">
                            <select
                                value={form.arrival_time}
                                onChange={e => set('arrival_time', e.target.value)}
                                className="w-full border border-gray-300 rounded p-2.5 bg-white text-sm outline-none appearance-none pr-10"
                            >
                                <option value="dont_know">I don't know</option>
                                {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','00:00'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Special Requests */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-1">Special requests</h3>
                        <p className="text-gray-500 text-xs mb-4">Subject to availability.</p>
                        <textarea
                            value={form.special_requests}
                            onChange={e => set('special_requests', e.target.value)}
                            className="w-full border border-gray-300 rounded p-3 h-24 text-sm outline-none"
                            placeholder="Let us know in English"
                        />
                        <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="smoke" checked={form.smoking_preference === 'non-smoking'} onChange={() => set('smoking_preference', 'non-smoking')} />
                                <CigaretteOff size={16} /> Non smoking
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="smoke" checked={form.smoking_preference === 'smoking'} onChange={() => set('smoking_preference', 'smoking')} />
                                <Cigarette size={16} /> Smoking
                            </label>
                            <label className="flex items-center gap-2 ml-4 border-l pl-4 cursor-pointer">
                                <input type="radio" name="bed" checked={form.bed_preference === 'large'} onChange={() => set('bed_preference', 'large')} />
                                <Bed size={16} /> 1 large bed
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="bed" checked={form.bed_preference === 'twin'} onChange={() => set('bed_preference', 'twin')} />
                                <div className="flex"><Bed size={14} /><Bed size={14} /></div> 2 twin beds
                            </label>
                        </div>
                    </div>

                    {/* Free Benefits */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-green-700 mb-4">Free room benefits</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Fully flexible", desc: "No payment required today", icon: <Check className="text-blue-800" size={20} /> },
                                { label: "Free WiFi", desc: "", icon: <Wifi className="text-blue-800" size={20} /> },
                                { label: "Free Parking", desc: "", icon: <Car className="text-blue-800" size={20} /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">{item.icon}</div>
                                        <div>
                                            <p className="font-bold text-sm">{item.label}</p>
                                            <p className="text-[10px] text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded">FREE</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="text-right pt-4">
                        <p className="text-orange-600 text-[11px] font-bold italic mb-2">
                            {roomName} Â· {roomCount} room{roomCount > 1 ? 's' : ''} Â· {nights} night{nights > 1 ? 's' : ''}
                        </p>
                        <button
                            onClick={handleContinue}
                            className="bg-[#003580] hover:bg-blue-900 text-white font-black py-4 px-12 rounded-lg text-lg uppercase tracking-wider transition-colors shadow-lg"
                        >
                            Continue to Payment â†’
                        </button>
                    </div>
                </div>

                {/* RIGHT: BOOKING SUMMARY */}
                <div className="lg:w-[350px] space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
                        <div className="p-4 bg-gray-50 border-b">
                            <h4 className="font-bold text-sm">Your booking details</h4>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex gap-3">
                                {(hotel?.card_image || hotel?.banner_image) && (
                                    <img
                                        src={hotel?.card_image || hotel?.banner_image}
                                        className="w-16 h-16 rounded object-cover"
                                        alt="hotel"
                                    />
                                )}
                                <div>
                                    <p className="font-bold text-xs">{hotelName}</p>
                                    <div className="flex text-yellow-400 text-[10px] mb-1">
                                        {Array.from({ length: hotel?.star || 3 }).map((_, i) => <FaStar key={i} />)}
                                    </div>
                                    <p className="text-[10px] text-gray-500">
                                        {hotel?.destination?.name?.[langCode] || hotel?.destination?.name?.en || ''}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500">Room:</span>
                                    <span>{roomCount}x {roomName || '...'}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500">Check-in:</span>
                                    <span>{form.check_in}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500">Check-out:</span>
                                    <span>{form.check_out}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500">Nights:</span>
                                    <span>{nights}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500">Guests:</span>
                                    <span>{form.adults} Adults{form.children > 0 ? `, ${form.children} Children` : ''}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t">
                                <div className="text-xs text-gray-500 mb-2">
                                    {formatPrice(roomPrice)} Ã— {nights} night{nights > 1 ? 's' : ''} Ã— {roomCount} room{roomCount > 1 ? 's' : ''}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">Total Price</span>
                                    <span className="font-black text-2xl text-[#1a1a1a]">{formatPrice(totalAmount)}</span>
                                </div>
                                <p className="text-[10px] text-green-700 font-bold text-right mt-1">Includes taxes and fees</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
