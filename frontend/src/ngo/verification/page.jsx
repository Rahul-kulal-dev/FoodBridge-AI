import React, { useState } from 'react';
import {
  BadgeCheck,
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Building2,
  FileCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';

/**
 * NGO Verification Page (/ngo/verification)
 * Connects directly to MongoDB and uploads files via /api/users/upload-verification.
 */
const NgoVerificationPage = () => {
  const { user, token, fetchProfile } = useAuth();
  const [uploadingKey, setUploadingKey] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);

  const verificationStatus = user?.verificationStatus || 'pending'; // 'pending' | 'approved' | 'rejected'
  const uploadedDocs = user?.verificationDocs || [];

  const handleFileUpload = async (docLabel, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingKey(docLabel);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('docType', docLabel);

    try {
      const res = await fetch(getApiUrl('/api/users/upload-verification'), {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadMessage({ type: 'success', text: `${docLabel} uploaded successfully!` });
        await fetchProfile();
      } else {
        setUploadMessage({ type: 'error', text: data.message || 'Failed to upload document' });
      }
    } catch (err) {
      setUploadMessage({ type: 'error', text: 'Server error uploading file' });
    } finally {
      setUploadingKey(null);
    }
  };

  const docFields = [
    { label: 'NGO Registration Certificate', desc: 'Trust registration or Society Act certificate' },
    { label: 'Government ID of Authorized Signatory', desc: 'Aadhaar, Passport, or PAN of NGO Director' },
    { label: 'Tax Exemption Certificate (80G / 12A)', desc: 'Valid tax exemption certificate issued by Govt' },
    { label: 'Registered Office Address Proof', desc: 'Electricity bill, rent agreement, or property tax receipt' },
  ];

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
              NGO Verification & Compliance
            </h1>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
              verificationStatus === 'approved'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                : verificationStatus === 'rejected'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <BadgeCheck className="w-3.5 h-3.5" />
              {verificationStatus === 'approved' ? 'Verified NGO' : verificationStatus === 'rejected' ? 'Rejected' : 'Under Review'}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Upload organizational credentials saved directly to your MongoDB profile
          </p>
        </div>
      </div>

      {uploadMessage && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between animate-fade-in ${
          uploadMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          <span>{uploadMessage.text}</span>
          <button onClick={() => setUploadMessage(null)} className="font-mono text-sm cursor-pointer">✕</button>
        </div>
      )}

      {/* Verification Status Overview Banner */}
      {verificationStatus === 'approved' && (
        <div className="bg-emerald-50/70 border border-emerald-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 shadow-soft-card">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-emerald-btn">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] flex flex-wrap items-center gap-2">
              Verification Active
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                Green Badge Granted
              </span>
            </h3>
            <p className="text-xs text-[#334155] mt-0.5 font-medium">
              {user?.organizationName || user?.name || 'Your NGO'} is fully verified in MongoDB Atlas. Your account receives real-time priority alerts for surplus food.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'pending' && (
        <div className="bg-amber-50/70 border border-amber-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 shadow-soft-card">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-amber-btn">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Verification Pending Review</h3>
            <p className="text-xs text-[#334155] mt-0.5 font-medium">
              Your uploaded compliance documents are stored in MongoDB and under review by system admins.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'rejected' && (
        <div className="bg-rose-50/70 border border-rose-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 shadow-soft-card">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Verification Rejection</h3>
            <p className="text-xs text-[#334155] mt-0.5 font-medium">
              Reason: {user?.rejectionReason || 'Please re-upload a clear and valid document.'}
            </p>
          </div>
        </div>
      )}

      {/* Document Upload Grid */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] p-4 sm:p-6 shadow-soft-card">
        <div className="mb-5 sm:mb-6">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A]">Mandatory Compliance Documents</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Supported formats: PDF, PNG, JPG (Max file size: 10 MB each)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {docFields.map((field, idx) => {
            const doc = uploadedDocs[idx];
            const isUploading = uploadingKey === field.label;

            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-extrabold text-[#0F172A]">{field.label}</h3>
                    {doc ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">{field.desc}</p>
                </div>

                {doc ? (
                  <div className="p-3 rounded-lg bg-white border border-[#E7EAF0] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">
                          {doc.fileName || `Document_${idx + 1}.pdf`}
                        </p>
                        <p className="text-[10px] text-[#64748B]">
                          {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Uploaded'}
                        </p>
                      </div>
                    </div>

                    <label className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 cursor-pointer border border-emerald-200 transition-colors shrink-0 whitespace-nowrap">
                      {isUploading ? 'Uploading...' : 'Re-upload'}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        disabled={isUploading}
                        onChange={(e) => handleFileUpload(field.label, e)}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-emerald-500 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white text-center">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-emerald-600 mb-1 animate-spin" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-emerald-600 mb-1" />
                    )}
                    <span className="text-xs font-bold text-[#0F172A]">
                      {isUploading ? 'Uploading document...' : 'Click to upload document'}
                    </span>
                    <span className="text-[10px] text-[#64748B]">PDF or Image up to 10MB</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      disabled={isUploading}
                      onChange={(e) => handleFileUpload(field.label, e)}
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NgoVerificationPage;
