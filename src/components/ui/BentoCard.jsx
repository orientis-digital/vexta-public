import React from 'react';

export default function BentoCard({
  children,
  className = '',
  span = 'col-span-12',
  hover = true,
  glow = false,
  onClick,
  id
}) {
  const hoverClass = hover ? 'solid-panel-hover cursor-default' : '';
  const glowClass = glow ? 'shadow-[0_0_30px_rgba(34,197,94,0.18)] border-[#22C55E]/40' : '';
  const clickableClass = onClick ? 'cursor-pointer select-none active:scale-[0.99]' : '';

  return (
    <div
      id={id}
      onClick={onClick}
      className={`solid-panel rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden ${span} ${hoverClass} ${glowClass} ${clickableClass} ${className}`}
    >
      {children}
    </div>
  );
}
