import React from 'react'

export const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  padding = 'p-6',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300' : ''
      } ${padding} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export const DashboardCard = ({
  title,
  value,
  subvalue,
  icon: Icon,
  badge,
  iconBg = 'bg-red-50 text-red-600',
  className = '',
}) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
          {subvalue && <p className="mt-1 text-xs text-slate-500">{subvalue}</p>}
          {badge && <div className="mt-3">{badge}</div>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBg} shadow-xs`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default Card
