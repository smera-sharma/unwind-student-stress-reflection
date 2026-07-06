import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = true,
  variant = 'surface',
  ...props
}) => {
  const baseStyle = 'rounded-xl transition-all duration-300';
  
  const variants = {
    // Journal page look
    surface: 'bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-white/10 shadow-soft dark:shadow-xl dark:shadow-slate-950/20 backdrop-blur-sm',
    
    // Light shaded borderless panel
    shaded: 'bg-[#FAF7F2] dark:bg-[#243244] border border-[#E5E7EB]/50 dark:border-white/10 shadow-soft dark:shadow-xl dark:shadow-slate-950/20 backdrop-blur-sm',
    
    // Outline style
    outline: 'border border-[#E5E7EB] dark:border-white/10 bg-transparent',
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
