"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Shield, User, Mail, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyPage({ params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = use(params);
  const router = useRouter();
  const [searchId, setSearchId] = useState(memberId || "");

  // If memberId is provided in URL, verify that member
  const member = useQuery(api.users?.getUserByClerkId as any, {
    clerkId: memberId
  }) || null;

  const handleVerify = () => {
    if (searchId) {
      router.push(`/verify/${searchId}`);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 bg-[#003285] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF7F3E]/20 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="border-[#FF7F3E] text-[#FFDA78] bg-[#FF7F3E]/10 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
              ✓ Member Verification
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Validate <span className="text-[#FFDA78]">Sainik Identity</span>
            </h1>
            <p className="text-xl text-blue-100/90 font-medium leading-relaxed">
              Verify SSD Delhi membership status. Enter membership number or scan QR code to verify credentials.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Content */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-md mx-auto space-y-6">
            {/* Search Form */}
            <Card className="border-none shadow-xl shadow-slate-100/60 rounded-[40px] overflow-hidden bg-white p-8">
              <div className="mb-6">
                <h2 className="text-xl font-black text-[#003285] mb-2 uppercase tracking-tight">Verify Member</h2>
                <p className="text-slate-500 text-sm font-medium">Enter membership number or member ID</p>
              </div>
              <div className="flex gap-3">
                <Input
                  placeholder="SSD-DL-2024-001"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleVerify()}
                  className="rounded-2xl border-slate-100 bg-slate-50 py-6 focus:ring-[#FF7F3E] font-bold"
                />
                <Button onClick={handleVerify} className="bg-[#003285] hover:bg-[#002561] text-white px-8 rounded-2xl font-bold uppercase tracking-widest">Verify</Button>
              </div>
            </Card>

            {/* Verification Result */}
            {member ? (
              member.membershipStatus === "approved" ? (
                <Card className="border-none shadow-2xl shadow-green-100/50 rounded-[48px] overflow-hidden bg-white relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[100px] pointer-events-none" />
                  <CardHeader className="text-center pt-12">
                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-black text-green-900 mb-2">Verified Sainik</CardTitle>
                    <CardDescription className="text-green-600 font-bold uppercase tracking-widest text-xs">
                      Official SSD Delhi Member
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 space-y-4">
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[32px]">
                      <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2A629A]">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</div>
                        <div className="text-lg font-black text-[#003285]">{member.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[32px]">
                      <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2A629A]">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Membership No.</div>
                        <div className="text-lg font-black text-[#FF7F3E] font-mono tracking-tighter">{member.membershipNumber}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[32px]">
                      <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2A629A]">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Hash</div>
                        <div className="text-sm font-bold text-[#003285]">{member.email.substring(0, 3)}***@***.***</div>
                      </div>
                    </div>
                    <div className="pt-8">
                      <Badge className="w-full justify-center text-sm py-4 bg-green-600 hover:bg-green-700 text-white rounded-[24px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-600/20">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Active Status
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                  <CardHeader className="text-center">
                    <XCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                    <CardTitle className="text-2xl text-yellow-800">Not an Active Member</CardTitle>
                    <CardDescription className="text-yellow-600">
                      This membership is not currently active
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="outline" className="capitalize">
                      Status: {member.membershipStatus}
                    </Badge>
                  </CardContent>
                </Card>
              )
            ) : memberId ? (
              <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
                <CardHeader className="text-center">
                  <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl text-red-800">Member Not Found</CardTitle>
                  <CardDescription className="text-red-600">
                    The provided membership ID is invalid
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={() => router.push("/verify")}>
                    Try Another Verification
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {/* Help Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Membership numbers follow the format: SSD-DL-YYYY-NNN</p>
                <p>• You can also scan the QR code on a membership card</p>
                <p>• Contact us if you believe there is an error</p>
                <p>• Email: info@ssddelhi.org</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
