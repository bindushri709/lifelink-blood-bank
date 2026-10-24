import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const EmergencyAlertBanner = () => {
  const { activeEmergencyRequests } = useApp()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !activeEmergencyRequests || activeEmergencyRequests.length === 0) {
    return null
  }

  const urgentReq = activeEmergencyRequests[0]

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md relative z-40 border-b border-red-800">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
          </span>
          <AlertTriangle className="w-4 h-4 text-yellow-300 shrink-0" />
          <p className="font-medium truncate">
            <span className="font-extrabold uppercase tracking-wide text-yellow-200 mr-1.5">
              Urgent Need:
            </span>
            <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-white mr-1.5">
              {urgentReq.bloodGroup}
            </span>
            <span>
              {urgentReq.units} units required at {urgentReq.hospital} ({urgentReq.location})
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <Link
            to={`/match?bloodGroup=${encodeURIComponent(urgentReq.bloodGroup)}&reqId=${urgentReq.id}`}
            className="inline-flex items-center gap-1.5 bg-white text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Find Matching Donors
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss alert"
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyAlertBanner
