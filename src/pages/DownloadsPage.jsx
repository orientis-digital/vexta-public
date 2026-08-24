import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function DownloadsPage() {
  const {
    clientDownloads,
    olderDownloads,
    allReleases,
    availableVersions,
    selectedVersion,
    selectReleaseByVersion,
    latestClientVersion,
  } = useApp();

  const [tab, setTab] = useState('windows');
  const [copiedHash, setCopiedHash] = useState(null);
  const [verifyHashInput, setVerifyHashInput] = useState('');

  // Auto-detect visitor operating system on mount
  useEffect(() => {
    const ua = (typeof window !== 'undefined' && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
    if (ua.includes('android')) setTab('android');
    else if (ua.includes('linux')) setTab('linux');
    else setTab('windows');
  }, []);

  // Current release builds
  const latestExe = clientDownloads.find((d) => d.platform_key === 'windows' && !d.filename.endsWith('.zip'));
  const latestZip = clientDownloads.find((d) => d.platform_key === 'windows' && d.filename.endsWith('.zip'));

  // Historical builds
  const olderExeList = olderDownloads
    .filter((d) => d.platform_key === 'windows' && d.filename.endsWith('.exe'));

  const olderZipList = olderDownloads
    .filter((d) => d.platform_key === 'windows' && d.filename.endsWith('.zip'));

  const androidDownloads = clientDownloads.filter((d) => d.platform_key === 'android');
  const linuxDownloads = clientDownloads.filter((d) => d.platform_key === 'linux');

  const latestAppImage = clientDownloads.find((d) => d.platform_key === 'linux' && d.filename.endsWith('.AppImage'));
  const latestDeb = clientDownloads.find((d) => d.platform_key === 'linux' && d.filename.endsWith('.deb'));
  const latestTarGz = clientDownloads.find((d) => d.platform_key === 'linux' && d.filename.endsWith('.tar.gz'));

  const triggerDownload = (dl) => {
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.75 },
      colors: ['#D97706', '#5F7057', '#D6C5B3']
    });
    if (dl.url) {
      window.open(dl.url, '_blank');
    } else if (dl.platform_key && dl.version) {
      window.open(`https://downloads.nexusec.space/api/v1/vexta/download/${dl.version}/${dl.platform_key}`, '_blank');
    } else if (dl.platform_key) {
      window.open(`https://downloads.nexusec.space/api/v1/vexta/download/${dl.platform_key}`, '_blank');
    }
  };

  const copyHashToClipboard = (hash, filename, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(filename);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Check if entered hash matches any download
  const allDownloadsList = [...clientDownloads, ...olderDownloads];
  const matchingDownload = verifyHashInput.trim()
    ? allDownloadsList.find((d) => d.sha256 && d.sha256.toLowerCase() === verifyHashInput.trim().toLowerCase())
    : null;

  return (
    <div className="flex flex-col gap-10 py-4 min-h-[75vh]">
      {/* Header Hero */}
      <div className="solid-panel p-8 md:p-10 rounded-3xl text-center flex flex-col gap-4 relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#5F7057]/10 via-transparent to-[#D97706]/10 -z-10"></div>
        <div className="text-5xl text-[#D6C5B3]">
          <i className="fa-solid fa-cloud-arrow-down animate-float"></i>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-white">
          Client Distribution Center
        </h1>
        <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto font-sans leading-relaxed">
          Download official Vexta Messenger binaries. All encryption and key generation take place locally on device.
        </p>
      </div>

      {/* Version Selector Bar */}
      {availableVersions && availableVersions.length > 0 && (
        <div className="solid-panel p-4 md:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 flex items-center justify-center text-[#D97706] text-sm">
              <i className="fa-solid fa-code-branch"></i>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Target Release Version
              </span>
              <span className="text-[10px] text-gray-400 font-sans">
                Currently showing packages for <strong className="text-[#D6C5B3]">v{selectedVersion || latestClientVersion}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {availableVersions.map((v, idx) => (
              <button
                key={v}
                onClick={() => selectReleaseByVersion(v)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  (selectedVersion || latestClientVersion) === v
                    ? 'bg-[#D97706] text-white font-bold shadow-tech-sm'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <span>v{v}</span>
                {idx === 0 && (
                  <span className="bg-black/30 text-[8px] px-1.5 py-0.5 rounded font-bold">LATEST</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Platform Selector Tabs */}
      <div className="flex flex-wrap border-b border-white/10 gap-3 select-none">
        <button
          onClick={() => setTab('windows')}
          className={`pb-3 px-4 border-b-2 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2.5 ${
            tab === 'windows'
              ? 'border-[#D97706] text-[#D97706] font-bold shadow-[0_4px_12px_rgba(217,119,6,0.15)]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <i className="fa-brands fa-windows text-base"></i>
          <span>Windows</span>
          <span className="bg-[#D97706]/20 text-[#D97706] px-2 py-0.5 rounded-full text-[9px] font-bold">
            {clientDownloads.filter((d) => d.platform_key === 'windows').length} Builds
          </span>
        </button>

        <button
          onClick={() => setTab('android')}
          className={`pb-3 px-4 border-b-2 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2.5 ${
            tab === 'android'
              ? 'border-[#D97706] text-[#D97706] font-bold shadow-[0_4px_12px_rgba(217,119,6,0.15)]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <i className="fa-brands fa-android text-base"></i>
          <span>Android</span>
          <span className="bg-white/5 text-gray-400 px-2 py-0.5 rounded-full text-[9px] font-bold">
            {androidDownloads.length > 0 ? androidDownloads.length : 'Soon'}
          </span>
        </button>

        <button
          onClick={() => setTab('linux')}
          className={`pb-3 px-4 border-b-2 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2.5 ${
            tab === 'linux'
              ? 'border-[#D97706] text-[#D97706] font-bold shadow-[0_4px_12px_rgba(217,119,6,0.15)]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <i className="fa-brands fa-linux text-base"></i>
          <span>Linux</span>
          <span className="bg-white/5 text-gray-400 px-2 py-0.5 rounded-full text-[9px] font-bold">
            {linuxDownloads.length > 0 ? linuxDownloads.length : 'Soon'}
          </span>
        </button>
      </div>

      {/* Tab Panels Content Stage */}
      <div>
        {/* ========================================================================= */}
        {/* WINDOWS TAB — 2-COLUMN LAYOUT FOR EXE & ZIP */}
        {/* ========================================================================= */}
        {tab === 'windows' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-200">
            {/* COLUMN 1: INSTALLER PACKAGE (.EXE) */}
            <div className="solid-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] text-xl">
                    <i className="fa-solid fa-file-code"></i>
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-white font-mono">
                      Installer Package (.EXE)
                    </h2>
                    <span className="text-[10px] font-mono text-[#7C8775] uppercase">Auto-Installer & Shortcut Setup</span>
                  </div>
                </div>
                {latestExe && (
                  <span className="bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase">
                    ACTIVE RELEASE
                  </span>
                )}
              </div>

              {/* Latest Release EXE Card */}
              {latestExe ? (
                <div
                  onClick={() => triggerDownload(latestExe)}
                  className="solid-panel p-5 rounded-2xl flex flex-col gap-4 border border-[#D97706]/40 bg-[#D97706]/5 hover:border-[#D97706] hover:bg-[#D97706]/15 transition-all duration-300 group cursor-pointer shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#D97706]/20 border border-[#D97706]/40 rounded-2xl flex items-center justify-center text-[#D97706] text-2xl group-hover:scale-110 transition-all duration-300 shrink-0">
                        <i className="fa-solid fa-download"></i>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                          {latestExe.filename}
                        </span>
                        <span className="text-[10px] text-[#D6C5B3] font-mono mt-0.5">
                          Latest Production Release
                        </span>
                      </div>
                    </div>
                    <span className="bg-[#D97706] text-white px-3 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase shrink-0 shadow-tech-sm">
                      v{latestExe.version}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-300 border-t border-white/10 pt-3">
                    <span className="bg-black/40 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                      {latestExe.size}
                    </span>
                    <span className="text-[#D97706] uppercase font-bold">CLICK TO DOWNLOAD NOW</span>
                  </div>

                  {latestExe.sha256 && (
                    <div className="bg-[#0C0E0B]/90 border border-white/10 p-2.5 rounded-xl font-mono text-[9px] flex items-center justify-between gap-2">
                      <span className="text-[#D6C5B3] truncate select-all font-mono" title={latestExe.sha256}>
                        SHA-256: {latestExe.sha256.slice(0, 14)}...{latestExe.sha256.slice(-8)}
                      </span>
                      <button
                        onClick={(e) => copyHashToClipboard(latestExe.sha256, latestExe.filename, e)}
                        className="text-[8px] font-bold uppercase text-[#D6C5B3] hover:text-white bg-white/10 hover:bg-[#D97706] border border-white/10 px-2 py-1 rounded transition-all cursor-pointer shrink-0"
                      >
                        {copiedHash === latestExe.filename ? 'COPIED' : 'COPY HASH'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-2xl bg-[#0C0E0B]/30 text-center gap-3">
                  <i className="fa-solid fa-file-code text-gray-500 text-3xl"></i>
                  <div className="text-xs font-mono text-gray-400 uppercase font-bold">No Active .EXE Builds</div>
                  <p className="text-[11px] text-[#7C8775] max-w-xs font-sans">No production installer builds published yet.</p>
                </div>
              )}

              {/* Historical 5 Versions Table for EXE */}
              {olderExeList.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#D6C5B3] font-mono">
                      Historical Installer Releases
                    </h3>
                    <span className="text-[9px] font-mono text-[#7C8775] uppercase">PREVIOUS BUILDS</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {olderExeList.map((dl) => (
                      <div
                        key={dl.filename}
                        className="flex items-center justify-between bg-[#0C0E0B]/60 border border-white/5 hover:border-white/20 p-3 rounded-xl transition-all text-xs font-mono"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[#D6C5B3] font-extrabold text-[11px] w-12 shrink-0">v{dl.version}</span>
                          <span className="text-gray-300 truncate text-[11px]" title={dl.filename}>
                            {dl.filename}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[#7C8775] text-[10px] hidden sm:inline">{dl.size}</span>
                          <button
                            onClick={(e) => copyHashToClipboard(dl.sha256, dl.filename, e)}
                            className="text-[8px] font-bold uppercase text-gray-400 hover:text-white bg-white/5 px-2 py-1 rounded border border-white/10 cursor-pointer"
                          >
                            {copiedHash === dl.filename ? 'COPIED' : 'HASH'}
                          </button>
                          <button
                            onClick={() => triggerDownload(dl)}
                            className="px-2.5 py-1 text-[9px] font-bold uppercase border border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded transition-all cursor-pointer"
                          >
                            GET
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* COLUMN 2: PORTABLE ZIP ARCHIVE */}
            <div className="solid-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706] text-xl">
                    <i className="fa-solid fa-file-zipper"></i>
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-white font-mono">
                      Portable Package (.ZIP)
                    </h2>
                    <span className="text-[10px] font-mono text-[#7C8775] uppercase">Zero Installation Required</span>
                  </div>
                </div>
                {latestZip && (
                  <span className="bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase">
                    ACTIVE RELEASE
                  </span>
                )}
              </div>

              {/* Latest Release ZIP Card */}
              {latestZip ? (
                <div
                  onClick={() => triggerDownload(latestZip)}
                  className="solid-panel p-5 rounded-2xl flex flex-col gap-4 border border-[#5F7057]/40 bg-[#5F7057]/5 hover:border-[#5F7057] hover:bg-[#5F7057]/15 transition-all duration-300 group cursor-pointer shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#5F7057]/20 border border-[#5F7057]/40 rounded-2xl flex items-center justify-center text-[#D6C5B3] text-2xl group-hover:scale-110 transition-all duration-300 shrink-0">
                        <i className="fa-solid fa-download"></i>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                          {latestZip.filename}
                        </span>
                        <span className="text-[10px] text-[#D6C5B3] font-mono mt-0.5">
                          Direct Unzip & Run
                        </span>
                      </div>
                    </div>
                    <span className="bg-[#5F7057] text-white px-3 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase shrink-0 shadow-tech-sm">
                      v{latestZip.version}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-300 border-t border-white/10 pt-3">
                    <span className="bg-black/40 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                      {latestZip.size}
                    </span>
                    <span className="text-[#D6C5B3] uppercase font-bold">CLICK TO DOWNLOAD NOW</span>
                  </div>

                  {latestZip.sha256 && (
                    <div className="bg-[#0C0E0B]/90 border border-white/10 p-2.5 rounded-xl font-mono text-[9px] flex items-center justify-between gap-2">
                      <span className="text-[#D6C5B3] truncate select-all font-mono" title={latestZip.sha256}>
                        SHA-256: {latestZip.sha256.slice(0, 14)}...{latestZip.sha256.slice(-8)}
                      </span>
                      <button
                        onClick={(e) => copyHashToClipboard(latestZip.sha256, latestZip.filename, e)}
                        className="text-[8px] font-bold uppercase text-[#D6C5B3] hover:text-white bg-white/10 hover:bg-[#5F7057] border border-white/10 px-2 py-1 rounded transition-all cursor-pointer shrink-0"
                      >
                        {copiedHash === latestZip.filename ? 'COPIED' : 'COPY HASH'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-2xl bg-[#0C0E0B]/30 text-center gap-3">
                  <i className="fa-solid fa-file-zipper text-gray-500 text-3xl"></i>
                  <div className="text-xs font-mono text-gray-400 uppercase font-bold">No Active .ZIP Builds</div>
                  <p className="text-[11px] text-[#7C8775] max-w-xs font-sans">No portable zip packages published yet.</p>
                </div>
              )}

              {/* Historical ZIP Table */}
              {olderZipList.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#D6C5B3] font-mono">
                      Historical ZIP Releases
                    </h3>
                    <span className="text-[9px] font-mono text-[#7C8775] uppercase">ARCHIVE BUILDS</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {olderZipList.map((dl) => (
                      <div
                        key={dl.filename}
                        className="flex items-center justify-between bg-[#0C0E0B]/60 border border-white/5 hover:border-white/20 p-3 rounded-xl transition-all text-xs font-mono"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[#D6C5B3] font-extrabold text-[11px] w-12 shrink-0">v{dl.version}</span>
                          <span className="text-gray-300 truncate text-[11px]" title={dl.filename}>
                            {dl.filename}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[#7C8775] text-[10px] hidden sm:inline">{dl.size}</span>
                          <button
                            onClick={(e) => copyHashToClipboard(dl.sha256, dl.filename, e)}
                            className="text-[8px] font-bold uppercase text-gray-400 hover:text-white bg-white/5 px-2 py-1 rounded border border-white/10 cursor-pointer"
                          >
                            {copiedHash === dl.filename ? 'COPIED' : 'HASH'}
                          </button>
                          <button
                            onClick={() => triggerDownload(dl)}
                            className="px-2.5 py-1 text-[9px] font-bold uppercase border border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded transition-all cursor-pointer"
                          >
                            GET
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ANDROID TAB */}
        {/* ========================================================================= */}
        {tab === 'android' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            <div className="solid-panel p-8 rounded-3xl flex flex-col items-center text-center gap-6 relative overflow-hidden border border-white/10 shadow-2xl">
              <div className="w-16 h-16 bg-[#D97706]/15 border border-[#D97706]/30 rounded-2xl flex items-center justify-center text-[#D97706] text-3xl animate-pulse">
                <i className="fa-brands fa-android"></i>
              </div>
              <div className="flex flex-col gap-2 max-w-md">
                <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">Android Client Coming Soon</h2>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  The Vexta Android application is currently in closed security validation audit pipeline. Check back soon for the official APK installer launch.
                </p>
              </div>

              <div className="bg-[#0C0E0B]/80 border border-white/10 px-6 py-4 rounded-2xl flex flex-col gap-2 text-left font-mono text-[10px] w-full max-w-md shadow-inner text-[#7C8775] uppercase">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Target SDK:</span>
                  <span className="text-[#D6C5B3] font-bold">Android 13+ (API 33)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Crypto Pipeline:</span>
                  <span className="text-[#D6C5B3] font-bold">Android Keystore / RSA</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Status:</span>
                  <span className="text-[#D97706] font-bold">PENDING PROTOCOL AUDIT</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LINUX TAB */}
        {/* ========================================================================= */}
        {tab === 'linux' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            {linuxDownloads.length > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 1. AppImage */}
                  <div className="solid-panel p-6 rounded-3xl flex flex-col gap-5 border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] text-xl">
                          <i className="fa-solid fa-box"></i>
                        </div>
                        <div>
                          <h2 className="text-sm font-extrabold uppercase tracking-wider text-white font-mono">AppImage</h2>
                          <span className="text-[10px] font-mono text-[#7C8775] uppercase">Standalone Executable</span>
                        </div>
                      </div>
                    </div>
                    {latestAppImage ? (
                      <div
                        onClick={() => triggerDownload(latestAppImage)}
                        className="solid-panel p-5 rounded-2xl flex flex-col gap-4 border border-[#5F7057]/40 bg-[#5F7057]/5 hover:border-[#5F7057] hover:bg-[#5F7057]/15 transition-all duration-300 group cursor-pointer shadow-lg"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-white uppercase tracking-wider truncate" title={latestAppImage.filename}>
                            {latestAppImage.filename}
                          </span>
                          <span className="bg-[#5F7057] text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                            v{latestAppImage.version}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-300 border-t border-white/10 pt-3">
                          <span className="bg-black/40 border border-white/10 px-2 py-0.5 rounded text-gray-300">{latestAppImage.size}</span>
                          <span className="text-[#D6C5B3] uppercase font-bold">DOWNLOAD</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-xs font-mono text-gray-400 text-center border border-dashed border-white/10 rounded-xl">No AppImage build</div>
                    )}
                  </div>

                  {/* 2. Debian Package (.deb) */}
                  <div className="solid-panel p-6 rounded-3xl flex flex-col gap-5 border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706] text-xl">
                          <i className="fa-brands fa-debian"></i>
                        </div>
                        <div>
                          <h2 className="text-sm font-extrabold uppercase tracking-wider text-white font-mono">Debian (.deb)</h2>
                          <span className="text-[10px] font-mono text-[#7C8775] uppercase">Ubuntu / Debian Package</span>
                        </div>
                      </div>
                    </div>
                    {latestDeb ? (
                      <div
                        onClick={() => triggerDownload(latestDeb)}
                        className="solid-panel p-5 rounded-2xl flex flex-col gap-4 border border-[#D97706]/40 bg-[#D97706]/5 hover:border-[#D97706] hover:bg-[#D97706]/15 transition-all duration-300 group cursor-pointer shadow-lg"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-white uppercase tracking-wider truncate" title={latestDeb.filename}>
                            {latestDeb.filename}
                          </span>
                          <span className="bg-[#D97706] text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                            v{latestDeb.version}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-300 border-t border-white/10 pt-3">
                          <span className="bg-black/40 border border-white/10 px-2 py-0.5 rounded text-gray-300">{latestDeb.size}</span>
                          <span className="text-[#D97706] uppercase font-bold">DOWNLOAD</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-xs font-mono text-gray-400 text-center border border-dashed border-white/10 rounded-xl">No .deb build</div>
                    )}
                  </div>

                  {/* 3. Tarball Archive (.tar.gz) */}
                  <div className="solid-panel p-6 rounded-3xl flex flex-col gap-5 border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] text-xl">
                          <i className="fa-solid fa-file-zipper"></i>
                        </div>
                        <div>
                          <h2 className="text-sm font-extrabold uppercase tracking-wider text-white font-mono">Tarball (.tar.gz)</h2>
                          <span className="text-[10px] font-mono text-[#7C8775] uppercase">Raw Linux Binaries</span>
                        </div>
                      </div>
                    </div>
                    {latestTarGz ? (
                      <div
                        onClick={() => triggerDownload(latestTarGz)}
                        className="solid-panel p-5 rounded-2xl flex flex-col gap-4 border border-[#5F7057]/40 bg-[#5F7057]/5 hover:border-[#5F7057] hover:bg-[#5F7057]/15 transition-all duration-300 group cursor-pointer shadow-lg"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-white uppercase tracking-wider truncate" title={latestTarGz.filename}>
                            {latestTarGz.filename}
                          </span>
                          <span className="bg-[#5F7057] text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                            v{latestTarGz.version}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-300 border-t border-white/10 pt-3">
                          <span className="bg-black/40 border border-white/10 px-2 py-0.5 rounded text-gray-300">{latestTarGz.size}</span>
                          <span className="text-[#D6C5B3] uppercase font-bold">DOWNLOAD</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-xs font-mono text-gray-400 text-center border border-dashed border-white/10 rounded-xl">No tarball build</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center solid-panel rounded-3xl border border-white/10">
                <i className="fa-brands fa-linux text-4xl text-gray-500 mb-3"></i>
                <div className="text-sm font-mono uppercase font-bold text-white">No Linux Releases Staged</div>
                <p className="text-xs text-gray-400 mt-1">Linux builds will appear here automatically when staged to repository.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. SHA-256 HASH VERIFICATION TOOL */}
      {/* ========================================================================= */}
      <div className="solid-panel p-6 md:p-8 rounded-3xl flex flex-col gap-5 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] text-xl">
            <i className="fa-solid fa-fingerprint"></i>
          </div>
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white font-mono">
              Binary Digest Integrity Checker
            </h2>
            <span className="text-[10px] font-mono text-[#7C8775] uppercase">Verify SHA-256 Checksums Against Official Artifacts</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={verifyHashInput}
            onChange={(e) => setVerifyHashInput(e.target.value)}
            placeholder="Paste SHA-256 checksum to test match against official release..."
            className="w-full bg-[#0C0E0B] border border-white/10 rounded-xl p-3.5 font-mono text-xs text-white focus:outline-none focus:border-[#D97706] transition-colors"
          />

          {verifyHashInput.trim() && (
            <div>
              {matchingDownload ? (
                <div className="p-4 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/40 flex items-center gap-3 text-xs font-mono text-[#4ADE80]">
                  <i className="fa-solid fa-circle-check text-lg"></i>
                  <div>
                    <span className="font-bold uppercase">CHECKSUM VERIFIED:</span> Matches official binary{' '}
                    <strong>{matchingDownload.filename}</strong> (v{matchingDownload.version})
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/40 flex items-center gap-3 text-xs font-mono text-[#EF4444]">
                  <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                  <div>
                    <span className="font-bold uppercase">NO MATCH FOUND:</span> The provided checksum does not match any current official build artifact.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
