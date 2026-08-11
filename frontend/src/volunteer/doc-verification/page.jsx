import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Loader2,
  Lock,
  BadgeCheck,
  IdCard,
  Truck,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';

const formatVerificationDocs = (docsList = [], status = 'pending') => {
  const defaults = [
    { title: 'Driving License', key: 'license', status: 'missing', required: true, icon: IdCard },
    { title: 'Government Photo ID', key: 'govid', status: 'missing', required: true, icon: FileCheck },
    { title: 'Vehicle RC / Insurance Proof', key: 'vehicle', status: 'missing', required: false, icon: Truck },
  ];

  return defaults.map((item, idx) => {
    const found =
      docsList.find((d) => {
        const typeStr = (d.docType || d.docLabel || d.name || d.title || d.fileName || '').toLowerCase();
        return (
          typeStr === item.key.toLowerCase() ||
          typeStr.includes(item.key.toLowerCase()) ||
          (item.key === 'license' && (typeStr.includes('license') || typeStr.includes('driving'))) ||
          (item.key === 'govid' && (typeStr.includes('govid') || typeStr.includes('government') || typeStr.includes('id') || typeStr.includes('photo'))) ||
          (item.key === 'vehicle' && (typeStr.includes('vehicle') || typeStr.includes('rc') || typeStr.includes('insurance')))
        );
      }) || docsList[idx];

    if (found) {
      const rawUrl = found.docUrl || found.url || found.fileUrl || '';
      return {
        ...item,
        fileName: found.fileName || found.name || `${item.title}`,
        uploadedDate: found.uploadedAt ? new Date(found.uploadedAt).toLocaleDateString() : 'Uploaded',
        status: status === 'approved' ? 'verified' : status === 'rejected' ? 'rejected' : 'pending',
        fileUrl: rawUrl ? getImageUrl(rawUrl) : null,
      };
    }

    return item;
  });
};

const VolunteerDocVerificationPage = () => {
  const licenseInputRef = useRef(null);
  const govIdInputRef = useRef(null);
  const vehicleInputRef = useRef(null);

  const { user: authUser, token, updateUser, fetchProfile } = useAuth();
  const [uploadingDocKey, setUploadingDocKey] = useState(null);
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

  const handleFileUpload = async (filesList, docKey, docTitle) => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    setUploadingDocKey(docKey);
    setUploadSuccessMsg('');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('document', filesArray[0]);
      formData.append('docType', docKey);
      formData.append('docLabel', docTitle);

      const res = await fetch(getApiUrl('/api/users/upload-verification'), {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUser(data.user);
        await fetchProfile();
        setUploadSuccessMsg(`${docTitle} uploaded successfully! Sent for Admin review.`);
      } else {
        setErrorMsg(data.message || 'Failed to upload document.');
      }
    } catch (err) {
      setErrorMsg('Upload error: ' + err.message);
    } finally {
      setUploadingDocKey(null);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-16 bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0 p-2">
            <img src="/imgs/volunteer.png" alt="Volunteer" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-[-0.03em]">
              Volunteer Courier Document Verification
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Upload compliance documents (Driving License, ID Proof) for Admin verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
              isApproved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isRejected
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isApproved ? (
              <>
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                Verified Volunteer Courier
              </>
            ) : isRejected ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Rejected - Action Required
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-600" />
                Pending Admin Approval
              </>
            )}
          </span>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={licenseInputRef}
        onChange={(e) => {
          handleFileUpload(e.target.files, 'license', 'Driving License');
          e.target.value = '';
        }}
        accept="image/*,.pdf,application/pdf,.doc,.docx"
        className="hidden"
      />
      <input
        type="file"
        ref={govIdInputRef}
        onChange={(e) => {
          handleFileUpload(e.target.files, 'govid', 'Government Photo ID');
          e.target.value = '';
        }}
        accept="image/*,.pdf,application/pdf,.doc,.docx"
        className="hidden"
      />
      <input
        type="file"
        ref={vehicleInputRef}
        onChange={(e) => {
          handleFileUpload(e.target.files, 'vehicle', 'Vehicle RC / Insurance Proof');
          e.target.value = '';
        }}
        accept="image/*,.pdf,application/pdf,.doc,.docx"
        className="hidden"
      />

      {/* Feedback Alert Banners */}
      {uploadSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between animate-fade-in">
          <span>{uploadSuccessMsg}</span>
          <button onClick={() => setUploadSuccessMsg('')} className="font-mono text-sm cursor-pointer">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center justify-between animate-fade-in">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="font-mono text-sm cursor-pointer">✕</button>
        </div>
      )}

      {/* Verification Status Banner */}
      {!isApproved && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-amber-900">
                Verification Required for Logistics Pickup
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 font-medium">
                Please upload your Driving License and Government ID. Admins review and approve courier accounts promptly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {uploadedDocs.map((doc) => {
          const IconComp = doc.icon || FileText;
          const refMap = {
            license: licenseInputRef,
            govid: govIdInputRef,
            vehicle: vehicleInputRef,
          };
          const fileRef = refMap[doc.key];
          const isUploadingThis = uploadingDocKey === doc.key;

          return (
            <div
              key={doc.key}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      doc.status === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : doc.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : doc.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#0F172A]">{doc.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {doc.required ? 'Mandatory for courier approval' : 'Optional document proof'}
                  </p>
                </div>

                {doc.fileUrl ? (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                    <p className="font-bold text-slate-700 truncate">{doc.fileName}</p>
                    <span className="text-[10px] text-slate-400 block">{doc.uploadedDate}</span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400 font-medium">
                    No document uploaded yet
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>View File</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  disabled={isUploadingThis}
                  onClick={() => fileRef?.current?.click()}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    doc.fileUrl
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {isUploadingThis ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{doc.fileUrl ? 'Re-upload' : 'Upload'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VolunteerDocVerificationPage;
