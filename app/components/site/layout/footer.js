/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { useI18n } from "@/app/contexts/i18n";
import { fetchPublicSettings, postNewsletterList } from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { Form, Image as ImageAntd } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa6";

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

  // Fake links for "Explore" column as per image
  const exploreLinks = [
    { name: "Flight", link: "/flight" },
    { name: "Hotel", link: "/hotel" },
    { name: "Visa", link: "/visa" },
    { name: "Holiday", link: "/holiday" },
    { name: "eSim", link: "/esim" },
    { name: "Umrah", link: "/umrah" },
    { name: "Promotions", link: "/promotions" },
    { name: "Travel Guide", link: "/guide" },
    { name: "Top Destinations", link: "/destinations" },
  ];

  // Map settings or use fake data for social icons
  const socialIcons = [
    { icon: FaFacebookF, color: "bg-[#1877F2]", link: "#" },
    { icon: FaInstagram, color: "bg-[#E4405F]", link: "#" },
    { icon: FaYoutube, color: "bg-[#FF0000]", link: "#" },
    { icon: FaFacebookF, color: "bg-[#1877F2]", link: "#" },
    { icon: FaInstagram, color: "bg-[#E4405F]", link: "#" },
    { icon: FaYoutube, color: "bg-[#FF0000]", link: "#" },
  ];

  return (
    <footer className="w-full bg-[#1e2e83] text-white pt-12 pb-6 px-4 md:px-10 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Logo & Description */}
          <div className="space-y-5">
            {setting?.site_logo ? (
              <Image src={setting.site_logo} alt="logo" width={180} height={50} priority />
            ) : (
              <h2 className="text-2xl font-bold italic">Banglaco.com</h2>
            )}
            <p className="text-sm leading-relaxed opacity-90 max-w-[280px]">
              {setting?.site_description || "Here wil add shorta a awdasddad descriptionHere wil add shoart descriptionHere wil add add shorshortt descriptionHere wil add short description"}
            </p>
            <div className="flex gap-2">
              {socialIcons.map((item, idx) => (
                <Link key={idx} href={item.link} className={`${item.color} p-2 rounded-full text-white text-sm hover:opacity-80 transition`}>
                  <item.icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="text-lg font-bold mb-6">Explore</h4>
            <ul className="space-y-3 text-sm opacity-90">
              {exploreLinks.map((item, idx) => (
                <li key={idx} className="hover:translate-x-1 transition-transform">
                  <Link href={item.link}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Useful Links</h4>
            <ul className="space-y-3 text-sm opacity-90">
              {/* Existing backend links used here */}
              <li className="hover:translate-x-1 transition-transform"><Link href="/about">About Us</Link></li>
              <li className="hover:translate-x-1 transition-transform"><Link href="/contact">Contact Us</Link></li>
              <li className="hover:translate-x-1 transition-transform"><Link href="/terms">Terms & Conditions</Link></li>
              <li className="hover:translate-x-1 transition-transform"><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Map */}
          <div className="space-y-5">
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <div className="text-sm space-y-4 opacity-90">
              <p>Her wil be Banglaco Address Gulshan<br />1, Dhaka, Bangladesh</p>
              <p>Email: {setting?.site_email || "ask@banglaco.com"}</p>
              <p>Phone: {setting?.site_phone || "091111122221"}</p>
            </div>
            {/* Fake Map Placeholder like in image */}
            <div className="mt-4 rounded-lg overflow-hidden border border-blue-400">
                <img 
                  src="https://www.maptive.com/wp-content/uploads/2020/10/Drive-Time-Polygon-Commute-Times-590x357.jpg" 
                  alt="map" 
                  className="w-full h-32 object-cover"
                />
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-16 pt-8 border-t border-blue-800 flex flex-col items-center space-y-6">
          
          {/* Payment Partners */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="font-semibold mr-2">We Accept</span>
            <div className="bg-white rounded-md px-4 py-2 flex items-center gap-3">
              {/* Dynamic or static payment icons */}
              <img src="https://freelogopng.com/images/all_img/1656227518bkash-logo-png.png" className="h-4" alt="visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="mastercard" />
              <img src="https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg" className="h-5" alt="nagad" />
              {/* Add more as per your backend settings */}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm opacity-80">
            &copy; {currentYear || 2026} <span className="font-semibold">{setting?.site_name || "Banglaco Ltd."}</span> All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;