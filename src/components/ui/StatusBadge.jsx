import React from 'react';

export default function StatusBadge({
  label,
  icon,
  variant = 'green', // 'green' | 'neon' | 'mint' | 'sand' | 'red' | 'neutral'
  pulse = false,
  className = ''
}) {
  const variantStyles = {
    green: 'text-[#22C55E] bg-[#22C55E]/15 border-[#22C55E]/35',
    neon: 'text-[#39FF14] bg-[#39FF14]/20 border-[#39FF14]/50 shadow-[0_0_14px_rgba(57,255,20,0.25)]',
    mint: 'text-[#4ADE80] bg-[#4ADE80]/15 border-[#4ADE80]/35',
    sand: 'text-[#D6C5B3] bg-white/5 border-white/10',
    red: 'text-red-400 bg-red-500/15 border-red-500/35',
    neutral: 'text-gray-400 bg-[#141C13] border-[#243022]'
  };

  const dotColors = {
    green: 'bg-[#22C55E]',
    neon: 'bg-[#39FF14]',
    mint: 'bg-[#4ADE80]',
    sand: 'bg-[#D6C5B3]',
    red: 'bg-red-400',
    neutral: 'bg-gray-400'
  };

  const currentVariant = variantStyles[variant] || variantStyles.green;
  const dotColor = dotColors[variant] || dotColors.green;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs md:text-sm font-bold uppercase tracking-wider border select-none transition-all ${currentVariant} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2.5 w-2.5 mr-0.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}`}></span>
        </span>
      )}
      {icon && !pulse && <i className={`${icon} text-xs`}></i>}
      <span>{label}</span>
    </span>
  );
}
