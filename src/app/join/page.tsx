"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield, BookOpen, Users, CheckCircle,
  MapPin, Phone, Mail, Loader2, PartyPopper, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Enter a valid 10-digit phone number").regex(/^[0-9+\s-]+$/, "Numbers only"),
  occupation: z.string().min(2, "Occupation is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().length(6, "PIN code must be 6 digits"),
  volunteeringPath: z.string().optional(),
  reason: z.string().min(20, "Please share at least 20 characters about your motivation"),
  agreement: z.boolean().refine((v) => v === true, "You must accept the Sainik Oath"),
});

type FormData = z.infer<typeof formSchema>;

const PATHS = [
  { id: "outreach", label: "Education & Outreach", icon: BookOpen },
  { id: "protection", label: "Community Protection", icon: Shield },
  { id: "womens", label: "Women's Collective", icon: Users },
  { id: "legal", label: "Legal & Atrocity Response", icon: CheckCircle },
];

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");

  const submitApplication = useMutation(api.users.submitMembershipApplication);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "Delhi",
      state: "Delhi",
      volunteeringPath: "",
      agreement: false,
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      await submitApplication({
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        occupation: values.occupation,
        reason: values.reason,
        volunteeringPath: values.volunteeringPath || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
            <PartyPopper className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Jai Bhim!</h1>
          <p className="text-slate-300 text-lg">
            Your application has been received and saved to SSD Delhi records.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-2">
            <p className="text-white font-semibold text-sm">What happens next</p>
            {[
              "Team reviews your application",
              "You are contacted within 3-5 working days",
              "Orientation at Dr. Ambedkar Bhawan",
              "Membership number issued",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-600/50 text-blue-300 text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => { setSubmitted(false); reset(); setSelectedPath(""); }}
          >
            Submit Another Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003285] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF7F3E]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2A629A]/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-24 relative z-10">

        <div className="text-center mb-16 space-y-6">
          <Badge className="bg-[#FF7F3E]/20 text-[#FFDA78] border-[#FF7F3E]/30 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            Join the Movement
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
            Become a <span className="text-[#FFDA78]">Sainik</span>
          </h1>
          <p className="text-blue-100/70 text-xl font-medium max-w-2xl mx-auto">
            समता सैनिक दल दिल्ली — Soldiers for Equality since 1924. Building a casteless society based on Liberty, Equality, and Fraternity.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-bold text-blue-200/60 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#FF7F3E]" />
              Dr. Ambedkar Bhawan, Delhi
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#FFDA78]" />
              Open to All Citizens
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Left sidebar info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sainik Oath */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-md">
              <h2 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#FF7F3E]" /> The Sainik Oath
              </h2>
              <p className="text-blue-100/80 text-lg leading-relaxed italic font-medium">
                "I pledge to reject caste-based practices and treat every person as an equal human being.
                I commit to stand against oppression, exploitation and slavery in any form."
              </p>
              <div className="h-px w-12 bg-[#FFDA78] my-6" />
              <p className="text-blue-200/40 text-xs font-bold uppercase tracking-widest">Official SSD Constitution</p>
            </div>

            {/* Volunteering Paths */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-md">
              <h2 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Choose Your Path</h2>
              <div className="space-y-3">
                {PATHS.map((path) => {
                  const Icon = path.icon;
                  const isSelected = selectedPath === path.id;
                  return (
                    <button
                      key={path.id}
                      type="button"
                      onClick={() => {
                        const next = isSelected ? "" : path.id;
                        setSelectedPath(next);
                        setSelectedPath(next);
                        setValue("volunteeringPath", next);
                      }}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-left transition-all duration-300 border ${isSelected
                          ? "bg-[#FF7F3E] border-[#FF7F3E] text-white shadow-lg shadow-[#FF7F3E]/20"
                          : "bg-white/[0.03] border-white/5 text-blue-200/60 hover:bg-white/10 hover:border-white/20 hover:text-white"
                        }`}
                    >
                      <div className={`h-8 w-8 flex items-center justify-center rounded-xl transition-colors ${isSelected ? "bg-white/20 text-white" : "bg-white/5 text-blue-200/40"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {path.label}
                      {isSelected && <CheckCircle className="h-4 w-4 ml-auto text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-[#FFDA78]/10 border border-[#FFDA78]/20 rounded-[32px] p-8">
              <h2 className="text-[#FFDA78] font-black text-xs uppercase tracking-[0.2em] mb-4">In-Person Applications</h2>
              <div className="flex items-start gap-4 text-blue-100 text-sm font-medium leading-relaxed">
                <MapPin className="h-5 w-5 text-[#FF7F3E] flex-shrink-0" />
                <span>Dr. Ambedkar Bhawan, Rani Jhansi Road, Delhi during any SSD program.</span>
              </div>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7F3E]/5 rounded-bl-[100px] pointer-events-none" />
              <h2 className="text-2xl font-black text-[#003285] mb-8">Membership Application</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Personal info */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Personal Information</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#2A629A] uppercase tracking-widest mb-2">Full Name *</label>
                      <input
                        {...register("name")}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-5 py-4 text-sm bg-slate-50 border-2 border-slate-50 rounded-2xl text-[#003285] placeholder:text-slate-400 focus:outline-none focus:border-[#FF7F3E]/30 focus:bg-white transition-all font-bold"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-2 font-bold">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Occupation *</label>
                      <input
                        {...register("occupation")}
                        placeholder="e.g. Student, Teacher, Worker"
                        className="w-full px-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      />
                      {errors.occupation && <p className="text-red-400 text-xs mt-1">{errors.occupation.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          {...register("email")}
                          placeholder="your@email.com"
                          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          {...register("phone")}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Address */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Address</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Street Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          {...register("address")}
                          placeholder="House no., Street, Colony, Area"
                          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                      </div>
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm text-slate-300 mb-1.5 font-medium">City *</label>
                        <input
                          {...register("city")}
                          placeholder="Delhi"
                          className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                        {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1.5 font-medium">State *</label>
                        <input
                          {...register("state")}
                          placeholder="Delhi"
                          className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                        {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1.5 font-medium">PIN Code *</label>
                        <input
                          {...register("pincode")}
                          placeholder="110001"
                          maxLength={6}
                          className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                        {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Motivation */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Your Commitment</p>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                      Why do you want to join SSD Delhi? *
                    </label>
                    <textarea
                      {...register("reason")}
                      rows={4}
                      placeholder="Share what brought you to the movement and how you hope to contribute..."
                      className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                    />
                    {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason.message}</p>}
                  </div>
                </div>

                {/* Oath Agreement */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("agreement")}
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-white/20 bg-white/5 accent-blue-500"
                    />
                    <span className="text-sm text-slate-300 leading-relaxed">
                      I have read the Sainik Oath and commit to uphold the principles of Samta Sainik Dal:
                      equality, discipline, non-violence and service to humanity.
                    </span>
                  </label>
                  {errors.agreement && <p className="text-red-400 text-xs mt-2 ml-7">{errors.agreement.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#FF7F3E] hover:bg-[#ff6a1a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl shadow-[#FF7F3E]/20 hover:shadow-[#FF7F3E]/40 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Processing Application...</>
                  ) : (
                    <>Submit Application <ArrowRight className="h-5 w-5" /></>
                  )}
                </button>

                <p className="text-center text-xs text-slate-600">
                  Your data is stored securely and only used for SSD Delhi membership processing.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ strip */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            { q: "Who can join?", a: "Anyone who believes in the Constitution of India and Ambedkarite principles. Youth, women, students and workers are especially encouraged." },
            { q: "Is SSD a political party?", a: "No. SSD is a social volunteer organization for equality, though it has historically worked alongside Ambedkar political fronts." },
            { q: "What training will I get?", a: "Ideological education, public speaking, first-aid and non-violent crowd management for protecting peaceful gatherings." },
          ].map((faq) => (
            <div key={faq.q} className="bg-white/[0.02] border border-white/8 rounded-xl p-5">
              <h3 className="text-white text-sm font-semibold mb-2">{faq.q}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}