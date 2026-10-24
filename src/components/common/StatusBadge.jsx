import React from 'react'

export const StatusBadge = ({ status, className = '' }) => {
  const norm = (status || '').toLowerCase()

  let style = 'bg-slate-100 text-slate-700 border-slate-200'
  let dotColor = 'bg-slate-400'

  if (norm === 'available' || norm === 'fulfilled' || norm === 'verified') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200'
    dotColor = 'bg-emerald-500'
  } else if (norm === 'low stock' || norm === 'pending' || norm === 'donors notified') {
    style = 'bg-amber-50 text-amber-700 border-amber-200'
    dotColor = 'bg-amber-500'
  } else if (norm === 'unavailable' || norm === 'critical' || norm === 'emergency') {
    style = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
    dotColor = 'bg-rose-500 animate-ping'
  } else if (norm === 'high') {
    style = 'bg-orange-50 text-orange-700 border-orange-200'
    dotColor = 'bg-orange-500'
  } else if (norm === 'donor connected') {
    style = 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
    dotColor = 'bg-indigo-500'
  } else if (norm === 'normal') {
    style = 'bg-blue-50 text-blue-700 border-blue-200'
    dotColor = 'bg-blue-500'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  )
}

export default StatusBadge
