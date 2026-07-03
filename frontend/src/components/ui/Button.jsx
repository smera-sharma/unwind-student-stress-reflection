import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    // Sage green primary button
    primary: 'bg-[#6B8E7A] hover:bg-[#587665] text-white focus:ring-[#6B8E7A] shadow-soft hover:scale-[1.02] active:scale-[0.98]',
    
    // Muted blue secondary button
    secondary: 'bg-[#89A8B2] hover:bg-[#6E8B95] text-white focus:ring-[#89A8B2] shadow-soft hover:scale-[1.02] active:scale-[0.98]',
    
    // Outline style
    outline: 'border border-[#E5E7EB] bg-white text-[#2F3A3F] hover:bg-slate-50 focus:ring-slate-200 hover:scale-[1.02] active:scale-[0.98]',
    
    // Glass style (made minimal and soft, no heavy blur)
    glass: 'bg-white/90 border border-[#E5E7EB] text-[#2F3A3F] shadow-soft hover:scale-[1.02] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm sm:text-base',
    lg: 'px-8 py-3 text-base sm:text-lg',
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className} disabled:opacity-50 disabled:pointer-events-none`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
