"use client";
import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrency } from '@/app/contexts/site';
import { useUser } from '@/app/contexts/user';
import { createHotelBookingPayment } from '@/app/helper/backend';
import { FaStar } from 'react-icons/fa6';
import AuthModal from '@/app/components/site/common/component/authModal';

export default function FinalBookingStep() {
    const router = useRouter();
    const params = useParams();
    const hotelId = params?.id;
    const { formatPrice } = useCurrency();
    const { user } = useUser();

    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const isValidObjectId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem('hotelBookingData');
            if (stored) {
                try { setBookingData(JSON.parse(stored)); } catch { /* ignore */ }
            }
        }
    }, []);

    const nights = bookingData?._nights ?? 1;
    const roomPrice = bookingData?._room_price ?? 0;
    const roomCount = bookingData?.rooms_count ?? 1;
    const totalAmount = bookingData?.amount ?? 0;

    const handleCompleteBooking = async () => {
        if (!agreed) {
            alert('Please agree to the Terms and Conditions.');
            return;
        }
        if (!user) {
            setAuthModalOpen(true);
            return;
        }
        if (!bookingData) {
            alert('Booking data not found. Please go back and fill the form.');
            return;
        }

        if (!isValidObjectId(bookingData.hotel)) {
            alert('Invalid hotel information. Please start booking again.');
            return;
        }

        const adults = Number(bookingData.adults || 0);
        const children = Number(bookingData.children || 0);
        const person = Number(bookingData.person || adults + children);
        const amount = Number(bookingData.amount || 0);
        const roomDetails = Array.isArray(bookingData.room_details)
            ? bookingData.room_details
                .filter((item) => isValidObjectId(item?.room) && Number(item?.count) > 0)
                .map((item) => ({ room: item.room, count: Number(item.count) }))
            : [];
        const services = Array.isArray(bookingData.services)
            ? bookingData.services.filter((item) => isValidObjectId(item))
            : [];

        if (person <= 0) {
            alert('Guest count is invalid. Please update your booking details.');
            return;
        }

        if (!Number.isFinite(amount) || amount < 0) {
            alert('Booking amount is invalid. Please go back and try again.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                hotel: bookingData.hotel,
                check_in: bookingData.check_in,
                check_out: bookingData.check_out,
                person,
                adults,
                children,
                rooms_count: Number(bookingData.rooms_count || 1),
                with_pets: Boolean(bookingData.with_pets),
                first_name: bookingData.first_name,
                last_name: bookingData.last_name,
                email: bookingData.email,
                phone: bookingData.phone,
                country: bookingData.country,
                arrival_time: bookingData.arrival_time || 'dont_know',
                special_requests: bookingData.special_requests || '',
                smoking_preference: bookingData.smoking_preference || 'non-smoking',
                bed_preference: bookingData.bed_preference || 'large',
                room_details: roomDetails,
                services,
                amount,
                method: 'cash',
            };

            const res = await createHotelBookingPayment({ body: payload });
            if (res?.success) {
                sessionStorage.removeItem('hotelBookingData');
                router.push(`/hotel/${hotelId}?booking=success`);
            } else {
                alert(res?.errorMessage || res?.message || 'Booking failed. Please try again.');
            }
        } catch (err) {
            alert(err?.response?.data?.errorMessage || err?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!bookingData) {
        return (
            <div className="bg-[#f2f2f2] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No booking data found.</p>
                    <button
                        onClick={() => router.back()}
                        className="text-[#006ce4] font-bold hover:underline"
                    >
                        â† Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f2f2f2] min-h-screen p-4 md:p-8 font-sans text-[#1a1a1a]">
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#006ce4] font-bold text-sm mb-6 hover:underline"
                >
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
                                <p className="font-bold text-sm text-[#1a1a1a]">Secure booking</p>
                                <p className="text-[11px] text-gray-600">All your information is encrypted and transmitted securely.</p>
                            </div>
                        </div>

                        {/* Booking Summary - Lead Guest */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div><span className="text-gray-500 text-xs">Guest Name</span><p className="font-bold">{bookingData.first_name} {bookingData.last_name}</p></div>
                                <div><span className="text-gray-500 text-xs">Email</span><p className="font-bold">{bookingData.email}</p></div>
                                <div><span className="text-gray-500 text-xs">Phone</span><p className="font-bold">{bookingData.phone}</p></div>
                                <div><span className="text-gray-500 text-xs">Country</span><p className="font-bold">{bookingData.country}</p></div>
                                <div><span className="text-gray-500 text-xs">Check-in</span><p className="font-bold">{bookingData.check_in}</p></div>
                                <div><span className="text-gray-500 text-xs">Check-out</span><p className="font-bold">{bookingData.check_out}</p></div>
                                <div><span className="text-gray-500 text-xs">Nights</span><p className="font-bold">{nights}</p></div>
                                <div><span className="text-gray-500 text-xs">Rooms</span><p className="font-bold">{roomCount}x {bookingData._room_name}</p></div>
                                <div><span className="text-gray-500 text-xs">Guests</span><p className="font-bold">{bookingData.adults} Adults{bookingData.children > 0 ? `, ${bookingData.children} Children` : ''}</p></div>
                                {bookingData.arrival_time && bookingData.arrival_time !== 'dont_know' && (
                                    <div><span className="text-gray-500 text-xs">Arrival Time</span><p className="font-bold">{bookingData.arrival_time}</p></div>
                                )}
                            </div>
                            {bookingData.special_requests && (
                                <div className="mt-3 pt-3 border-t">
                                    <span className="text-gray-500 text-xs">Special Requests</span>
                                    <p className="text-sm mt-1">{bookingData.special_requests}</p>
                                </div>
                            )}
                        </div>

                        {/* Payment Method - Pay on Arrival */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-xl">Payment</h3>
                                <div className="flex gap-1 items-center">
                                    <Lock size={14} className="text-gray-400" />
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Secure</span>
                                </div>
                            </div>

                            <div className="border-2 border-blue-600 bg-blue-50/30 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <input type="radio" checked readOnly className="w-5 h-5" />
                                    <div>
                                        <p className="font-bold text-sm">Pay on Arrival (Cash)</p>
                                        <p className="text-xs text-gray-500 mt-1">You will pay at the property upon check-in. No online payment required.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 border border-gray-200 p-4 rounded-lg flex items-center justify-between opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <input type="radio" disabled className="w-5 h-5" />
                                    <p className="font-bold text-sm text-gray-600">Credit/Debit Card <span className="text-xs font-normal">(coming soon)</span></p>
                                </div>
                                <div className="flex gap-1">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="visa" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="mastercard" />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Book Button */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex gap-3 mb-6">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreed}
                                    onChange={e => setAgreed(e.target.checked)}
                                    className="mt-1 w-5 h-5 min-w-[20px] cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                                    By clicking "Confirm Booking", I agree to the{' '}
                                    <span className="text-[#006ce4]">Terms and Conditions</span> and{' '}
                                    <span className="text-[#006ce4]">Privacy Policy</span>.
                                    I understand payment is due upon arrival at the property.
                                </label>
                            </div>

                            <button
                                onClick={handleCompleteBooking}
                                disabled={loading || !agreed}
                                className="w-full bg-[#003580] text-white font-black py-4 rounded-lg text-lg uppercase tracking-wider hover:bg-blue-900 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-[11px]">
                                <Lock size={12} />
                                <span>Encrypted and Secure</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: SUMMARY STICKY */}
                    <div className="lg:w-[370px] space-y-4">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
                            <div className="p-4 bg-gray-50 border-b">
                                <h4 className="font-bold text-sm">Your booking details</h4>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex gap-3">
                                    {bookingData._hotel_image && (
                                        <img
                                            src={bookingData._hotel_image}
                                            className="w-16 h-16 rounded object-cover"
                                            alt="hotel"
                                        />
                                    )}
                                    <div>
                                        <p className="font-bold text-xs">{bookingData._hotel_name}</p>
                                        <div className="flex text-yellow-400 text-[10px] mb-1">
                                            {Array.from({ length: bookingData._hotel_star || 3 }).map((_, i) => (
                                                <FaStar key={i} />
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-gray-500">{bookingData._destination}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500">Dates:</span>
                                        <span>{bookingData.check_in} â†’ {bookingData.check_out} ({nights} night{nights > 1 ? 's' : ''})</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500">Room:</span>
                                        <span>{roomCount}x {bookingData._room_name}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500">Guests:</span>
                                        <span>{bookingData.adults} Adults{bookingData.children > 0 ? `, ${bookingData.children} Children` : ''}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="text-xs text-gray-500 mb-2">
                                        {formatPrice(roomPrice)} Ã— {nights} night{nights > 1 ? 's' : ''} Ã— {roomCount} room{roomCount > 1 ? 's' : ''}
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-lg">Total Price</span>
                                        <span className="font-black text-2xl text-[#1a1a1a]">{formatPrice(totalAmount)}</span>
                                    </div>
                                    <p className="text-[10px] text-green-700 font-bold text-right">Includes taxes and fees</p>
                                    <p className="text-[10px] text-orange-600 font-bold text-right mt-1">Payable at the property</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AuthModal
                authModalOpen={authModalOpen}
                setAuthModalOpen={setAuthModalOpen}
                slug={`/hotel/${hotelId}/booking/final`}
            />
        </div>
    );
}
