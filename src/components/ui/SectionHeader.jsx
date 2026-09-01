import React from 'react';

export default function SectionHeader({
  tag,
  title,
  description,
  align = 'center', // 'center' | 'left'
  className = ''
}) {
  const alignmentClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <div className={`flex flex-col gap-3 max-w-3xl ${align === 'center' ? 'mx-auto' : ''} ${alignmentClass} ${className}`}>
      {tag && (
        <span className="text-[#22C55E] text-xs md:text-sm font-extrabold uppercase tracking-widest font-mono flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#39FF14] rounded-full animate-pulse"></span>
          {tag}
        </span>
      )}
      {title && (
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white font-sans leading-tight">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm md:text-base text-gray-300 font-sans leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
