import React from 'react';
import { useCurrency } from '@/app/contexts/site';
import { ChevronUp, Signal, CheckCircle2, Laptop } from 'lucide-react';

const ESIMListing = () => {
  const plans = [
    { id: 1, data: "1 GB - 7 days", operator: "Change", recharge: "Allowed", price: "500" },
    { id: 2, data: "1 GB - 10 SMS - 10 Mins - 3 days", operator: "Change+", recharge: "Allowed", price: "750" },
    { id: 3, data: "2 GB - 15 days", operator: "Change", recharge: "Allowed", price: "875" },
    { id: 4, data: "1 GB - 10 SMS - 10 Mins - 7 days", operator: "Change+", recharge: "Allowed", price: "875" },
  ];

  const { formatPrice } = useCurrency();

  return (
    <div className="bg-[#E9F0F7] min-h-screen p-6 font-sans">
      <div className="max-w-6xl mx-auto flex gap-6">
        
        {/* Left Sidebar Filters */}
        <div className="w-1/4 space-y-4">
          {/* Price Range */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1A2B49]">Price Range</h3>
              <ChevronUp size={20} className="text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-400 mb-6">Starts from BDT 500 - BDT 8,625 against your search. Price is a subject to change.</p>
            <div className="relative h-1.5 bg-blue-100 rounded-full mb-4">
              <div className="absolute h-full bg-blue-500 rounded-full w-full"></div>
              <div className="absolute -top-1.5 left-0 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
              <div className="absolute -top-1.5 right-0 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
            </div>
            <p className="text-center text-xs font-bold text-gray-600 uppercase">BDT 500 - BDT 8,625</p>
          </div>

          {/* Operators */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1A2B49]">Operators</h3>
              <ChevronUp size={20} className="text-gray-400" />
            </div>
            <div className="space-y-3">
              {['Change', 'Change+'].map((op) => (
                <label key={op} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="operator" className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
                  {op}
                </label>
              ))}
            </div>
          </div>

          {/* Plan Option */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1A2B49]">Plan Option</h3>
              <ChevronUp size={20} className="text-gray-400" />
            </div>
            <div className="space-y-3">
              {['Package', 'Unlimited'].map((opt) => (
                <label key={opt} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="plan" className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-3/4">
          <h2 className="text-xl font-bold text-[#1A2B49] mb-4">21 eSIM Found</h2>

          {/* Featured eSIM Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-white flex justify-between items-center mb-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇺🇸</span>
                <h3 className="text-xl font-bold text-[#1A2B49]">eSIM for United States</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                  <Signal size={16} />
                  <span>T-Mobile (5G), Verizon (5G)</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-gray-600">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>If you're running low, you can always Top-Up</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-gray-600">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>The package starts when you connect to a supported network</span>
                </div>
              </div>

              <button className="mt-4 px-4 py-2 bg-[#F0F5FA] text-[#1A2B49] text-xs font-bold rounded-full border border-gray-200 hover:bg-gray-100">
                Check Device Compatibility
              </button>
            </div>

            {/* Mock Credit Card Illustration */}
            <div className="relative w-64 h-40 bg-gradient-to-br from-[#0A1D37] to-[#1A3A63] rounded-2xl p-4 text-white shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-full bg-white opacity-10 skew-x-[20deg] -mr-8"></div>
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                    <span className="text-red-500 text-2xl">★</span>
                    <span className="text-xl font-black italic tracking-tighter">CHANGE<sup className="text-sm font-normal">+</sup></span>
                   </div>
                   <div className="bg-white/20 p-2 rounded-lg border border-white/30 backdrop-blur-sm">
                      <div className="w-8 h-8 flex flex-col justify-center items-center gap-0.5">
                        <div className="w-full h-1 bg-cyan-400 rounded-full"></div>
                        <div className="text-[8px] font-bold text-cyan-400 tracking-widest">eSIM</div>
                        <div className="w-full h-1 bg-cyan-400 rounded-full"></div>
                      </div>
                   </div>
                </div>
                <div className="mt-auto flex justify-between items-end">
                    <div className="flex flex-col opacity-50 space-y-1">
                        <div className="w-24 h-1 bg-white rounded-full"></div>
                        <div className="w-16 h-1 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>
          </div>

          {/* Plan List */}
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-blue-200 transition-all flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <div className="w-8 h-8 border-2 border-orange-400 rounded-md relative flex flex-col justify-center items-center gap-0.5">
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                        <div className="w-5 h-0.5 bg-orange-400"></div>
                        <div className="w-5 h-0.5 bg-orange-400"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#1A2B49]">{plan.data}</h4>
                    <p className="text-xs text-gray-500">
                      Operator: <span className="font-bold text-gray-700">{plan.operator}</span> Recharge: <span className="font-bold text-gray-700">{plan.recharge}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#1A2B49]">{formatPrice(plan.price)}</span>
                  </div>
                  <button className="bg-[#1B84FF] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESIMListing;