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
    </main>
  );
}