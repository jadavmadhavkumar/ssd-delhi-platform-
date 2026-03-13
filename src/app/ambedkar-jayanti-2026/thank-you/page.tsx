"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Shield, Calendar, Mail, User, Home, Phone, Download } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const ssdId = searchParams.get("ssdId") || "";
  const [mounted, setMounted] = useState(false);

  // Get stored data
  const storedName = typeof window !== 'undefined' ? localStorage.getItem('registrantName') : null;
  const storedSsdId = ssdId || (typeof window !== 'undefined' ? localStorage.getItem('ssdId') : null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003285] via-[#002561] to-[#001a3d] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003285] via-[#002561] to-[#001a3d] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF7F3E] to-[#ff6a1a] p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
              Registration Confirmed!
            </h1>
            <p className="text-white/90 font-medium">Jai Bhim! Jai Samta!</p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* SSD ID Display */}
            <div className="bg-gradient-to-r from-[#FFDA78] to-[#FFE09A] rounded-2xl p-6 text-center border-4 border-[#FF7F3E]">
              <p className="text-sm font-bold text-[#003285] uppercase tracking-widest mb-2">
                Your SSD Member ID
              </p>
              <p className="text-3xl md:text-4xl font-black text-[#003285]">
                {storedSsdId || "SSD-DL-2026-000001"}
              </p>
              <p className="text-xs text-[#003285]/70 mt-2">
                📱 Screenshot this for future reference
              </p>
            </div>

            {/* Confirmation Message */}
            <div className="text-center space-y-3">
              <p className="text-gray-700 leading-relaxed">
                Thank you <strong className="text-[#003285]">{storedName || 'Registrant'}</strong>! 
                Your spot for <strong className="text-[#003285]">SSD Ambedkar Jayanti 2026</strong> is confirmed.
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-[#FF7F3E]" />
                <span>Event details will be sent to your registered email</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 space-y-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#003285]" />
                <h2 className="font-bold text-[#003285] text-lg">Event Details</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7F3E]/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#FF7F3E]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Date</p>
                    <p className="font-bold text-[#003285]">14 April 2026 (Tuesday)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7F3E]/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#FF7F3E]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Venue</p>
                    <p className="font-bold text-[#003285]">Ambedkar Bhawan, Rani Jhansi Road, Delhi</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7F3E]/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#FF7F3E]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Entry</p>
                    <p className="font-bold text-[#003285]">Show your SSD ID at registration</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-[#003285] mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#FF7F3E]" />
                What Happens Next
              </h3>
              <div className="space-y-3">
                {[
                  { step: 1, text: "Confirmation email with registration details" },
                  { step: 2, text: "Event schedule and program (1 week before)" },
                  { step: 3, text: "Final reminder with venue map (1 day before)" },
                  { step: 4, text: "Bring SSD ID + photo ID for entry" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#003285] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <p className="text-gray-700 text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <button className="w-full bg-[#003285] hover:bg-[#002561] text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2">
                  Back to Home
                </button>
              </Link>
              <button 
                onClick={() => window.print()}
                className="px-6 py-3 border-2 border-[#003285] text-[#003285] font-bold rounded-full hover:bg-[#003285] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-[#003285]/5 to-[#2A629A]/5 px-6 py-4 text-center border-t">
            <p className="text-sm text-gray-600 font-medium">
              Liberty • Equality • Fraternity
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-blue-100">
          <h4 className="font-bold mb-3">Need Help?</h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <a href="mailto:info@ssddelhi.org" className="flex items-center gap-2 hover:text-[#FFDA78] transition-colors">
              <Mail className="w-4 h-4" />
              info@ssddelhi.org
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-2 hover:text-[#FFDA78] transition-colors">
              <Phone className="w-4 h-4" />
              +91-XXXXXXXXXX
            </a>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-center text-blue-200/60 text-xs">
          <p>Your data is secure and protected under Indian data privacy laws</p>
        </div>
      </div>
    </div>
  );
}
