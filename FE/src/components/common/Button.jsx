import React from 'react'

const Button = ({
    children,
    onClick,
    className,
    type = 'button',
    disabled = false,
    variant = 'primary', 
    size = 'md',

}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

  const variantStyles = {
      primary: 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:from-emerald-500/30   ',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      outline: 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
};

const sizeStyles = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-5 text-sm',
}



return (
    <button
        type={type}
        onClick={onClick}
        className={[baseStyles, variantStyles[variant], sizeStyles[size], className].join(' ')}
        disabled={disabled}
    >
        {children}
    </button>
  ) 


}

export default Button
