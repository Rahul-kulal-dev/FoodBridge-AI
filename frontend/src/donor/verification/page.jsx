import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  FileText,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Upload,
  Lock,
  Loader2,
  X,
  AlertTriangle,
  Info,
  Check
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';
import FileViewerModal from '../../components/FileViewerModal';

/**
 * Helper to format uploaded documents list from backend user object
 */
const formatVerificationDocs = (docs = [], verificationStatus = 'pending') => {
  return docs.map((d, i) => {
    const rawUrl = typeof d === 'string' ? d : d.docUrl || '';
    const fileName = rawUrl ? rawUrl.split('/').pop().split('?')[0] : `Verification_Document_${i + 1}.pdf`;
    const docStatus =
      verificationStatus === 'approved'
        ? 'Approved'
        : verificationStatus === 'rejected'
          ? 'Rejected'
          : 'Pending Review';

    const isPdf = fileName.toLowerCase().endsWith('.pdf') || rawUrl.toLowerCase().includes('.pdf');
    const fileUrl = rawUrl ? getImageUrl(rawUrl) : '#';
    const isBroken = !rawUrl;

    return {
      id: d._id || `doc-${i}`,
      title: fileName,
      status: docStatus,
      fileUrl,
      rawUrl,
      isPdf,
      isBroken,
      iconType: i % 2 === 0 ? 'file' : 'building',
    };
  });
};

