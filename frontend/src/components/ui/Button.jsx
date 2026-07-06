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
  const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    // Sage green primary button
    primary: 'bg-[#6B8E7A] dark:bg-[#A7C4A0] hover:bg-[#587665] dark:hover:bg-[#B7D3B0] text-white dark:text-[#0F172A] focus:ring-[#6B8E7A] shadow-soft hover:scale-[1.02] active:scale-[0.98]',
    
    // Dark filled/muted blue secondary button
    secondary: 'bg-[#FAF7F2] dark:bg-[#1E293B] hover:bg-[#E8DCC8]/30 dark:hover:bg-[#243244] border border-[#E5E7EB] dark:border-white/10 text-[#2F3A3F] dark:text-[#CBD5E1] focus:ring-[#6B8E7A] hover:scale-[1.02] active:scale-[0.98]',
    
    // Outline style
    outline: 'border border-[#E5E7EB] dark:border-white/10 bg-transparent text-[#2F3A3F] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:scale-[1.02] active:scale-[0.98]',
    
    // Glass style
    glass: 'bg-white/90 dark:bg-[#1E293B]/90 border border-[#E5E7EB] dark:border-white/10 text-[#2F3A3F] dark:text-[#CBD5E1] shadow-soft hover:scale-[1.02] active:scale-[0.98]',

    // Ghost transparent button
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-[#1E293B] text-[#2F3A3F] dark:text-[#CBD5E1] hover:scale-[1.02] active:scale-[0.98]',

    // Danger button style
    danger: 'bg-[#DC6B6B] dark:bg-[#FCA5A5]/20 hover:bg-[#C25858] dark:hover:bg-[#FCA5A5]/30 text-white dark:text-[#FCA5A5] border border-transparent dark:border-[#FCA5A5]/20 focus:ring-[#DC6B6B] hover:scale-[1.02] active:scale-[0.98]',
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
