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
    surface: 'bg-white border border-[#E5E7EB] shadow-soft',
    
    // Light shaded borderless panel
    shaded: 'bg-[#FAF7F2] border border-[#E5E7EB]/50 shadow-soft',
    
    // Outline style
    outline: 'border border-[#E5E7EB] bg-transparent',
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
