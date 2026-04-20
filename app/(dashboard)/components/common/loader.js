"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const MainLoader = () => {
   return (
      <div
         style={{ zIndex: 99999 }}
         className="left-0 w-full top-0 h-screen flex justify-center items-center bg-white"
         id="main-loader"
      >
         <Loader />
      </div>
   );
};
export default MainLoader;
export const LayoutLoader = () => {
   return (
      <div id="main-loader" className="fixed inset-0 z-[99999] bg-white">
         <div className="absolute inset-0 overflow-hidden">
            <video
               src="/download.mp4"
               autoPlay
               muted
               loop
               playsInline
               className="absolute inset-0 w-full h-full object-cover"
            />
         </div>
      </div>
   );
};

export const Loader = () => {
   return (
      <div className="inline-block">
         <div className="relative">
            <video
               src="/Please wait.mp4"
               autoPlay
               muted
               loop
               playsInline
               className="absolute inset-0 w-full h-full object-cover"
            />
         </div>
      </div>
   );
};
export const showLoader = () => {
   setTimeout(() => {
      const loader = document.getElementById("main-loader");
      if (loader) {
         loader.classList.remove("hidden");
      } else {
         console.warn("Element with ID 'main-loader' not found. Ensure the component is mounted.");
      }
   }, 0);
};

export const hideLoader = () => {
   setTimeout(() => {
      const loader = document.getElementById("main-loader");
      if (loader) {
         loader.classList.add("hidden");
      } else {
         console.warn("Element with ID 'main-loader' not found. Ensure the component is mounted.");
      }
   }, 0);
};


export const RootLoader = ({ children }) => {
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Simulate a loading delay to ensure loader is visible
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
   }, []);

   return (
      <>
         {loading ? (
            <div
               style={{ zIndex: 99999 }}
               className="left-0 w-full top-0 h-screen flex justify-center items-center bg-white"
               id="main-loader"
            >
               <Loader />
            </div>
         ) : (
            children
         )}
      </>
   );
};