const DonorVerificationPage = () => {
  const govIdInputRef = useRef(null);
  const businessProofInputRef = useRef(null);

  const { user: authUser, token, updateUser, fetchProfile } = useAuth();
  const [uploadingDocType, setUploadingDocType] = useState(null); // 'govid' | 'business' | null
  const [activeDocModal, setActiveDocModal] = useState(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const user = authUser || { verificationStatus: 'pending', verificationDocs: [] };
  const uploadedDocs = formatVerificationDocs(user.verificationDocs || [], user.verificationStatus || 'pending');

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const verificationStatus = user.verificationStatus || 'pending';
  const isApproved = verificationStatus === 'approved';
  const isRejected = verificationStatus === 'rejected';

  const handleFileUpload = async (filesList, docTypeLabel = 'Government ID') => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    setUploadingDocType(docTypeLabel);
    setUploadSuccessMsg('');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('document', filesArray[0]);

      const res = await fetch(getApiUrl('/api/users/upload-verification'), {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUser(data.user);
        setUploadSuccessMsg(`${docTypeLabel} uploaded successfully! Sent for Admin review (Status: Pending Review).`);
      } else {
        setErrorMsg(data.message || 'Failed to upload verification document.');
      }
    } catch (err) {
      setErrorMsg('Upload error: ' + err.message);
    } finally {
      setUploadingDocType(null);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-16 bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100 shrink-0 p-2">
            <img src="/imgs/donor.png" alt="Donor" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-[-0.03em]">
              Donor Verification
            </h1>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">
              Upload required identity and business proof to unlock food donation publishing
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border capitalize shrink-0 ${
          isApproved
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isRejected
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          {isApproved && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
          {isRejected && <XCircle className="w-4 h-4 text-rose-600" />}
          {!isApproved && !isRejected && <Clock className="w-4 h-4 text-amber-600" />}
          <span>{isApproved ? 'Verified Donor' : isRejected ? 'Verification Rejected' : 'Pending Admin Review'}</span>
        </span>
      </div>

      {/* Rejection Alert Box */}
      {isRejected && (
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-[20px] space-y-2">
          <div className="flex items-center gap-2 text-rose-800 font-black text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Verification Rejected by Admin</span>
          </div>
          <p className="text-xs text-rose-900 font-medium leading-relaxed">
            <strong>Reason for Rejection:</strong> {user.rejectionReason || 'Document incomplete or illegible. Please re-upload clear proof below.'}
          </p>
          <p className="text-xs text-rose-700 font-bold pt-1">
            Please re-upload your required documents below. Re-uploading will automatically update your status back to Pending Review.
          </p>
        </div>
      )}

      {/* Success / Error Messages */}
      {uploadSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>{uploadSuccessMsg}</span>
          </div>
          <button onClick={() => setUploadSuccessMsg('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Card */}
      <div className="bg-white p-6 rounded-[20px] border border-slate-200/80 shadow-xs flex items-center justify-between relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            CURRENT VERIFICATION STATUS
          </span>

          <div className="flex items-center gap-3">
            {isApproved && (
              <>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-emerald-800 tracking-[-0.02em]">
                    Approved & Verified Donor
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Your account is fully verified. You can publish food donations.</p>
                </div>
              </>
            )}

            {isRejected && (
              <>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-rose-700 tracking-[-0.02em]">
                    Verification Rejected
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Please review rejection details and upload clear proof below.</p>
                </div>
              </>
            )}

            {!isApproved && !isRejected && (
              <>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-amber-700 tracking-[-0.02em]">
                    Pending Admin Review
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Admin team is reviewing your uploaded verification documents.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      {uploadedDocs.length > 0 && (
        <div className="bg-white p-6 rounded-[20px] border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#0F172A]">
              Uploaded Documents ({uploadedDocs.length})
            </h3>
          </div>

          <div className="space-y-3">
            {uploadedDocs.map((doc) => {
              const IconComp = doc.iconType === 'building' ? Building2 : FileText;
              let statusPillStyle = 'bg-amber-50 text-amber-800 border-amber-200';
              if (doc.isBroken) {
                statusPillStyle = 'bg-rose-50 text-rose-800 border-rose-200';
              } else if (doc.status === 'Approved' || isApproved) {
                statusPillStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
              } else if ((doc.status === 'Rejected' || isRejected) && !isApproved) {
                statusPillStyle = 'bg-rose-50 text-rose-800 border-rose-200';
              }

              const displayStatus = doc.isBroken
                ? 'Upload Failed'
                : isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending Review';

              return (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0 border border-emerald-100">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-[#0F172A] text-xs truncate block">
                        {doc.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Uploaded Document</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold border ${statusPillStyle}`}>
                      <span>{displayStatus}</span>
                    </span>

                    {!doc.isBroken && (
                      <button
                        type="button"
                        onClick={() => setActiveDocModal(doc)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Upload Fields Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[20px] border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-black text-[#0F172A]">
            Upload Verification Documents
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Provide clear government-issued identity or registered business license documents
          </p>
        </div>

        {/* Hidden Inputs */}
        <input
          ref={govIdInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload(e.target.files, 'Government ID')}
          className="hidden"
          disabled={uploadingDocType !== null}
        />

        <input
          ref={businessProofInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload(e.target.files, 'Business Proof')}
          className="hidden"
          disabled={uploadingDocType !== null}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Government ID Proof (Required) */}
          <div className="border border-slate-200/80 rounded-2xl p-5 sm:p-6 bg-slate-50/50 space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-[#0F172A]">
                    1. Government ID Proof <span className="text-rose-600">*</span>
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase">
                  Required
                </span>
              </div>

              <div className="text-xs text-slate-600 font-medium space-y-1.5 pt-1">
                <p className="font-bold text-slate-800">Upload any one of the following:</p>
                <ul className="space-y-1 pl-1 text-slate-600 text-xs">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Aadhaar Card</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> PAN Card</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Driving License</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Passport</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Voter ID</li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-400 font-semibold pt-1">
                Accepted formats: JPG, PNG, PDF (Max 10 MB)
              </p>
            </div>

            <button
              type="button"
              disabled={uploadingDocType !== null}
              onClick={() => govIdInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {uploadingDocType === 'Government ID' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Government ID...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Government ID</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Business Proof (Required only for Restaurants/Businesses) */}
          <div className="border border-slate-200/80 rounded-2xl p-5 sm:p-6 bg-slate-50/50 space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-[#0F172A]">
                    2. Business Proof
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black uppercase">
                  Restaurants / Businesses
                </span>
              </div>

              <div className="text-xs text-slate-600 font-medium space-y-1.5 pt-1">
                <p className="font-bold text-slate-800">Upload any one of the following:</p>
                <ul className="space-y-1 pl-1 text-slate-600 text-xs">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> FSSAI License</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> GST Certificate</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Shop & Establishment Certificate</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Trade License</li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-400 font-semibold pt-1">
                Accepted formats: JPG, PNG, PDF (Max 10 MB)
              </p>
            </div>

            <button
              type="button"
              disabled={uploadingDocType !== null}
              onClick={() => businessProofInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {uploadingDocType === 'Business Proof' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Business Proof...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Business Proof</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Small Clarification Note */}
        <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 font-medium">
          <Info className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Individual donors only need to upload a <strong>Government ID</strong>. Business proof is required only for restaurants or registered businesses.
          </p>
        </div>

        {/* Footer Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium pt-2">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Your documents are secure and will only be used for verification purposes.</span>
        </div>
      </div>

      {/* Document View Preview Modal */}
      <FileViewerModal
        isOpen={!!activeDocModal}
        onClose={() => setActiveDocModal(null)}
        doc={activeDocModal}
        title="Donor Verification Document"
      />
    </div>
  );
};

export default DonorVerificationPage;
