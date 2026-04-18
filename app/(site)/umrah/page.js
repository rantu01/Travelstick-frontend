"use client";
import UmrahContactForm from "./components/UmrahContactForm";
import UmrahHeroGallery from "./components/UmrahHeroGallery";
import UmrahSpirit from "./components/UmrahSpirit";
import { useState } from "react";



export default function UmrahPage() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  return (
    <main
      className="min-h-screen bg-[#f9f6f1]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Arabic Bismillah */}
          <p
            className="text-center text-[18px] sm:text-[22px] text-[#7a7060] mb-3 tracking-wide leading-tight"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          {/* Image Gallery (replaces old title section) */}
          <div className="mb-5 sm:mb-6">
            <UmrahHeroGallery />
          </div>

          {/* Sub-badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center gap-2 bg-[#f7f3ec] border border-[#ede7d9] rounded-full px-4 sm:px-5 py-2 text-[11px] sm:text-[13px] text-[#7a7060] text-center max-w-full">
              <span>🕊️</span>
              <span className="font-medium">pure guidance &amp; heartfelt connection</span>
              <span>🤍</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-Column Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-7 items-start">

          {/* Left — Spirit content */}
          <div className="w-full lg:flex-1 min-w-0">
            <UmrahSpirit />
          </div>

          {/* Right — Contact form */}
          <div className="w-full lg:w-[360px] xl:w-[390px] flex-shrink-0 min-w-0">
            <UmrahContactForm />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer: Book Now (opens modal) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t z-50 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase">Need help?</p>
          <p className="text-sm font-semibold">Reach our Umrah team</p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="bg-[#1a4fa0] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all"
        >
          Book Now
        </button>
      </div>

      {/* Booking Modal (mobile) - shows UmrahContactForm but page form remains visible */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-4 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            <div className="p-2 max-h-[80vh] overflow-auto">
              <UmrahContactForm />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}