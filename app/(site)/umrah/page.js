import UmrahContactForm from "./components/UmrahContactForm";
import UmrahHeroGallery from "./components/UmrahHeroGallery";
import UmrahSpirit from "./components/UmrahSpirit";


export const metadata = {
  title: "Umrah Guidance — Banglaco",
  description:
    "Pure Umrah guidance & spiritual connection. No packages — just heartfelt help for your sacred journey.",
};

export default function UmrahPage() {
  return (
    <main
      className="min-h-screen bg-[#f9f6f1]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Arabic Bismillah */}
          <p
            className="text-center text-[22px] text-[#7a7060] mb-3 tracking-wide"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          {/* Image Gallery (replaces old title section) */}
          <div className="mb-6">
            <UmrahHeroGallery />
          </div>

          {/* Sub-badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-[#f7f3ec] border border-[#ede7d9] rounded-full px-5 py-2 text-[13px] text-[#7a7060]">
              <span>🕊️</span>
              <span className="font-medium">pure guidance &amp; heartfelt connection</span>
              <span>🤍</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-Column Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* Left — Spirit content */}
          <div className="w-full lg:flex-1">
            <UmrahSpirit />
          </div>

          {/* Right — Contact form */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <UmrahContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}