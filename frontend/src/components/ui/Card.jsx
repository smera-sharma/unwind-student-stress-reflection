import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = true,
  variant = 'surface',
  ...props
}) => {
  const baseStyle = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    // Journal page look
    surface: 'bg-white dark:bg-slate-950 border border-[#E5E7EB] dark:border-slate-800/80 shadow-soft',
    
    // Light shaded borderless panel
    shaded: 'bg-[#FAF7F2] dark:bg-slate-900 border border-[#E5E7EB]/50 dark:border-slate-850 shadow-soft',
    
    // Outline style
    outline: 'border border-[#E5E7EB] dark:border-slate-800 bg-transparent',
  };

  const hoverStyle = hoverEffect ? 'hover:-translate-y-0.5 hover:shadow-premium transition-all duration-200' : '';
  const variantStyle = variants[variant] || variants.surface;

  return (
    <div
      className={`${baseStyle} ${variantStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
