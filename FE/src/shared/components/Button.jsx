import React from 'react';
import './Button.css';

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  ...props 
}) {
  return (
    <button 
      className={`btn btn--${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
