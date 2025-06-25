import React from 'react'

const Button = ({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'flex items-center justify-center px-6 py-3.5 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0'
  const variantStyles = {
    primary: 'bg-mint hover:bg-mint/50 text-white focus:ring-mint shadow-lg',
    outline:
      'border-2 border-white/20 text-white hover:bg-white/10 focus:ring-white glass-effect',
    google:
      'bg-white hover:bg-white/90 focus:ring-white text-black/90 font-medium shadow-lg',
    signup:
      'bg-navy/60 hover:bg-navy/80 text-white focus:ring-navy shadow-lg',
  }
  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button