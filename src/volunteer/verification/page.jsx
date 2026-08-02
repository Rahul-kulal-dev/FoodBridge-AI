import React, { useState } from 'react';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Building2,
  FileCheck,
  Image as ImageIcon
} from 'lucide-react';
import volunteerData from '../data/volunteerData.json';

/**
 * Pickup Verification Page (/volunteer/verification)
 */
const PickupVerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('Pending'); // 'Pending' | 'Verified' | 'Rejected'
  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setPreviewImage(null);
    setFileName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (previewImage) {
      setVerificationStatus('Verified');
    }
  };

  const activeAssignment = volunteerData.assignments[0];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Pickup Photo Verification
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Upload verification photo of packaged surplus food before departing pickup location
          </p>
        </div>

        {/* Verification Status Selector */}
        <div className="flex items-center gap-2 bg-[#f7f8fb] p-1.5 rounded-xl border border-[#E7EAF0]">
          <button
            onClick={() => setVerificationStatus('Verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              verificationStatus === 'Verified'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => setVerificationStatus('Pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              verificationStatus === 'Pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setVerificationStatus('Rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              verificationStatus === 'Rejected'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Verification Status Overview Banner */}
      {verificationStatus === 'Verified' && (
        <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl flex items-center gap-4 shadow-soft-card">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-emerald-btn">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
              Pickup Photo Verified
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                Compliance Passed
              </span>
            </h3>
            <p className="text-xs text-[#334155] mt-0.5 font-medium">
              Photo verification approved for order {activeAssignment.id}. You may proceed to destination NGO dropoff.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'Pending' && (
        <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl flex items-center gap-4 shadow-soft-card">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-amber-btn">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A]">Awaiting Photo Verification</h3>
            <p className="text-xs text-[#334155] mt-0.5 font-medium">
              Please take or upload a clear photo showing the food container seals and quantity tag.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'Rejected' && (
        <div className="bg-rose-50/70 border border-rose-200 p-5 rounded-2xl flex items-center gap-4 shadow-soft-card">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A]">Photo Quality Retake Required</h3>
            <p className="text-xs text-[#334155] mt-0.5 font-medium">
              The uploaded photo was blurry. Please retake the photo under adequate lighting.
            </p>
          </div>
        </div>
      )}

      {/* Main Split Upload & Summary Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drag & Drop Photo Upload Zone */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#0F172A]">Upload Pickup Verification Photo</h2>
            {previewImage && (
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-600 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>
            )}
          </div>

          {previewImage ? (
            <div className="space-y-4">
              <div className="relative h-72 w-full rounded-xl overflow-hidden border-2 border-emerald-500 bg-slate-900 shadow-md">
                <img src={previewImage} alt="Pickup Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-lg border border-slate-700">
                  {fileName || 'pickup_verification_photo.jpg'}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-emerald-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Verification Photo</span>
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#f7f8fb] space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
                <Camera className="w-7 h-7" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-extrabold text-[#0F172A]">
                  Click or Drag & Drop to upload pickup photo
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Supported formats: JPG, PNG, WEBP up to 10 MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Right Column: Donation & Donor Summary */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
          <h2 className="text-base font-extrabold text-[#0F172A]">Pickup Order Summary</h2>

          <div className="p-4 rounded-xl bg-[#f7f8fb] border border-[#E7EAF0] space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-[#64748B] font-bold uppercase block">Donation ID</span>
              <span className="font-extrabold text-[#0F172A] text-sm">{activeAssignment.id}</span>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] font-bold uppercase block">Food Items</span>
              <span className="font-bold text-[#0F172A]">{activeAssignment.foodName}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E7EAF0]">
              <div>
                <span className="text-[10px] text-[#64748B] font-bold uppercase block">Quantity</span>
                <span className="font-extrabold text-[#0F172A]">{activeAssignment.quantity}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] font-bold uppercase block">Pickup Time</span>
                <span className="font-bold text-amber-600">{activeAssignment.pickupDeadline}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#E7EAF0] space-y-2 text-xs">
            <span className="text-[10px] text-[#64748B] font-bold uppercase block">Donor Information</span>
            <p className="font-extrabold text-[#0F172A]">{activeAssignment.donorName}</p>
            <p className="text-[#64748B]">{activeAssignment.pickupAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupVerificationPage;
