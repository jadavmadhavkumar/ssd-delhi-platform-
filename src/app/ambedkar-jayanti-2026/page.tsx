"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  email: string;
  ssdRank: string;
  arrivingDate: string;
  aadhaarCardNumber: string;
  aadhaarFile: File | null;
  fullAddress: string;
  pincode: string;
  panCardNumber: string;
  panFile: File | null;
  voterIdNumber: string;
  voterIdFile: File | null;
  isSsdMember: string;
  ssdMembershipId: string;
  hearAboutEvent: string;
  roleInEvent: string;
  specialSkills: string;
  dietaryPreferences: string;
  accessibilityNeeds: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  consentGiven: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const SSD_RANKS = [
  "Sainik (Soldier)",
  "Up-Sainik (Senior Soldier)",
  "Dav-Prahari (Guard)",
  "Mah-Insaaf (Great Justice)",
  "Senaapati (Commander)",
  "Utthan-Sevak (Liberation Server)",
  "Sangathan Mantri (Organizing Secretary)",
  "Prabhari (In-Charge)",
  "President",
  "Vice President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Other",
  "Not a Member"
];

export default function AmbedkarJayantiRegistration() {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentSection, setCurrentSection] = useState(1);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "",
    mobileNumber: "",
    email: "",
    ssdRank: "",
    arrivingDate: "",
    aadhaarCardNumber: "",
    aadhaarFile: null,
    fullAddress: "",
    pincode: "",
    panCardNumber: "",
    panFile: null,
    voterIdNumber: "",
    voterIdFile: null,
    isSsdMember: "",
    ssdMembershipId: "",
    hearAboutEvent: "",
    roleInEvent: "",
    specialSkills: "",
    dietaryPreferences: "",
    accessibilityNeeds: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    consentGiven: false,
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateSection = (section: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (section === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile Number is required";
      else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Enter valid 10-digit mobile number";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter valid email";
      if (!formData.aadhaarCardNumber.trim()) newErrors.aadhaarCardNumber = "Aadhaar Number is required";
      else if (!/^\d{12}$/.test(formData.aadhaarCardNumber)) newErrors.aadhaarCardNumber = "Enter valid 12-digit Aadhaar";
      if (!formData.aadhaarFile) newErrors.aadhaarFile = "Aadhaar File upload is required";
    }
    
    if (section === 2) {
      if (!formData.fullAddress.trim()) newErrors.fullAddress = "Address is required";
      if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";
    }
    
    if (section === 3) {
      if (!formData.isSsdMember) newErrors.isSsdMember = "Please select";
      if (formData.isSsdMember === "Yes" && !formData.ssdMembershipId.trim()) {
        newErrors.ssdMembershipId = "Membership ID is required";
      }
      if (!formData.hearAboutEvent) newErrors.hearAboutEvent = "Please select an option";
      if (!formData.roleInEvent) newErrors.roleInEvent = "Please select a role";
      if (!formData.specialSkills.trim()) newErrors.specialSkills = "Please specify your skills/interests";
      if (!formData.dietaryPreferences) newErrors.dietaryPreferences = "Please select dietary preference";
    }
    
    if (section === 4) {
      if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = "Emergency contact name is required";
      if (!formData.emergencyContactNumber.trim()) newErrors.emergencyContactNumber = "Emergency contact number is required";
      else if (!/^\d{10}$/.test(formData.emergencyContactNumber)) newErrors.emergencyContactNumber = "Enter valid 10-digit number";
      if (!formData.consentGiven) newErrors.consentGiven = "You must agree to the terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentSection((prev) => prev - 1);
  };

  const handleFileChange = (field: "aadhaarFile" | "panFile" | "voterIdFile", file: File | null) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [field]: "File must be under 2MB" }));
        return;
      }
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, [field]: "Only PDF, JPG, PNG allowed" }));
        return;
      }
    }
    updateField(field, file);
  };

  const handleSubmit = async () => {
    if (!validateSection(4)) return;
    
    setIsSubmitting(true);
    
    try {
      // Demo mode: In production, this would call the convex mutation
      // await registerAction({...formData});
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push("/ambedkar-jayanti-2026/thank-you");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003285] via-[#002561] to-[#001a3d] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-[#FF7F3E] text-white mb-4 px-4 py-1 text-sm font-bold">
            14 April 2026 • Delhi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Samata Sainik Dal
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#FFDA78] mb-4">
            Ambedkar Jayanti 2026 Registration
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto text-sm md:text-base">
            Join us in celebrating Dr. B.R. Ambedkar&apos;s birth anniversary. 
            Founded in 1927, SSD continues the fight for equality and social justice.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((section) => (
              <div
                key={section}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentSection >= section
                    ? "bg-[#FF7F3E] text-white"
                    : "bg-white/20 text-white/60"
                }`}
              >
                {currentSection > section ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  section
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="rounded-3xl shadow-2xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-[#003285] flex items-center gap-2">
              {currentSection === 1 && "👤 Personal Details"}
              {currentSection === 2 && "📍 Address & ID Proof"}
              {currentSection === 3 && "🎪 SSD & Event Info"}
              {currentSection === 4 && "🆘 Emergency & Consent"}
            </CardTitle>
            <CardDescription>
              {currentSection === 1 && "Tell us about yourself"}
              {currentSection === 2 && "Your location and identification"}
              {currentSection === 3 && "Your connection with SSD"}
              {currentSection === 4 && "Emergency contact and permissions"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Section 1: Personal Details */}
            {currentSection === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father&apos;s Name</Label>
                    <Input
                      id="fatherName"
                      placeholder="Enter father's name"
                      value={formData.fatherName}
                      onChange={(e) => updateField("fatherName", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField("dateOfBirth", e.target.value)}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => updateField("gender", value)}
                    >
                      <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-xs text-red-500">{errors.gender}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      placeholder="10-digit Indian mobile"
                      maxLength={10}
                      value={formData.mobileNumber}
                      onChange={(e) => updateField("mobileNumber", e.target.value.replace(/\D/g, ""))}
                      className={errors.mobileNumber ? "border-red-500" : ""}
                    />
                    {errors.mobileNumber && (
                      <p className="text-xs text-red-500">{errors.mobileNumber}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ssdRank">Rank in SSD</Label>
                    <Select
                      value={formData.ssdRank}
                      onValueChange={(value) => updateField("ssdRank", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your rank" />
                      </SelectTrigger>
                      <SelectContent>
                        {SSD_RANKS.map((rank) => (
                          <SelectItem key={rank} value={rank}>
                            {rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="arrivingDate">Arriving Date at Ambedkar Bhawan</Label>
                    <Input
                      id="arrivingDate"
                      type="date"
                      value={formData.arrivingDate}
                      onChange={(e) => updateField("arrivingDate", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aadhaarCardNumber">
                    Aadhaar Card Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="aadhaarCardNumber"
                    type="password"
                    placeholder="12-digit Aadhaar"
                    maxLength={12}
                    value={formData.aadhaarCardNumber}
                    onChange={(e) => updateField("aadhaarCardNumber", e.target.value.replace(/\D/g, ""))}
                    className={errors.aadhaarCardNumber ? "border-red-500" : ""}
                  />
                  {errors.aadhaarCardNumber && (
                    <p className="text-xs text-red-500">{errors.aadhaarCardNumber}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>
                    Aadhaar File Upload <span className="text-red-500">*</span> (PDF/JPG under 2MB)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#003285] transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("aadhaarFile", e.target.files?.[0] || null)}
                      className="hidden"
                      id="aadhaar-upload"
                    />
                    <label htmlFor="aadhaar-upload" className="cursor-pointer">
                      {formData.aadhaarFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">{formData.aadhaarFile.name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <p className="font-medium">Click to upload Aadhaar</p>
                          <p className="text-xs">PDF, JPG, or PNG (max 2MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.aadhaarFile && (
                    <p className="text-xs text-red-500">{errors.aadhaarFile}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Section 2: Address & ID Proof */}
            {currentSection === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullAddress">
                    Full Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullAddress"
                    placeholder="Street, Locality, Delhi area"
                    value={formData.fullAddress}
                    onChange={(e) => updateField("fullAddress", e.target.value)}
                    className={errors.fullAddress ? "border-red-500" : ""}
                  />
                  {errors.fullAddress && (
                    <p className="text-xs text-red-500">{errors.fullAddress}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">
                    Pincode <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pincode"
                    placeholder="6-digit Delhi pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
                    className={errors.pincode ? "border-red-500" : ""}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-red-500">{errors.pincode}</p>
                  )}
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <p className="text-sm font-medium text-gray-600 mb-4">Optional ID Proofs</p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="panCardNumber">PAN Card Number</Label>
                      <Input
                        id="panCardNumber"
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        value={formData.panCardNumber}
                        onChange={(e) => updateField("panCardNumber", e.target.value.toUpperCase())}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>PAN File Upload (under 2MB)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-[#003285] transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("panFile", e.target.files?.[0] || null)}
                          className="hidden"
                          id="pan-upload"
                        />
                        <label htmlFor="pan-upload" className="cursor-pointer text-sm">
                          {formData.panFile ? (
                            <span className="text-green-600 font-medium">{formData.panFile.name}</span>
                          ) : (
                            <span className="text-gray-500">Click to upload</span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="voterIdNumber">Voter ID Number</Label>
                      <Input
                        id="voterIdNumber"
                        placeholder="ABC1234567"
                        maxLength={10}
                        value={formData.voterIdNumber}
                        onChange={(e) => updateField("voterIdNumber", e.target.value.toUpperCase())}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Voter ID File Upload (under 2MB)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-[#003285] transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("voterIdFile", e.target.files?.[0] || null)}
                          className="hidden"
                          id="voter-upload"
                        />
                        <label htmlFor="voter-upload" className="cursor-pointer text-sm">
                          {formData.voterIdFile ? (
                            <span className="text-green-600 font-medium">{formData.voterIdFile.name}</span>
                          ) : (
                            <span className="text-gray-500">Click to upload</span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Section 3: SSD & Event Info */}
            {currentSection === 3 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      Are you a Samata Sainik Dal member? <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.isSsdMember}
                      onValueChange={(value) => updateField("isSsdMember", value)}
                    >
                      <SelectTrigger className={errors.isSsdMember ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.isSsdMember && (
                      <p className="text-xs text-red-500">{errors.isSsdMember}</p>
                    )}
                  </div>
                  
                  {formData.isSsdMember === "Yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="ssdMembershipId">
                        Membership ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="ssdMembershipId"
                        placeholder="Your SSD Member ID"
                        value={formData.ssdMembershipId}
                        onChange={(e) => updateField("ssdMembershipId", e.target.value)}
                        className={errors.ssdMembershipId ? "border-red-500" : ""}
                      />
                      {errors.ssdMembershipId && (
                        <p className="text-xs text-red-500">{errors.ssdMembershipId}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      How did you hear about this event? <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.hearAboutEvent}
                      onValueChange={(value) => updateField("hearAboutEvent", value)}
                    >
                      <SelectTrigger className={errors.hearAboutEvent ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SSD Chapter">SSD Chapter</SelectItem>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Friends">Friends</SelectItem>
                        <SelectItem value="Poster">Poster</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.hearAboutEvent && (
                      <p className="text-xs text-red-500">{errors.hearAboutEvent}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      Role in event <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.roleInEvent}
                      onValueChange={(value) => updateField("roleInEvent", value)}
                    >
                      <SelectTrigger className={errors.roleInEvent ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Volunteer">Volunteer</SelectItem>
                        <SelectItem value="Participant">Participant</SelectItem>
                        <SelectItem value="Speaker">Speaker</SelectItem>
                        <SelectItem value="Performer">Performer</SelectItem>
                        <SelectItem value="Sponsor">Sponsor</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.roleInEvent && (
                      <p className="text-xs text-red-500">{errors.roleInEvent}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialSkills">
                    Special skills/Interests <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="specialSkills"
                    placeholder="e.g., Marching, Speech, Cultural Program"
                    value={formData.specialSkills}
                    onChange={(e) => updateField("specialSkills", e.target.value)}
                    className={errors.specialSkills ? "border-red-500" : ""}
                  />
                  {errors.specialSkills && (
                    <p className="text-xs text-red-500">{errors.specialSkills}</p>
                  )}
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      Dietary preferences <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.dietaryPreferences}
                      onValueChange={(value) => updateField("dietaryPreferences", value)}
                    >
                      <SelectTrigger className={errors.dietaryPreferences ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="Non-veg">Non-veg</SelectItem>
                        <SelectItem value="Jain">Jain</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.dietaryPreferences && (
                      <p className="text-xs text-red-500">{errors.dietaryPreferences}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accessibilityNeeds">Accessibility needs (Optional)</Label>
                    <Input
                      id="accessibilityNeeds"
                      placeholder="e.g., Wheelchair access"
                      value={formData.accessibilityNeeds}
                      onChange={(e) => updateField("accessibilityNeeds", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Section 4: Emergency & Consent */}
            {currentSection === 4 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">
                      Emergency Contact Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="emergencyContactName"
                      placeholder="Contact person name"
                      value={formData.emergencyContactName}
                      onChange={(e) => updateField("emergencyContactName", e.target.value)}
                      className={errors.emergencyContactName ? "border-red-500" : ""}
                    />
                    {errors.emergencyContactName && (
                      <p className="text-xs text-red-500">{errors.emergencyContactName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactNumber">
                      Emergency Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="emergencyContactNumber"
                      type="tel"
                      placeholder="10-digit mobile"
                      maxLength={10}
                      value={formData.emergencyContactNumber}
                      onChange={(e) => updateField("emergencyContactNumber", e.target.value.replace(/\D/g, ""))}
                      className={errors.emergencyContactNumber ? "border-red-500" : ""}
                    />
                    {errors.emergencyContactNumber && (
                      <p className="text-xs text-red-500">{errors.emergencyContactNumber}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={formData.consentGiven}
                      onChange={(e) => updateField("consentGiven", e.target.checked)}
                      className={`w-4 h-4 mt-1 rounded border-gray-300 text-[#003285] focus:ring-[#003285] ${errors.consentGiven ? "border-red-500" : ""}`}
                    />
                    <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                      <span className="text-red-500">*</span> I agree to Samata Sainik Dal terms, 
                      photo/video release for event promotion, and data privacy. 
                      I understand data will be used only for event verification/participation 
                      per Indian data laws. Aadhaar is for ID proof only.
                    </Label>
                  </div>
                  {errors.consentGiven && (
                    <p className="text-xs text-red-500 ml-6">{errors.consentGiven}</p>
                  )}
                </div>
                
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Privacy Notice:</strong> Your data will be used only for event 
                      verification and participation purposes as per Indian data protection laws. 
                      Aadhaar details are collected solely for identity verification.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {currentSection > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="rounded-full px-6"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}
              
              {currentSection < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#003285] hover:bg-[#002561] rounded-full px-8"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#FF7F3E] hover:bg-[#ff6a1a] rounded-full px-8 font-bold"
                >
                  {isSubmitting ? "Registering..." : "Register Now"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Footer Info */}
        <div className="mt-8 text-center text-blue-200 text-sm">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <MapPin className="w-4 h-4" /> Ambedkar Bhawan, Delhi
            <span className="mx-2">•</span>
            <Calendar className="w-4 h-4" /> 14 April 2026
          </p>
        </div>
      </div>
    </div>
  );
}
