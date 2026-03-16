"use client";
import { useState, useEffect, useCallback } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1400&q=80",
    alt: "Masjid al-Haram, Makkah",
  },
  {
    src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
    alt: "Kaaba Tawaf",
  },
  {
    src: "https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=800&q=80",
    alt: "Madinah Mosque",
  },
  {
    src: "https://www.aljazeera.com/wp-content/uploads/2022/07/h_57793313.jpg?resize=770%2C513&quality=80",
    alt: "Pilgrims",
  },
  {
    src: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80",
    alt: "Makkah Night",
  },
];

export default function UmrahHeroGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const next = useCallback(
    (e) => {
      e?.stopPropagation();
      setLightboxIndex((p) => (p + 1) % GALLERY_IMAGES.length);
    },
    []
  );

  const prev = useCallback(
    (e) => {
      e?.stopPropagation();
      setLightboxIndex((p) => (p - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    },
    []
  );

  useEffect(() => {
    const onKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, next, prev]);

  return (
    <>
      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4"
          >
            <button
              className="absolute top-5 right-5 z-[1000] text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"
              onClick={() => setLightboxIndex(null)}
            >
              <FiX size={28} />
            </button>
            <button
              onClick={prev}
              className="absolute left-4 z-[1000] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
            >
              <FiChevronLeft size={36} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 z-[1000] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
            >
              <FiChevronRight size={36} />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              src={GALLERY_IMAGES[lightboxIndex].src}
              alt={GALLERY_IMAGES[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain pointer-events-none"
            />
            <div className="absolute bottom-8 bg-black/50 text-white text-sm px-4 py-1.5 rounded-full">
              {lightboxIndex + 1} / {GALLERY_IMAGES.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Gallery Grid ── */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
        {/* Main large image */}
        <div
          className="col-span-2 row-span-2 relative group cursor-zoom-in overflow-hidden"
          onClick={() => setLightboxIndex(0)}
        >
          <img
            src={GALLERY_IMAGES[0].src}
            alt={GALLERY_IMAGES[0].alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* 4 smaller images */}
        {GALLERY_IMAGES.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="relative group cursor-zoom-in overflow-hidden rounded-lg"
            onClick={() => setLightboxIndex(i + 1)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {i === 3 && GALLERY_IMAGES.length > 5 && (
              <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-bold">See all photos</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}