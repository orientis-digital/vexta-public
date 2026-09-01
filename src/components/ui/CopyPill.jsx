import React, { useState } from 'react';

export default function CopyPill({
  text,
  label,
  displayValue,
  className = '',
  truncate = true
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      title="Click to copy to clipboard"
      className={`group flex items-center justify-between gap-3 px-4 py-2.5 bg-[#060805] border border-[#243022] hover:border-[#22C55E]/60 hover:bg-[#0E140C] rounded-xl font-mono text-xs md:text-sm text-gray-200 transition-all cursor-pointer select-none text-left ${className}`}
    >
      <div className="flex flex-col min-w-0">
        {label && (
          <span className="text-[11px] uppercase tracking-wider text-[#7E927F] font-bold block mb-0.5">
            {label}
          </span>
        )}
        <span className={`text-gray-100 group-hover:text-white ${truncate ? 'truncate' : 'break-all'}`}>
          {displayValue || text}
        </span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-lg bg-[#141C13] border border-[#243022] group-hover:border-[#22C55E]/40 text-xs uppercase font-bold text-[#4ADE80]">
        <i className={`fa-solid ${copied ? 'fa-check text-[#39FF14]' : 'fa-copy text-[#22C55E]'}`}></i>
        <span>{copied ? 'COPIED' : 'COPY'}</span>
      </div>
    </button>
  );
}
