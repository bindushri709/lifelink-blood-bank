import React from 'react'

export const BloodGroupBadge = ({ group, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-bold',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3.5 py-1.5 font-extrabold',
    xl: 'text-2xl px-5 py-2 font-black',
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-red-50 text-red-700 border border-red-200 shadow-xs tracking-tight ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className="text-red-500 mr-0.5">🩸</span>
      {group}
    </span>
  )
}

export default BloodGroupBadge
