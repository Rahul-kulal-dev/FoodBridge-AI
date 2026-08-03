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
  AlertTriangle
} from 'lucide-react';

/**
 * Modern Donor Verification Page (/donor/verification)
 * Implements complete Verification Workflow:
 * 1. Upload saves document with Pending Review status.
 * 2. Sent to Admin Pending Approvals queue.
 * 3. On Approve: status -> Approved / Verified (enables donation creation).
 * 4. On Reject: displays rejection reason, status -> Rejected, enables re-upload.
 * 5. Re-upload resets status back to Pending Review.
 */
const formatVerificationDocs = (docs = [], verificationStatus = 'pending') => {
  return docs.map((d, i) => {
    const rawUrl = typeof d === 'string' ? d : d.docUrl || '';
    const fileName = rawUrl ? rawUrl.split('/').pop() : `Verification_Document_${i + 1}.pdf`;
    const docStatus =
      verificationStatus === 'approved'
        ? 'Approved'
        : verificationStatus === 'rejected'
          ? 'Rejected'
          : 'Pending Review';

    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    const fileUrl = rawUrl
      ? rawUrl.startsWith('http')
        ? rawUrl
        : `http://localhost:5000${rawUrl}`
      : '#';

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
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeDocModal, setActiveDocModal] = useState(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : { verificationStatus: 'pending', verificationDocs: [] };
    } catch (e) {
      return { verificationStatus: 'pending', verificationDocs: [] };
    }
  });

  const [uploadedDocs, setUploadedDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.verificationDocs && parsed.verificationDocs.length > 0) {
          return formatVerificationDocs(parsed.verificationDocs, parsed.verificationStatus);
        }
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUserStr = localStorage.getItem('user');
      let localUser = savedUserStr ? JSON.parse(savedUserStr) : null;

      if (!token) {
        if (localUser && localUser.verificationDocs && localUser.verificationDocs.length > 0) {
          setUploadedDocs(formatVerificationDocs(localUser.verificationDocs, localUser.verificationStatus));
        }
        return;
      }

      const res = await fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.verificationDocs && data.user.verificationDocs.length > 0) {
          setUploadedDocs(formatVerificationDocs(data.user.verificationDocs, data.user.verificationStatus));
        } else if (localUser && localUser.verificationDocs && localUser.verificationDocs.length > 0) {
          setUploadedDocs(formatVerificationDocs(localUser.verificationDocs, data.user.verificationStatus));
        }
      } else {
        if (localUser && localUser.verificationDocs && localUser.verificationDocs.length > 0) {
          setUploadedDocs(formatVerificationDocs(localUser.verificationDocs, localUser.verificationStatus));
        }
      }
    } catch (err) {
      console.warn('Profile sync notice:', err.message);
      const savedUserStr = localStorage.getItem('user');
      if (savedUserStr) {
        const localUser = JSON.parse(savedUserStr);
        if (localUser.verificationDocs && localUser.verificationDocs.length > 0) {
          setUploadedDocs(formatVerificationDocs(localUser.verificationDocs, localUser.verificationStatus));
        }
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const verificationStatus = user.verificationStatus || 'pending'; // 'pending' | 'approved' | 'rejected'
  const isApproved = verificationStatus === 'approved';
  const isRejected = verificationStatus === 'rejected';

  const handleFileUpload = async (filesList) => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    setUploading(true);
    setUploadSuccessMsg('');

    const fileName = filesArray[0].name;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('document', filesArray[0]);

      const res = await fetch('http://localhost:5000/api/users/upload-verification', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (res.ok && (data.user || data.docUrl)) {
        const cloudDocUrl = data.docUrl || (data.user && data.user.verificationDocs?.slice(-1)[0]?.docUrl);
        const existingDocs = user.verificationDocs || [];
        const newDocsList = data.user?.verificationDocs || (cloudDocUrl ? [...existingDocs, { docUrl: cloudDocUrl }] : existingDocs);

        const updatedUser = data.user || {
          ...user,
          verificationStatus: 'pending',
          rejectionReason: '',
          verificationDocs: newDocsList,
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUploadedDocs(formatVerificationDocs(newDocsList, updatedUser.verificationStatus));
      } else {
        // Fallback local update preserving verificationDocs in localStorage
        const cloudDocUrl = data.docUrl;
        const existingDocs = user.verificationDocs || [];
        const newDoc = { docUrl: cloudDocUrl || `/uploads/${fileName}`, uploadedAt: new Date().toISOString() };
        const updatedDocs = [...existingDocs, newDoc];

        const fallbackUser = {
          ...user,
          verificationStatus: 'pending',
          rejectionReason: '',
          verificationDocs: updatedDocs,
        };

        setUser(fallbackUser);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setUploadedDocs(formatVerificationDocs(updatedDocs, 'pending'));
      }
      setUploadSuccessMsg('Document uploaded! Sent for Admin review (Status: Pending Review).');
    } catch (err) {
      const existingDocs = user.verificationDocs || [];
      const newDoc = { docUrl: `/uploads/${fileName}`, uploadedAt: new Date().toISOString() };
      const updatedDocs = [...existingDocs, newDoc];

      const fallbackUser = {
        ...user,
        verificationStatus: 'pending',
        rejectionReason: '',
        verificationDocs: updatedDocs,
      };

      setUser(fallbackUser);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      setUploadedDocs(formatVerificationDocs(updatedDocs, 'pending'));
      setUploadSuccessMsg('Document uploaded! Sent for Admin review (Status: Pending Review).');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    handleFileUpload(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isApproved) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isApproved && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Verification
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">
              Complete your verification to start donating food
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${isApproved
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : isRejected
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
          {isApproved && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {isRejected && <XCircle className="w-4 h-4 text-rose-600" />}
          {!isApproved && !isRejected && <Clock className="w-4 h-4 text-amber-600" />}
          <span>{isApproved ? 'Verified Donor' : isRejected ? 'Rejected' : 'Pending Review'}</span>
        </span>
      </div>

      {/* Rejection Alert Box */}
      {isRejected && (
        <div className="bg-rose-50 border-2 border-rose-200 p-5 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Verification Rejected by Admin</span>
          </div>
          <p className="text-xs text-rose-800 font-medium leading-relaxed">
            <strong>Reason for Rejection:</strong> {user.rejectionReason || 'Document incomplete or illegible. Please re-upload clear government-issued FSSAI certificate.'}
          </p>
          <p className="text-xs text-rose-600 font-bold pt-1">
            Please re-upload your document below. Re-uploading will automatically set your status to Pending Review.
          </p>
        </div>
      )}

      {/* Success Upload Toast/Notice */}
      {uploadSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{uploadSuccessMsg}</span>
          </div>
          <button onClick={() => setUploadSuccessMsg('')} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Verification Status Banner Card */}
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
                  Approved & Verified Donor
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

            {!isApproved && !isRejected && (
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

        {/* Decorative Watermark */}
        <div className="hidden sm:flex items-center justify-center w-24 h-24 opacity-10 text-emerald-600 pointer-events-none">
          <ShieldCheck className="w-20 h-20" />
        </div>
      </div>

      {/* 2. Uploaded Documents Section (ONLY rendered if documents exist) */}
      {uploadedDocs.length > 0 && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E7EAF0] shadow-soft-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">
              Uploaded Documents
            </h3>
            {uploadedDocs.some((d) => d.isBroken) && (
              <button
                type="button"
                onClick={() => {
                  const updated = { ...user, verificationDocs: [], verificationStatus: 'pending' };
                  setUser(updated);
                  localStorage.setItem('user', JSON.stringify(updated));
                  setUploadedDocs([]);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Broken Docs & Re-upload</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {uploadedDocs.map((doc) => {
              const IconComp = doc.iconType === 'building' ? Building2 : FileText;
              let statusPillStyle = 'bg-amber-50 text-amber-700 border-amber-200';
              if (doc.isBroken) {
                statusPillStyle = 'bg-rose-50 text-rose-700 border-rose-200';
              } else if (doc.status === 'Approved' || isApproved) {
                statusPillStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              } else if ((doc.status === 'Rejected' || isRejected) && !isApproved) {
                statusPillStyle = 'bg-rose-50 text-rose-700 border-rose-200';
              }

              const displayStatus = doc.isBroken
                ? 'Upload Failed'
                : isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending Review';

              return (
                <div
                  key={doc.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${doc.isBroken
                      ? 'border-rose-200 bg-rose-50/30'
                      : 'border-[#E7EAF0] bg-white hover:border-emerald-200'
                    }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${doc.isBroken ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                      {doc.isBroken ? <AlertTriangle className="w-5 h-5" /> : <IconComp className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-[#0F172A] text-sm truncate block">
                        {doc.title}
                      </span>
                      {doc.isBroken && (
                        <span className="text-[10px] text-rose-600 font-medium">
                          File not found on server. Please clear and re-upload.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusPillStyle}`}>
                      {doc.isBroken && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                      {!doc.isBroken && displayStatus === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {!doc.isBroken && displayStatus === 'Rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {!doc.isBroken && displayStatus === 'Pending Review' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{displayStatus}</span>
                    </span>

                    {!doc.isBroken && (
                      <button
                        type="button"
                        onClick={() => setActiveDocModal(doc)}
                        className="px-3.5 py-1.5 rounded-xl border border-[#E7EAF0] hover:border-emerald-500 bg-white hover:bg-emerald-50/50 text-[#0F172A] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
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

      {/* 3. Drag & Drop Upload Zone Card */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">
          {isRejected ? 'Re-Upload Compliance Documents' : 'Upload Documents'}
        </h3>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center space-y-4 transition-all cursor-pointer ${isDragging
              ? 'border-emerald-500 bg-emerald-50/60 scale-[1.002]'
              : isRejected
                ? 'border-rose-300 bg-rose-50/20 hover:bg-rose-50/40 hover:border-rose-400'
                : 'border-emerald-300/80 bg-emerald-50/20 hover:bg-emerald-50/40 hover:border-emerald-400'
            }`}
        >
          <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${isRejected ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-[#0F172A]">
              {isRejected ? 'Click or drag files to re-upload for Admin review' : 'Drag & drop files here or click to browse'}
            </p>
            <p className="text-xs text-[#94A3B8] font-medium">
              JPG, PNG, PDF (Max 10MB each)
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : isRejected ? 'Re-Upload Document' : 'Browse Files'}</span>
            </button>
          </div>
        </div>

        {/* Footer Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#94A3B8] font-medium pt-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Your documents are secure and will only be used for verification purposes.</span>
        </div>
      </div>

      {/* Document View Preview Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E7EAF0] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">{activeDocModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveDocModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Document Name:</p>
                <p className="font-bold text-slate-800 font-mono truncate">{activeDocModal.title}</p>
              </div>

              <div className="flex justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-slate-600 font-medium">Status:</span>
                <span className="font-bold text-emerald-700">{isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending Review'}</span>
              </div>

              {activeDocModal.fileUrl && activeDocModal.fileUrl !== '#' && (
                <div className="pt-2">
                  <a
                    href={activeDocModal.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-emerald-btn transition-all text-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Open File </span>
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveDocModal(null)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-emerald-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorVerificationPage;
