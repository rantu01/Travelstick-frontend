"use client";
import { useState } from "react";

const RITES = [
  {
    icon: "👕",
    label: "Ihram",
    sub: "state of purity & intention",
  },
  {
    icon: "🔄",
    label: "Tawaf",
    sub: "7 circles around Kaaba",
  },
  {
    icon: "🚶",
    label: "Sa'i",
    sub: "between Safa & Marwah",
  },
  {
    icon: "✂️",
    label: "Halq / Taqsir",
    sub: "shaving / trimming",
  },
];

const STEPS = [
  {
    title: "Ihram & Niyyah:",
    desc: "At the miqat, wear ihram, recite talbiyah, and fix your intention purely for Allah.",
  },
  {
    title: "Tawaf al-qudum:",
    desc: "Enter Masjid al-Haram, perform tawaf with heartfelt dhikr, kiss/point to Hajar Aswad.",
  },
  {
    title: "Maqam Ibrahim:",
    desc: "Pray two rak'ahs behind the Station of Ibrahim, then drink Zamzam water with supplication.",
  },
  {
    title: "Sa'i:",
    desc: "Walk seven times between Safa and Marwah, reflecting on Hajar's trust in Allah.",
  },
  {
    title: "Shaving / Shortening:",
    desc: "Men shave or trim; women trim a fingertip's length — emerging renewed.",
  },
];

const TIPS = [
  {
    label: "Best times:",
    desc: "any time of year, but especially the peaceful months (Rajab, Sha'ban, Ramadan).",
  },
  {
    label: "Etiquette:",
    desc: "humility, kindness, avoiding arguments — your 'Umrah is accepted.",
  },
];

export default function UmrahSpirit() {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-sm w-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-red-400 text-xl">🤍</span>
        <h2 className="text-[#2d2822] font-bold text-[18px]">The spirit of &#8216;Umrah</h2>
      </div>
      <p className="text-[#7a7060] text-[14px] leading-relaxed mb-6">
        A journey of renewal, humility, and closeness to the Divine. Below you'll find the essential
        steps, sacred rites, and inner meanings — no itineraries, no prices.
      </p>

      {/* Rites Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-7">
        {RITES.map((r) => (
          <div
            key={r.label}
            className="flex flex-col items-center text-center bg-[#f7f3ec] border border-[#ede7d9] rounded-xl py-4 px-2 hover:bg-[#eef2fb] hover:border-[#1a4fa0]/20 transition-all duration-200 group min-w-0"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {r.icon}
            </span>
            <span className="text-[12px] font-bold text-[#1a4fa0] block mb-0.5 leading-tight">{r.label}</span>
            <span className="text-[10.5px] text-[#9a8e80] leading-snug">{r.sub}</span>
          </div>
        ))}
      </div>

      {/* Numbered Steps */}
      <div className="flex flex-col gap-4 mb-7">
        {STEPS.map((s, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div
              className="min-w-[26px] h-[26px] rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5"
              style={{ background: "#1a4fa0" }}
            >
              {i + 1}
            </div>
            <div className="min-w-0">
              <span className="text-[13.5px] font-bold text-[#2d2822]">{s.title}</span>{" "}
              <span className="text-[13.5px] text-[#7a7060] leading-relaxed">{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Block */}
      <div className="bg-[#f7f3ec] border border-[#e8e0ce] border-l-4 border-l-[#c8a96e] rounded-xl p-5 mb-6">
        <div className="text-[#c8a96e] text-3xl font-serif leading-none mb-1">❝</div>
        <p className="text-[#7a7060] text-[13px] italic leading-relaxed mb-3">
          The best supplication is that of the day of Arafah, but during 'Umrah, let your heart
          speak:
        </p>
        <p className="text-[#7a7060] text-[13px] italic leading-relaxed mb-4">
          "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ
          النَّار"
        </p>
        <p
          className="text-[#1a4fa0] text-right leading-loose"
          style={{ fontFamily: "'Amiri', serif", fontSize: "20px" }}
        >
          لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ
        </p>
      </div>

      {/* Tips */}
      <div className="flex flex-col gap-2.5">
        {TIPS.map((tip, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] mt-2 flex-shrink-0" />
            <p className="text-[13.5px] text-[#7a7060] leading-relaxed">
              <span className="font-bold text-[#2d2822]">{tip.label}</span> {tip.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}