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
  FileCheck
} from 'lucide-react';

/**
 * NGO Verification Page (/ngo/verification)
 */
const NgoVerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('Approved'); // 'Pending' | 'Approved' | 'Rejected'
  const [documents, setDocuments] = useState({
    registrationCert: { name: 'NGO_Registration_Trust_Act_2024.pdf', status: 'Uploaded', size: '2.4 MB' },
    governmentId: { name: 'Founder_Govt_Aadhaar_ID.pdf', status: 'Uploaded', size: '1.1 MB' },
    taxCertificate: { name: '80G_12A_Tax_Exemption_Cert.pdf', status: 'Uploaded', size: '3.8 MB' },
    addressProof: { name: 'Premises_Lease_Utility_Bill.pdf', status: 'Uploaded', size: '1.9 MB' },
  });

  const handleFileUpload = (docKey, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [docKey]: {
          name: file.name,
          status: 'Uploaded',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        },
      }));
    }
  };

  const docFields = [
    { key: 'registrationCert', label: 'NGO Registration Certificate', desc: 'Trust registration or Society Act certificate' },
    { key: 'governmentId', label: 'Government ID of Authorized Signatory', desc: 'Aadhaar, Passport, or PAN of NGO Director' },
    { key: 'taxCertificate', label: 'Tax Certificate (80G / 12A)', desc: 'Valid tax exemption certificate issued by Govt' },
    { key: 'addressProof', label: 'Registered Office Address Proof', desc: 'Electricity bill, rent agreement, or property tax receipt' },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
              NGO Verification & Compliance
            </h1>
            {verificationStatus === 'Approved' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified NGO
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Upload verified organizational credentials to receive priority surplus matching
          </p>
        </div>

        {/* Verification Badges Selector */}
        <div className="flex items-center gap-2 bg-[#f7f8fb] p-1.5 rounded-xl border border-[#E7EAF0]">
          <button
            onClick={() => setVerificationStatus('Approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              verificationStatus === 'Approved'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Approved Badge
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
      {verificationStatus === 'Approved' && (
        <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl flex items-center gap-4 shadow-soft-card">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-emerald-btn">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
              Verification Tier 1 Active
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                Green Badge Granted
              </span>
            </h3>
            <p className="text-xs text-[#334155] mt-0.5 font-medium">
              Hope Community Kitchen is fully verified. Your NGO receives real-time priority alerts for surplus food within 10 km.
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
            <h3 className="text-sm font-extrabold text-[#0F172A]">Verification Under Review</h3>
            <p className="text-xs text-[#334155] mt-0.5 font-medium">
              Our compliance team is auditing your uploaded documents. Approval usually completes within 2-4 business hours.
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
            <h3 className="text-sm font-extrabold text-[#0F172A]">Document Verification Action Needed</h3>
            <p className="text-xs text-[#334155] mt-0.5 font-medium">
              Your registered office address proof was expired. Please upload a recent utility bill (less than 3 months old).
            </p>
          </div>
        </div>
      )}

      {/* Document Upload Grid */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] p-6 shadow-soft-card">
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-[#0F172A]">Mandatory Compliance Documents</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Supported formats: PDF, PNG, JPG (Max file size: 10 MB each)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {docFields.map((field) => {
            const doc = documents[field.key];
            return (
              <div
                key={field.key}
                className="p-4 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-[#0F172A]">{field.label}</h3>
                    {doc ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">{field.desc}</p>
                </div>

                {doc ? (
                  <div className="p-3 rounded-lg bg-white border border-[#E7EAF0] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">{doc.name}</p>
                        <p className="text-[10px] text-[#64748B]">{doc.size}</p>
                      </div>
                    </div>

                    <label className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 cursor-pointer border border-emerald-200 transition-colors">
                      Re-upload
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(field.key, e)}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-emerald-500 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
                    <UploadCloud className="w-6 h-6 text-emerald-600 mb-1" />
                    <span className="text-xs font-bold text-[#0F172A]">Click to upload document</span>
                    <span className="text-[10px] text-[#64748B]">PDF or Image up to 10MB</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(field.key, e)}
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-[#E7EAF0] flex items-center justify-between">
          <p className="text-xs text-[#64748B] font-medium">
            All submitted files are encrypted and processed in compliance with FSSAI regulations.
          </p>
          <button
            onClick={() => setVerificationStatus('Pending')}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer"
          >
            Submit Credentials for Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default NgoVerificationPage;
