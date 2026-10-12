import React, { useState, useEffect } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import {
  Download,
  FolderArchive,
  FileJson,
  FileCode,
  Terminal,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Layers,
  Database,
  Sparkles,
  Loader2,
  HardDriveDownload,
  Cpu,
} from 'lucide-react';

export const ProjectDownloadModal: React.FC = () => {
  const {
    isDownloadModalOpen,
    closeDownloadModal,
    downloadProjectFile,
    businesses,
    leads,
    categories,
    events,
    offers,
  } = useDirectory();

  const [downloadingFormat, setDownloadingFormat] = useState<'zip' | 'json' | 'tar' | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showFileInventory, setShowFileInventory] = useState(false);

  // Meta statistics
  const [projectMeta, setProjectMeta] = useState<{
    version: string;
    estimatedZipSizeKb: number;
    framework: string;
    totalFiles?: number;
    fileSample?: string[];
  }>({
    version: '1.0.0',
    estimatedZipSizeKb: 160,
    framework: 'React 19 + Vite + Express + Tailwind CSS v4',
    totalFiles: 44,
    fileSample: [],
  });

  useEffect(() => {
    if (isDownloadModalOpen) {
      setDownloadSuccess(null);
      setErrorMsg(null);
      fetch('/api/project/meta')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setProjectMeta({
              version: data.version || '1.0.0',
              estimatedZipSizeKb: data.estimatedZipSizeKb || 160,
              framework: data.framework || 'React 19 + Vite + Express + Tailwind CSS v4',
              totalFiles: data.totalFiles || 44,
              fileSample: data.fileSample || [],
            });
          }
        })
        .catch(() => {});
    }
  }, [isDownloadModalOpen]);

  if (!isDownloadModalOpen) return null;

  const handleDownload = async (format: 'zip' | 'json' | 'tar') => {
    setDownloadingFormat(format);
    setErrorMsg(null);
    setDownloadSuccess(null);

    try {
      const ok = await downloadProjectFile(format);
      if (ok) {
        const formatNames = {
          zip: 'Project Source Code (.ZIP)',
          json: 'Project Catalog Data (.JSON)',
          tar: 'Project Tarball (.TAR.GZ)',
        };
        setDownloadSuccess(`Successfully initiated download for ${formatNames[format]}!`);
      } else {
        setErrorMsg('Could not complete download. Please check server connection.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Download encountered an unexpected issue.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const localInstallSnippet = `unzip bozeman-business-hub-project.zip
cd bozeman-business-hub
npm install
npm run dev`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(localInstallSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-950 text-white p-6 sm:p-7 relative border-b border-stone-800">
          <button
            onClick={closeDownloadModal}
            className="absolute top-5 right-5 text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HardDriveDownload size={15} />
            <span>Project Export & Download</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Download Project Files
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 max-w-lg leading-relaxed">
            Create and download a complete archive of this project for local development, offline backup, or deployment.
          </p>

          {/* Quick specs pill row */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-stone-800/80 text-[11px] text-stone-300 font-mono">
            <span className="bg-stone-800/90 px-2.5 py-1 rounded-lg border border-stone-700/60 flex items-center gap-1.5">
              <Cpu size={12} className="text-amber-400" />
              <span>{projectMeta.framework}</span>
            </span>
            <span className="bg-stone-800/90 px-2.5 py-1 rounded-lg border border-stone-700/60 flex items-center gap-1.5">
              <FolderArchive size={12} className="text-emerald-400" />
              <span>~{projectMeta.estimatedZipSizeKb} KB Clean Archive</span>
            </span>
            <span className="bg-stone-800/90 px-2.5 py-1 rounded-lg border border-stone-700/60 flex items-center gap-1.5">
              <Database size={12} className="text-purple-400" />
              <span>{businesses.length} Businesses & Data Sets</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Feedback messages */}
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Download Options */}
          <div className="space-y-3.5">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-stone-500">
              Select Download Package
            </h3>

            {/* Option 1: Complete Project ZIP */}
            <div className="border border-stone-200 hover:border-amber-500/60 bg-stone-50/50 hover:bg-amber-50/20 rounded-2xl p-4.5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-600 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <FolderArchive size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-stone-900">
                      Full Project Codebase (.ZIP)
                    </h4>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 max-w-md leading-relaxed">
                    Complete project files: React 19 UI, Vite configs, Express backend, Tailwind v4 styles, types, and setup guide. Ready to run locally.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => handleDownload('zip')}
                  disabled={downloadingFormat !== null}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {downloadingFormat === 'zip' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Packaging ZIP...</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Download .ZIP</span>
                    </>
                  )}
                </button>
                <a
                  href="/api/project/download?format=zip"
                  download="bozeman-business-hub-project.zip"
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold underline flex items-center gap-1 justify-center sm:justify-end cursor-pointer"
                  title="Direct browser download"
                >
                  <span>Direct browser link</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Option 2: Project Catalog Data JSON */}
            <div className="border border-stone-200 hover:border-purple-400/60 bg-stone-50/50 hover:bg-purple-50/20 rounded-2xl p-4.5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-600 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <FileJson size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-stone-900">
                      Directory Dataset & Content (.JSON)
                    </h4>
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Data Export
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 max-w-md leading-relaxed">
                    Direct JSON export of all {businesses.length} businesses, {categories.length} categories, {leads.length} leads, {events.length} events, and digital store items.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => handleDownload('json')}
                  disabled={downloadingFormat !== null}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {downloadingFormat === 'json' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Exporting JSON...</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Download .JSON</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Option 3: UNIX Tarball Archive (.TAR.GZ) */}
            <div className="border border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-100/60 rounded-2xl p-4.5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-stone-200 text-stone-700 border border-stone-300 flex items-center justify-center shrink-0">
                  <FileCode size={22} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-stone-900">
                    Unix Compressed Archive (.TAR.GZ)
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 max-w-md leading-relaxed">
                    Gzip-compressed tarball format optimized for Linux, macOS, and automated CI/CD pipeline imports.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => handleDownload('tar')}
                  disabled={downloadingFormat !== null}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-900 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {downloadingFormat === 'tar' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Creating Tarball...</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Download .TAR.GZ</span>
                    </>
                  )}
                </button>
                <a
                  href="/api/project/download?format=tar.gz"
                  download="bozeman-business-hub-project.tar.gz"
                  className="text-[11px] text-stone-600 hover:text-stone-900 font-semibold underline flex items-center gap-1 justify-center sm:justify-end cursor-pointer"
                  title="Direct tarball download"
                >
                  <span>Direct browser link</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* Project File Manifest Explorer */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/70">
            <button
              onClick={() => setShowFileInventory(!showFileInventory)}
              className="w-full px-4 py-3 bg-stone-100 hover:bg-stone-150 flex items-center justify-between text-xs font-bold text-stone-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-amber-600" />
                <span>Included Project Files & Architecture ({projectMeta.totalFiles || 44} Files)</span>
              </div>
              <span className="text-[11px] text-amber-600 underline">
                {showFileInventory ? 'Hide file list' : 'View file list'}
              </span>
            </button>

            {showFileInventory && (
              <div className="p-3 text-[11px] font-mono text-stone-600 max-h-48 overflow-y-auto space-y-1 bg-white border-t border-stone-200">
                {projectMeta.fileSample && projectMeta.fileSample.length > 0 ? (
                  projectMeta.fileSample.map((file) => (
                    <div key={file} className="flex items-center gap-2 hover:bg-stone-50 px-1.5 py-0.5 rounded">
                      <span className="text-amber-500">📁</span>
                      <span className="text-stone-800">{file}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="text-stone-800">✓ src/App.tsx, src/main.tsx, src/index.css</div>
                    <div className="text-stone-800">✓ src/components/ (Navbar, BusinessCard, InteractiveMap, etc.)</div>
                    <div className="text-stone-800">✓ src/context/DirectoryContext.tsx</div>
                    <div className="text-stone-800">✓ src/data/bozemanData.ts, types/index.ts</div>
                    <div className="text-stone-800">✓ server.ts (Express backend + API routes)</div>
                    <div className="text-stone-800">✓ package.json, vite.config.ts, tsconfig.json, metadata.json</div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Quick Start instructions snippet */}
          <div className="bg-stone-900 rounded-2xl p-4.5 text-stone-200 border border-stone-800">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
                <Terminal size={14} className="text-amber-400" />
                <span>Running Locally After Download</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-mono transition-colors cursor-pointer"
              >
                {copiedCode ? 'Copied!' : 'Copy commands'}
              </button>
            </div>

            <pre className="font-mono text-xs bg-stone-950 p-3 rounded-xl text-stone-300 overflow-x-auto border border-stone-850">
              <code>{localInstallSnippet}</code>
            </pre>
            <p className="text-[11px] text-stone-400 mt-2">
              The project is self-contained and will run the Vite dev server with Express at <span className="font-mono text-stone-300">http://localhost:3000</span>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            <span>Includes complete architecture with zero vendor lock-in.</span>
          </div>

          <button
            onClick={closeDownloadModal}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
