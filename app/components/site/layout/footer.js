/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { useI18n } from "@/app/contexts/i18n";
import { fetchPublicSettings, postNewsletterList } from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { Form, Image as ImageAntd } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaGoogle } from "react-icons/fa6";

const Footer = () => {
  const i18n = useI18n();
  const [form] = Form.useForm();
  const [setting] = useFetch(fetchPublicSettings);
  const [currentYear, setCurrentYear] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentYear(new Date().getFullYear());
    }
  }, []);

  const exploreLinks = [
    { name: "Flight", link: "/flight" },
    { name: "Hotel", link: "/hotel" },
    { name: "Visa", link: "/visa" },
    { name: "Holiday", link: "/holiday" },
  ];

  const socialIcons = [
    { icon: FaFacebookF, color: "bg-[#1877F2]", link: "https://www.facebook.com/banglacoltd" },
    { icon: FaInstagram, color: "bg-[#E4405F]", link: "http://instagram.com/banglaco_com" },
    { icon: FaGoogle, color: "bg-[#FF0000]", link: "https://share.google/pz5Q02hOifcZQcClt" },
  ];

  return (
    <footer className="w-full bg-[#1e2e83] text-white pt-16 pb-8 px-4 md:px-10 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Logo & Description */}
          <div className="space-y-6">
            {setting?.site_logo ? (
              <Image src={setting.site_logo} alt="logo" width={200} height={60} priority />
            ) : (
              <h2 className="text-3xl font-bold italic">Banglaco.com</h2>
            )}
            {/* Font size bariye text-base kora hoyeche */}
            <p className="text-base leading-relaxed opacity-90 max-w-[300px]">
              {setting?.site_description || "Explore the world with ease. We provide premium travel services including flights, hotels, and holiday packages tailored for you."}
            </p>
            <div className="flex gap-3">
              {socialIcons.map((item, idx) => (
                <Link key={idx} href={item.link} className={`${item.color} p-2.5 rounded-full text-white text-lg hover:scale-110 transition-transform`}>
                  <item.icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="text-xl font-bold mb-6">Explore</h4>
            {/* Font size text-base kora hoyeche */}
            <ul className="space-y-4 text-base opacity-90">
              {exploreLinks.map((item, idx) => (
                <li key={idx} className="hover:translate-x-2 transition-transform">
                  <Link href={item.link}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Useful Links</h4>
            <ul className="space-y-4 text-base opacity-90">
              <li className="hover:translate-x-2 transition-transform"><Link href="/about">About Us</Link></li>
              <li className="hover:translate-x-2 transition-transform"><Link href="/contact">Contact Us</Link></li>
              <li className="hover:translate-x-2 transition-transform"><Link href="/terms">Terms & Conditions</Link></li>
              <li className="hover:translate-x-2 transition-transform"><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Map */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold mb-6">Contact Us</h4>
            <div className="text-base space-y-4 opacity-90">

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-blue-300 transition-colors cursor-pointer"
              >
                <p className="leading-relaxed">House#3, Road#13, Gulshan 01, <br />Dhaka-1212, Bangladesh</p>
              </a>

              <p>Email: <span className="font-medium">{setting?.site_email || "ask@banglaco.com"}</span></p>
              <p>Phone: <span className="font-medium">{setting?.site_phone || "091111122221"}</span></p>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden border-2 border-blue-400/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.277552998!2d90.412!3d23.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ2JzQ4LjAiTiA5MMKwMjQnNDMuMiJF!5e0!3m2!1sen!2sbd!4v1625555555555"
                className="w-full h-36 border-0"
                allowFullScreen=""
                loading="lazy"
                title="Banglaco Limited Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-16 pt-8 border-t border-blue-800/50 flex flex-col items-center space-y-8 text-white">

          {/* Partner & Payment Section */}
          <div className="flex flex-wrap items-start justify-center gap-10 md:gap-16">

          

            {/* Vertical Divider for desktop */}
            <div className="hidden md:block h-20 w-px bg-white/20 self-end"></div>

            {/* Verified by */}
            <div className="flex flex-col space-y-4">
              <span className="text-lg font-semibold">Verified by</span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white/10 rounded-lg p-2 border border-white/5"><img src="https://basis.org.bd/public/img/relatedlink/5e1132b3570c8Pr-8.jpg" className="h-6" alt="BASIS" /></div>
                <div className="bg-white/10 rounded-lg p-2 border border-white/5"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROXxbbVTvM8UeXF7Spw1PsqQTvMgilDo7eXA&s" className="h-6" alt="e-CAB" /></div>
                <div className="bg-white/10 rounded-lg p-2 border border-white/5"><img src="https://dbid.gov.bd/assets/front/ubid/images/logo-bid.png" className="h-6" alt="DBID" /></div>
                <div className="bg-white/10 rounded-lg p-2 border border-white/5"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVnPXpYZcjG6UIHyUmx0SXfskZWOgQdfESPA&s" className="h-6" alt="PCI" /></div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col space-y-4">
              <span className="text-lg font-semibold">Payment Method</span>
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-white rounded-md p-1.5"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5 w-8 object-contain" alt="Mastercard" /></div>
                <div className="bg-white rounded-md p-1.5"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Dutch-bangla-bank-ltd.svg/960px-Dutch-bangla-bank-ltd.svg.png" className="h-5 w-8 object-contain" alt="DBBL" /></div>
                <div className="bg-white rounded-md p-1.5"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg/3840px-Visa_Inc._logo_%282005%E2%80%932014%29.svg.png" className="h-5 w-8 object-contain" alt="Visa" /></div>
                <div className="bg-white rounded-md p-1.5"><img src="https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg" className="h-5 w-8 object-contain" alt="Nagad" /></div>
                <div className="bg-white rounded-md p-1.5"><img src="https://static.vecteezy.com/system/resources/thumbnails/068/764/291/small_2x/upay-logo-mobile-banking-app-icon-transparent-background-free-png.png" className="h-5 w-8 object-contain" alt="Upay" /></div>
                <div className="bg-white rounded-md p-1.5"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" className="h-5 w-8 object-contain" alt="Amex" /></div>
                <div className="bg-white rounded-md p-1.5"><img src="https://freelogopng.com/images/all_img/1656227518bkash-logo-png.png" className="h-5 w-8 object-contain" alt="bkash" /></div>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="text-base opacity-60 text-center pt-4">
            © {currentYear || 2026} <span className="font-bold">{setting?.site_name || "Banglaco Ltd."}</span> All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;