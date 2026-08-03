import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Award,
  FileText,
  Building2,
  HeartHandshake,
  CheckCircle2,
  Eye,
  Upload,
  MessageSquare,
  X
} from 'lucide-react';

const DonorVerificationPage = () => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDocModal, setActiveDocModal] = useState(null);

  // Initial required compliance documents list
  const [documents] = useState([
    {
      id: 'fssai',
      title: 'Food Safety & Hygiene License (FSSAI)',
      status: 'Approved',
      statusType: 'approved',
      icon: FileText,
      fileName: 'FSSAI_License_2026.pdf',
      date: 'Valid till Dec 2027'
    },
    {
      id: 'tax',
      title: 'Business Registration / Tax ID',
      status: 'Approved',
      statusType: 'approved',
      icon: Building2,
      fileName: 'Tax_ID_Registration.pdf',
      date: 'Verified'
    },
    {
      id: 'agreement',
      title: 'Good Samaritan Food Donation Agreement',
      status: 'Active',
      statusType: 'active',
      icon: HeartHandshake,
      fileName: 'Good_Samaritan_Agreement_Signed.pdf',
      date: 'Signed on Jan 15, 2026'
    }
  ]);

  // Uploaded additional files state
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const processFiles = (filesList) => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    const newDocs = filesArray.map((file, idx) => {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        id: `upload-${Date.now()}-${idx}`,
        name: file.name,
        size: `${sizeInMB} MB`,
        status: 'Under AI Review',
        uploadedAt: 'Just now'
      };
    });

    setUploadedFiles((prev) => [...newDocs, ...prev]);
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
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
      processFiles(e.dataTransfer.files);
    }
  };

  const removeUploadedFile = (id) => {
    setUploadedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3.5">
        <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
          Donor Verification & Safety Compliance
        </h1>
      </div>

      {/* 2. Verification Status Card */}
      <div className="bg-white p-4 sm:p-7 rounded-2xl border border-[#E7EAF0] shadow-soft-card relative overflow-hidden">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-3 sm:mb-4">
          VERIFICATION STATUS
        </span>

        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shrink-0">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-emerald-600 tracking-tight">
                Level 1 Verified
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 sm:mt-1 font-medium">
                Your account is fully verified. Thank you!
              </p>
            </div>
          </div>

          <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-emerald-50/80 border border-emerald-100 flex items-center justify-center shrink-0">
            <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <Award className="w-5 h-5 sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Required Documents Section */}
      <div className="bg-white p-4 sm:p-7 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-tight">
          Required Documents
        </h3>

        <div className="space-y-3">
          {documents.map((doc) => {
            const IconComponent = doc.icon;
            return (
              <div
                key={doc.id}
                className="p-3.5 sm:p-4 rounded-xl border border-[#E7EAF0] bg-[#f8fafc]/50 hover:bg-white hover:border-emerald-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-bold text-[#0F172A] text-xs sm:text-sm truncate">
                    {doc.title}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {doc.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveDocModal(doc)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#E7EAF0] hover:border-emerald-500 bg-white hover:bg-emerald-50/40 text-[#0F172A] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
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

      {/* 4. Upload New / Updated Documents Section */}
      <div className="bg-white p-4 sm:p-7 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-tight">
          Upload New / Updated Documents
        </h3>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Drag & Drop Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center space-y-3 transition-all cursor-pointer ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/60 scale-[1.005]'
              : 'border-emerald-200/90 bg-emerald-50/20 hover:bg-emerald-50/40 hover:border-emerald-300'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-600 mx-auto flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-700">
              Drag & drop files here or
            </p>
            <button
              type="button"
              className="mt-2.5 px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Browse Files</span>
            </button>
            <p className="text-[10px] text-slate-400 mt-2.5">
              PDF, JPG or PNG up to 10MB
            </p>
          </div>
        </div>

        {/* Uploaded Documents List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Newly Uploaded ({uploadedFiles.length})
            </span>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#E7EAF0] bg-[#f8fafc] text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-emerald-100/60 text-emerald-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#0F172A] truncate">{file.name}</p>
                      <p className="text-[11px] text-slate-400">{file.size} • {file.uploadedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {file.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeUploadedFile(file.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Admin Remarks Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-[#0F172A]">
            Admin Remarks
          </h4>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            All documents verified successfully.
          </p>
        </div>
      </div>

      {/* Document View Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E7EAF0] space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">{activeDocModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveDocModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500">File Name:</p>
                <p className="font-semibold text-slate-800 font-mono">{activeDocModal.fileName}</p>
              </div>

              <div className="flex justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-slate-600 font-medium">Verification Details:</span>
                <span className="font-bold text-emerald-700">{activeDocModal.date}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveDocModal(null)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorVerificationPage;
