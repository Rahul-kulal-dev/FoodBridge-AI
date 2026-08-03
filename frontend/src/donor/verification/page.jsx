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
  X
} from 'lucide-react';

/**
 * Clean & Modern Donor Verification Page (/donor/verification)
 * Matches attached mockup 1:1
 */
const DonorVerificationPage = () => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeDocModal, setActiveDocModal] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : { verificationStatus: 'pending' };
    } catch (e) {
      return { verificationStatus: 'pending' };
    }
  });

  // State for uploaded documents (safe JSON storage without component references)
  const [uploadedDocs, setUploadedDocs] = useState(() => {
    try {
      const savedDocs = localStorage.getItem('donor_uploaded_docs');
      if (savedDocs) {
        const parsed = JSON.parse(savedDocs);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved docs:', e);
    }
    return [];
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.verificationDocs && data.user.verificationDocs.length > 0) {
          const apiDocs = data.user.verificationDocs.map((d, i) => ({
            id: `doc-${i}`,
            title: d.docUrl ? d.docUrl.split('/').pop() : `Verification_Document_${i + 1}.pdf`,
            status: data.user.verificationStatus === 'approved' ? 'Approved' : data.user.verificationStatus === 'rejected' ? 'Rejected' : 'Pending Review',
            statusType: data.user.verificationStatus || 'pending',
            iconType: i % 2 === 0 ? 'file' : 'building',
          }));
          setUploadedDocs(apiDocs);
          localStorage.setItem('donor_uploaded_docs', JSON.stringify(apiDocs));
        }
      }
    } catch (err) {
      console.warn('Profile sync notice:', err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const verificationStatus = user.verificationStatus || 'pending'; // 'pending' | 'approved' | 'rejected'

  const handleFileUpload = async (filesList) => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    setUploading(true);

    const newDoc = {
      id: `doc-${Date.now()}`,
      title: filesArray[0].name,
      status: 'Pending Review',
      statusType: 'pending',
      iconType: filesArray[0].name.toLowerCase().includes('tax') ? 'building' : 'file',
    };

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('document', filesArray[0]);

      const res = await fetch('http://localhost:5000/api/users/upload-verification', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (err) {
      console.warn('Backend upload notice:', err.message);
    } finally {
      setUploading(false);
      setUploadedDocs((prev) => {
        const updated = [...prev, newDoc];
        localStorage.setItem('donor_uploaded_docs', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleFileChange = (e) => {
    handleFileUpload(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
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

      {/* 1. Verification Status Banner Card */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest block">
            VERIFICATION STATUS
          </span>

          <div className="flex items-center gap-3">
            {verificationStatus === 'approved' && (
              <>
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                  Approved & Verified Donor
                </h2>
              </>
            )}

            {verificationStatus === 'rejected' && (
              <>
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                  Verification Rejected
                </h2>
              </>
            )}

            {verificationStatus === 'pending' && (
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
          <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">
            Uploaded Documents
          </h3>

          <div className="space-y-3">
            {uploadedDocs.map((doc) => {
              const IconComp = doc.iconType === 'building' ? Building2 : FileText;
              let statusPillStyle = 'bg-amber-50 text-amber-700 border-amber-200';
              if (doc.status === 'Approved') statusPillStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              if (doc.status === 'Rejected') statusPillStyle = 'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-[#E7EAF0] bg-white hover:border-emerald-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-[#0F172A] text-sm truncate">
                      {doc.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusPillStyle}`}>
                      {doc.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {doc.status === 'Rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {doc.status === 'Pending Review' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{doc.status}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveDocModal(doc)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#E7EAF0] hover:border-emerald-500 bg-white hover:bg-emerald-50/50 text-[#0F172A] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View</span>
                    </button>
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
          Upload Documents
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
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center space-y-4 transition-all cursor-pointer ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/60 scale-[1.002]'
              : 'border-emerald-300/80 bg-emerald-50/20 hover:bg-emerald-50/40 hover:border-emerald-400'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-[#0F172A]">
              Drag & drop files here or click to browse
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
              <span>{uploading ? 'Uploading...' : 'Browse Files'}</span>
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
                <span className="font-bold text-emerald-700">{activeDocModal.status}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveDocModal(null)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
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
