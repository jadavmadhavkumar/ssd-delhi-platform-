"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Shield, Calendar, MapPin, CheckCircle, Loader2, Upload, FileText, Image as ImageIcon } from "lucide-react";

export default function AmbedkarJayantiRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const photoInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  const registerMutation = useMutation(api.ambedkarJayanti.registerForAmbedkarJayanti);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "",
    mobileNumber: "",
    email: "",
    
    // Address
    address: "",
    village: "",
    tehsil: "",
    district: "",
    state: "",
    pincode: "",
    
    // SSD Details
    isSsdMember: "No",
    rank: "",
    
    // Documents
    aadhaarNumber: "",
    aadhaarFile: null as File | null,
    photoFile: null as File | null,
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
      if (!formData.fatherName.trim()) newErrors.fatherName = "Father's Name is required";
      if (!formData.motherName.trim()) newErrors.motherName = "Mother's Name is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = "Mobile Number is required";
      } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = "Enter valid 10-digit mobile number";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Enter valid email";
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.village.trim()) newErrors.village = "Village/Locality is required";
      if (!formData.district.trim()) newErrors.district = "District is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.pincode.trim()) {
        newErrors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = "Enter valid 6-digit pincode";
      }
    }

    if (step === 3) {
      if (!formData.aadhaarNumber.trim()) {
        newErrors.aadhaarNumber = "Aadhaar Number is required";
      } else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
        newErrors.aadhaarNumber = "Enter valid 12-digit Aadhaar";
      }
      if (!formData.photoFile) newErrors.photoFile = "Passport photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (field: string, file: File | null, maxSize: number, accept: string) => {
    if (file) {
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [field]: `File must be under ${maxSize / 1024}KB` }));
        return;
      }
    }
    updateField(field, file);
  };

  const uploadFile = async (file: File): Promise<string | undefined> => {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) {
        console.error("Upload failed:", result.statusText);
        return undefined;
      }
      const { storageId } = await result.json();
      return storageId;
    } catch (err) {
      console.error("File upload error:", err);
      return undefined;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    
    try {
      // Upload files
      let photoFileId: string | undefined;
      let aadhaarFileId: string | undefined;

      if (formData.photoFile) {
        photoFileId = await uploadFile(formData.photoFile);
      }
      if (formData.aadhaarFile) {
        aadhaarFileId = await uploadFile(formData.aadhaarFile);
      }

      // Get state code
      const stateCode = getStateCode(formData.state);

      // Submit to Convex
      const result = await registerMutation({
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as any,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        address: formData.address,
        village: formData.village,
        tehsil: formData.tehsil || undefined,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        isSsdMember: formData.isSsdMember === "Yes",
        rank: formData.rank || undefined,
        aadhaarCardNumber: formData.aadhaarNumber,
        aadhaarFileId: aadhaarFileId as any,
        passportPhotoFileId: photoFileId as any,
        stateCode: stateCode,
      });

      // Store SSD ID
      localStorage.setItem('ssdId', result.ssdId);
      localStorage.setItem('registrantName', formData.fullName);
      
      setSubmitted(true);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStateCode = (stateName: string): string => {
    const stateCodes: Record<string, string> = {
      "Delhi": "DL",
      "Maharashtra": "MH",
      "Uttar Pradesh": "UP",
      "Punjab": "PB",
      "Haryana": "HR",
      "Rajasthan": "RJ",
      "Madhya Pradesh": "MP",
      "Gujarat": "GJ",
      "Karnataka": "KA",
      "Tamil Nadu": "TN",
      "Kerala": "KL",
      "West Bengal": "WB",
      "Bihar": "BR",
      "Jharkhand": "JH",
      "Odisha": "OR",
      "Other": "OT",
    };
    return stateCodes[stateName] || "DL";
  };

  if (submitted) {
    const ssdId = localStorage.getItem('ssdId') || 'SSD-DL-2026-000001';
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003285] via-[#002561] to-[#001a3d] py-8 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Confirmed!</h1>
          <p className="text-gray-600 mb-6">Jai Bhim! Jai Samta!</p>
          
          <div className="bg-gradient-to-r from-[#FFDA78] to-[#FFE09A] rounded-2xl p-6 mb-6 border-4 border-[#FF7F3E]">
            <p className="text-sm font-bold text-[#003285] uppercase tracking-widest mb-2">Your SSD Member ID</p>
            <p className="text-3xl font-black text-[#003285]">{ssdId}</p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-[#003285] mb-2">Registered Details:</p>
            <p className="text-sm text-gray-700"><strong>Name:</strong> {formData.fullName}</p>
            <p className="text-sm text-gray-700"><strong>Father:</strong> {formData.fatherName}</p>
            <p className="text-sm text-gray-700"><strong>Mother:</strong> {formData.motherName}</p>
            <p className="text-sm text-gray-700"><strong>Mobile:</strong> {formData.mobileNumber}</p>
            <p className="text-sm text-gray-700"><strong>State:</strong> {formData.state}</p>
            {formData.rank && <p className="text-sm text-gray-700"><strong>Rank:</strong> {formData.rank}</p>}
          </div>
          
          <p className="text-gray-600 text-sm mb-6">
            We&apos;ll send event details to <strong>{formData.email}</strong> soon.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#FF7F3E] hover:bg-[#ff6a1a] text-white font-bold py-3 rounded-full transition-colors"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Personal Details", icon: "👤" },
    { num: 2, title: "Address", icon: "📍" },
    { num: 3, title: "Documents", icon: "📄" },
  ];

  const indianStates = [
    "Delhi", "Maharashtra", "Uttar Pradesh", "Punjab", "Haryana",
    "Rajasthan", "Madhya Pradesh", "Gujarat", "Karnataka", "Tamil Nadu",
    "Kerala", "West Bengal", "Bihar", "Jharkhand", "Odisha", "Other"
  ];

  const ssdRanks = [
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003285] via-[#002561] to-[#001a3d] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-[#FFDA78]" />
            <span className="bg-[#FF7F3E] text-white px-4 py-2 rounded-full text-sm font-bold">
              14 April 2026 • Delhi
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Ambedkar Jayanti 2026
          </h1>
          <p className="text-blue-200 text-sm">Registration Form</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= step.num 
                    ? "bg-[#FF7F3E] text-white" 
                    : "bg-white/20 text-white/60"
                }`}>
                  {currentStep > step.num ? "✓" : step.icon}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-8 md:w-12 h-1 ${currentStep > step.num + 1 ? "bg-[#FF7F3E]" : "bg-white/20"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {steps[currentStep - 1].title}
          </h3>

          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] focus:border-transparent outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => updateField("fatherName", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none ${errors.fatherName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Father's name"
                  />
                  {errors.fatherName && <p className="text-xs text-red-500 mt-1">{errors.fatherName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mother&apos;s Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => updateField("motherName", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none ${errors.motherName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Mother's name"
                />
                {errors.motherName && <p className="text-xs text-red-500 mt-1">{errors.motherName}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none bg-white ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => updateField("mobileNumber", e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="10-digit mobile"
                    maxLength={10}
                  />
                  {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House/Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="House no., Street, Locality"
                  rows={3}
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Village/Locality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => updateField("village", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none ${errors.village ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Village or locality"
                  />
                  {errors.village && <p className="text-xs text-red-500 mt-1">{errors.village}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tehsil/Taluka
                  </label>
                  <input
                    type="text"
                    value={formData.tehsil}
                    onChange={(e) => updateField("tehsil", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003285] outline-none"
                    placeholder="Tehsil name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="District name"
                  />
                  {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none bg-white ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select state</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSD Membership
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isSsdMember"
                      value="Yes"
                      checked={formData.isSsdMember === "Yes"}
                      onChange={(e) => updateField("isSsdMember", e.target.value)}
                      className="w-4 h-4 text-[#FF7F3E]"
                    />
                    <span className="text-sm text-gray-700">Yes, I&apos;m a member</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isSsdMember"
                      value="No"
                      checked={formData.isSsdMember === "No"}
                      onChange={(e) => updateField("isSsdMember", e.target.value)}
                      className="w-4 h-4 text-[#FF7F3E]"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {formData.isSsdMember === "Yes" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Rank in SSD
                  </label>
                  <select
                    value={formData.rank}
                    onChange={(e) => updateField("rank", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003285] outline-none bg-white"
                  >
                    <option value="">Select your rank</option>
                    {ssdRanks.map(rank => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select your current rank in SSD</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={(e) => updateField("aadhaarNumber", e.target.value.replace(/\D/g, '').slice(0, 12))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#003285] outline-none ${errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                />
                {errors.aadhaarNumber && <p className="text-xs text-red-500 mt-1">{errors.aadhaarNumber}</p>}
                <p className="text-xs text-gray-500 mt-1">Used only for ID verification</p>
              </div>

              {/* Passport Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Size Photo <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-[#FF7F3E] transition-colors"
                >
                  {formData.photoFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <ImageIcon className="w-6 h-6" />
                      <span className="font-medium">{formData.photoFile.name}</span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-medium">Click to upload photo</p>
                      <p className="text-xs">JPG, PNG (max 500KB)</p>
                    </div>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("photoFile", e.target.files?.[0] || null, 500 * 1024, "image/*")}
                    className="hidden"
                  />
                </div>
                {errors.photoFile && <p className="text-xs text-red-500 mt-1">{errors.photoFile}</p>}
              </div>

              {/* Aadhaar File (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Card (Optional)
                </label>
                <div
                  onClick={() => aadhaarInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-[#FF7F3E] transition-colors"
                >
                  {formData.aadhaarFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FileText className="w-6 h-6" />
                      <span className="font-medium">{formData.aadhaarFile.name}</span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-medium">Click to upload Aadhaar card</p>
                      <p className="text-xs">PDF, JPG, PNG (max 1MB)</p>
                    </div>
                  )}
                  <input
                    ref={aadhaarInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("aadhaarFile", e.target.files?.[0] || null, 1024 * 1024, ".pdf,image/*")}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Declaration:</strong> I hereby declare that all the information provided above is true and correct to the best of my knowledge.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 mt-6 border-t">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-[#003285] text-white font-bold rounded-full hover:bg-[#002561] transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#FF7F3E] hover:bg-[#ff6a1a] disabled:bg-gray-400 text-white font-bold rounded-full transition-colors flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {isSubmitting ? 'Submitting to Convex...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-blue-200/80 text-sm">
          <div className="flex items-center justify-center gap-4 flex-wrap mb-2">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> 14 April 2026
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Delhi
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> SSD Est. 1927
            </span>
          </div>
          <p className="text-xs text-blue-300/60">
            Your data is secure • Stored in Convex backend
          </p>
        </div>
      </div>
    </div>
  );
}
