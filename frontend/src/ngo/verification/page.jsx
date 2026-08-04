import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UploadCloud,
  FileCheck,
  Loader2,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Lock,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';

/**
 * NGO Verification Page (/ngo/verification)
 * Formatted to match Donor Verification UI styling:
 * 1. Uploads 4 mandatory compliance documents to Cloudinary & MongoDB.
 * 2. Status starts as Pending Review.
 * 3. On Admin Approve: Approved & Verified NGO.
 * 4. On Admin Reject: Displays rejection reason, enables selective re-upload of rejected/missing docs.
 */
const NgoVerificationPage = () => {
  const { user, token, fetchProfile } = useAuth();
  const [uploadingKey, setUploadingKey] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);

  const verificationStatus = user?.verificationStatus || 'pending';
  const uploadedDocs = user?.verificationDocs || [];
  const rejectionReason = user?.rejectionReason || '';

  const isApproved = verificationStatus === 'approved';
  const isRejected = verificationStatus === 'rejected';
  const isPending = !isApproved && !isRejected;

  const docFields = [
    { key: 'reg_cert', label: 'NGO Registration Certificate', desc: 'Trust registration or Society Act certificate' },
    { key: 'signatory_id', label: 'Government ID of Authorized Signatory', desc: 'Aadhaar, Passport, or PAN of NGO Director' },
    { key: 'tax_cert', label: 'Tax Exemption Certificate (80G / 12A)', desc: 'Valid tax exemption certificate issued by Govt' },
    { key: 'address_proof', label: 'Registered Office Address Proof', desc: 'Electricity bill, rent agreement, or property tax receipt' },
  ];

  const getUploadedDocForField = (field, idx) => {
    if (!uploadedDocs || uploadedDocs.length === 0) return null;
    const match = uploadedDocs.find(
      (d) => d.docType && d.docType.toLowerCase() === field.label.toLowerCase()
    );
    return match || uploadedDocs[idx] || null;
  };

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
        setUploadMessage({
          type: 'success',
          text: `${docLabel} uploaded to Cloudinary & saved to MongoDB! Status reset to Pending Review.`,
        });
        await fetchProfile();
      } else {
        setUploadMessage({ type: 'error', text: data.message || 'Failed to upload document' });
      }
    } catch (err) {
      setUploadMessage({ type: 'error', text: 'Server error uploading file to Cloudinary' });
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Page Header - Matching Donor Verification Style */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              NGO Verification
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">
              Upload mandatory compliance documents saved to Cloudinary & MongoDB
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${
            isApproved
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : isRejected
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isApproved && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {isRejected && <XCircle className="w-4 h-4 text-rose-600" />}
          {isPending && <Clock className="w-4 h-4 text-amber-600" />}
          <span>{isApproved ? 'Verified NGO' : isRejected ? 'Rejected' : 'Pending Review'}</span>
        </span>
      </div>

      {/* Rejection Alert Box - Matching Donor Verification Style */}
      {isRejected && (
        <div className="bg-rose-50 border-2 border-rose-200 p-5 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Verification Rejected by Admin</span>
          </div>
          <p className="text-xs text-rose-800 font-medium leading-relaxed">
            <strong>Reason for Rejection:</strong> {rejectionReason || 'Document incomplete or illegible. Please re-upload clear mandatory document.'}
          </p>
          <p className="text-xs text-rose-600 font-bold pt-1">
            Please re-upload rejected or missing documents below. Re-uploading will automatically set your status to Pending Review.
          </p>
        </div>
      )}

      {/* Upload Success Message Toast */}
      {uploadMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between animate-fade-in ${
            uploadMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{uploadMessage.text}</span>
          </div>
          <button onClick={() => setUploadMessage(null)} className="font-mono text-sm cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Verification Status Banner Card - Matching Donor Verification Style */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest block">
            VERIFICATION STATUS
          </span>

          <div className="flex items-center gap-3">
            {isApproved && (
              <>
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                  Approved & Verified NGO
                </h2>
              </>
            )}

            {isRejected && (
              <>
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                  Verification Rejected
                </h2>
              </>
            )}

            {isPending && (
              <>
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
                  Pending Admin Review
                </h2>
              </>
            )}
          </div>
        </div>

        {/* Decorative Watermark Icon */}
        <div className="hidden sm:flex items-center justify-center w-24 h-24 opacity-10 text-emerald-600 pointer-events-none">
          <ShieldCheck className="w-20 h-20" />
        </div>
      </div>

      {/* Mandatory Document Upload Grid */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E7EAF0] shadow-soft-card space-y-5">
        <div className="flex items-center justify-between border-b border-[#E7EAF0] pb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight">
              Mandatory Compliance Documents
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Supported formats: PDF, PNG, JPG (Max 10MB). Uploaded docs stored in Cloudinary.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {uploadedDocs.length} / {docFields.length} Uploaded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {docFields.map((field, idx) => {
            const doc = getUploadedDocForField(field, idx);
            const isUploading = uploadingKey === field.label;
            const allowReupload = !isApproved || isRejected || !doc;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3.5 ${
                  doc
                    ? 'bg-emerald-50/20 border-emerald-200'
                    : isRejected
                    ? 'bg-rose-50/20 border-rose-200'
                    : 'bg-[#f7f8fb] border-[#E7EAF0]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-extrabold text-[#0F172A]">{field.label}</h3>
                    {doc ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Uploaded to Cloudinary
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 shrink-0">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1 font-medium">{field.desc}</p>
                </div>

                {doc ? (
                  <div className="p-3 rounded-xl bg-white border border-[#E7EAF0] flex items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">
                          {doc.fileName || `${field.key}.pdf`}
                        </p>
                        <p className="text-[10px] text-[#64748B]">
                          {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Stored in MongoDB'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {doc.docUrl && (
                        <a
                          href={getImageUrl(doc.docUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </a>
                      )}

                      {allowReupload && (
                        <label className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 cursor-pointer border border-emerald-200 transition-colors flex items-center gap-1">
                          <RefreshCw className={`w-3 h-3 ${isUploading ? 'animate-spin' : ''}`} />
                          <span>{isUploading ? 'Uploading...' : 'Re-upload'}</span>
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
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white text-center">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-emerald-600 mb-1 animate-spin" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-emerald-600 mb-1" />
                    )}
                    <span className="text-xs font-extrabold text-[#0F172A]">
                      {isUploading ? 'Uploading to Cloudinary...' : `Upload ${field.label}`}
                    </span>
                    <span className="text-[10px] text-[#64748B]">PDF, PNG, JPG up to 10MB</span>
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

