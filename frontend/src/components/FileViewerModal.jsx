import React from 'react';
import {
  X,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  FileCheck
} from 'lucide-react';
import { getImageUrl } from '../config/api';

/**
 * FileViewerModal Component
 * Renders a clean dialog listing all uploaded verification documents with direct "Open File in New Tab" links.
 * No inline preview iframe or image box.
 */
export default function FileViewerModal({
  isOpen,
  onClose,
  doc,
  docs,
  title = 'Uploaded Verification Documents',
}) {
  // Standardize input docs into an array of normalized document objects
  const normalizedDocs = React.useMemo(() => {
    let rawDocs = [];
    if (docs && Array.isArray(docs)) {
      rawDocs = docs;
    } else if (doc) {
      if (Array.isArray(doc)) {
        rawDocs = doc;
      } else if (doc.verificationDocs && Array.isArray(doc.verificationDocs)) {
        rawDocs = doc.verificationDocs;
      } else {
        rawDocs = [doc];
      }
    }

    if (rawDocs.length === 0 && doc && (doc.docUrl || doc.fileUrl || typeof doc === 'string')) {
      rawDocs = [doc];
    }

    return rawDocs.map((item, index) => {
      if (typeof item === 'string') {
        const rawUrl = item;
        const fileUrl = getImageUrl(rawUrl);
        const fileName = rawUrl.split('/').pop().split('?')[0] || `Document_${index + 1}`;
        const ext = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';
        return {
          id: index,
          rawUrl,
          fileUrl,
          fileName,
          ext,
          format: ext || 'pdf',
          resourceType: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext) ? 'image' : 'raw',
        };
      } else {
        const rawUrl = item.docUrl || item.fileUrl || item.rawUrl || item.url || '';
        const fileUrl = getImageUrl(rawUrl);
        const fileName =
          item.fileName ||
          item.title ||
          (rawUrl ? rawUrl.split('/').pop().split('?')[0] : `Document_${index + 1}`);
        const ext = item.format
          ? item.format.toLowerCase().replace('.', '')
          : fileName.includes('.')
          ? fileName.split('.').pop().toLowerCase()
          : '';
        const resourceType =
          item.resourceType ||
          (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext) ? 'image' : 'raw');

        return {
          id: index,
          rawUrl,
          fileUrl,
          fileName,
          ext,
          format: item.format || ext || 'file',
          resourceType,
          uploadedAt: item.uploadedAt || item.createdAt || null,
          bytes: item.bytes || null,
          status: item.status || doc?.verificationStatus || 'Uploaded',
        };
      }
    });
  }, [doc, docs]);

  if (!isOpen || normalizedDocs.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-[#E7EAF0] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-[#0F172A] text-base truncate tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Total <strong className="text-emerald-700">{normalizedDocs.length}</strong> uploaded document(s)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Documents List Body */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/40">
          {normalizedDocs.map((item, idx) => {
            const itemIsImg =
              item.resourceType === 'image' ||
              ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes((item.format || '').toLowerCase()) ||
              ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes((item.ext || '').toLowerCase());

            return (
              <div
                key={item.id || idx}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-soft-card hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    {itemIsImg ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-extrabold text-[#0F172A] truncate max-w-xs">
                        {item.fileName}
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.format || 'DOC'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Document #{idx + 1}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-emerald-btn transition-all cursor-pointer text-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open File in New Tab</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Click "Open File in New Tab" to view any document in full browser size.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-extrabold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

