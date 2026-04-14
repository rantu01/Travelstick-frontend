"use client";
import { useState } from "react";
import { createUmrahInquiry } from "@/app/helper/backend";
import { useAction } from "@/app/helper/hooks";

const TOPICS = ["Tawaf", "Sa'i", "Ihram", "Duas", "Packing", "Visa Info"];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  reachBy: "WhatsApp",
  question: "",
};

export default function UmrahContactForm() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const toggleTopic = (t) =>
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await useAction(
        createUmrahInquiry,
        {
          ...form,
          topics: selectedTopics,
        },
        () => {
          setSubmittedData({ name: form.name, reachBy: form.reachBy });
          setForm(INITIAL_FORM);
          setSelectedTopics([]);
          setSubmitted(true);
        },
        true,
        "Your Umrah inquiry has been submitted successfully"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg lg:sticky lg:top-6 w-full max-w-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[#1a4fa0] text-base">📨</span>
            <h3 className="font-bold text-[#2d2822] text-[16px]">Reach our team</h3>
          </div>
          <span className="bg-red-500 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase">
            ASAP
          </span>
        </div>
        <p className="text-[12.5px] text-[#9a8e80] leading-relaxed">
          💬 We'll reply within hours — ask anything about the rites, spirituality, or logistics.
        </p>
      </div>

      {/* Form Body */}
      <div className="px-6 py-5">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-bold text-[#1a4fa0] text-[15px] mb-1">Message Sent!</p>
            <p className="text-[13px] text-[#9a8e80]">
              We'll reach out to you soon via {submittedData?.reachBy ?? form.reachBy}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#9a8e80] uppercase tracking-wide mb-1.5">
                <span>👤</span> Full name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Aisha Khan"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#2d2822] bg-[#faf9f7] focus:outline-none focus:border-[#1a4fa0] focus:ring-2 focus:ring-[#1a4fa0]/10 placeholder-gray-300 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#9a8e80] uppercase tracking-wide mb-1.5">
                <span>✉️</span> Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="aisha@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#2d2822] bg-[#faf9f7] focus:outline-none focus:border-[#1a4fa0] focus:ring-2 focus:ring-[#1a4fa0]/10 placeholder-gray-300 transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#9a8e80] uppercase tracking-wide mb-1.5">
                <span>📱</span> Phone / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+880 1XXX-XXXXXX"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#2d2822] bg-[#faf9f7] focus:outline-none focus:border-[#1a4fa0] focus:ring-2 focus:ring-[#1a4fa0]/10 placeholder-gray-300 transition-all"
              />
            </div>

            {/* Reach By */}
            <div>
              <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#9a8e80] uppercase tracking-wide mb-1.5">
                <span>🎯</span> Best way to reach you
              </label>
              <div className="relative">
                <select
                  name="reachBy"
                  value={form.reachBy}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#2d2822] bg-[#faf9f7] appearance-none focus:outline-none focus:border-[#1a4fa0] focus:ring-2 focus:ring-[#1a4fa0]/10 transition-all pr-9"
                >
                  <option value="WhatsApp">WhatsApp (fastest)</option>
                  <option>Phone Call</option>
                  <option>Email</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a4fa0]"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Question */}
            <div>
              <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#9a8e80] uppercase tracking-wide mb-1.5">
                <span>🕌</span> Your question / intention
              </label>
              <textarea
                name="question"
                rows={3}
                placeholder="I'd like to know more about the spiritual preparation for Umrah..."
                value={form.question}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#2d2822] bg-[#faf9f7] focus:outline-none focus:border-[#1a4fa0] focus:ring-2 focus:ring-[#1a4fa0]/10 placeholder-gray-300 resize-none transition-all"
              />
            </div>

            {/* Topic Chips */}
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-150 ${
                    selectedTopics.includes(t)
                      ? "bg-[#1a4fa0] text-white border-[#1a4fa0]"
                      : "bg-[#f7f3ec] text-[#1a4fa0] border-[#e8e0ce] hover:bg-[#eef2fb] hover:border-[#1a4fa0]/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-[14px] mt-1 transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: "#1a4fa0" }}
            >
              <span>📨</span> {loading ? "Sending..." : "Send & connect · فريقنا"}
            </button>
          </form>
        )}
      </div>

      {/* Privacy Note */}
      <div className="px-6 pb-4 text-center">
        <p className="text-[11px] text-[#b0a898]">
          ★ We respect your time — no sales pitches, only sincere guidance.
        </p>
      </div>

      {/* Urgent */}
      <div className="border-t border-gray-100 px-6 py-4 bg-[#faf9f7] flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[12.5px] text-[#7a7060]">
          <span>📞</span>
          <span>
            <strong className="text-[#2d2822]">Urgent?</strong> also call/whatsapp
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12.5px] text-[#1a4fa0] font-bold">
          <span className="text-[#7a7060]">📲</span>
          <a href="tel:+8801913751185" className="hover:underline">
            +880 1913-751185
          </a>
          <span className="text-[11px] text-[#9a8e80] font-normal">(quick response)</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#7a7060]">
          <span>📍</span>
          <span>Based in Bangladesh — real time help.</span>
        </div>
      </div>
    </div>
  );
}