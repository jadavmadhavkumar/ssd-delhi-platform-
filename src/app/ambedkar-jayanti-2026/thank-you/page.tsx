"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, MapPin, Mail, ArrowLeft } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003285] via-[#002561] to-[#001a3d] py-8 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FF7F3E] to-[#ff6a1a] p-6 text-center">
            <CheckCircle2 className="w-20 h-20 text-white mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Thank You!
            </h1>
          </div>
          
          <CardContent className="p-8 text-center space-y-6">
            <p className="text-lg text-gray-700">
              Your spot for <strong>SSD Ambedkar Jayanti 2026</strong> is confirmed.
            </p>
            
            <p className="text-gray-600">
              Check your email for updates and further instructions about the event.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-6 space-y-4">
              <h2 className="font-bold text-[#003285]">Event Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-[#FF7F3E]" />
                  <span>14 April 2026</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-[#FF7F3E]" />
                  <span>Ambedkar Bhawan, Delhi</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-[#FF7F3E]" />
                  <span>Confirmation email sent</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Badge className="bg-[#003285] text-white px-4 py-2">
                🎉 See you on Ambedkar Jayanti!
              </Badge>
            </div>
            
            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500 mb-4">
                Share with friends who might be interested
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/">
                  <Button variant="outline" className="rounded-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-blue-200 text-sm">
          <p>Jai Bhim! Jai Samta!</p>
        </div>
      </div>
    </div>
  );
}
