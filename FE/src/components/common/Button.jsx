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
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
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
