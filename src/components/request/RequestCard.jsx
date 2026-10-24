import React from 'react'
import Card from '../common/Card'
import BloodGroupBadge from '../common/BloodGroupBadge'
import StatusBadge from '../common/StatusBadge'
import Button from '../common/Button'
import { Building2, MapPin, Clock, CheckCircle, HeartHandshake } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const RequestCard = ({
  request,
  onAccept,
  onViewDetails,
  showAccept = true,
}) => {
  const { currentUser, acceptEmergencyRequest } = useApp()

  const isCritical = request.emergencyLevel === 'Critical'
  const isAccepted = request.status === 'Donor Connected' || request.status === 'Fulfilled'

  const handleAccept = () => {
    if (onAccept) {
      onAccept(request)
    } else {
      acceptEmergencyRequest(request.id, currentUser?.id || 'DON-1001', currentUser?.name || 'Ananya Sharma')
    }
  }

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isCritical ? 'border-red-200 hover:border-red-400 bg-linear-to-b from-white to-red-50/20' : ''
      }`}
    >
      {/* Urgency indicator strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isCritical
            ? 'bg-red-600'
            : request.emergencyLevel === 'High'
            ? 'bg-amber-500'
            : 'bg-blue-500'
        }`}
      />

      <div className="pt-2">
        {/* Header: ID, Badges */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500">{request.id}</span>
              <StatusBadge status={request.emergencyLevel} />
              <StatusBadge status={request.status} />
            </div>
            <h4 className="mt-1.5 text-base font-extrabold text-slate-900">
              {request.patientName}
            </h4>
          </div>

          <BloodGroupBadge group={request.bloodGroup} size="lg" />
        </div>

        {/* Core Details */}
        <div className="mt-4 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">{request.hospital}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{request.location}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Needed: <strong>{request.requiredBy || 'Immediate'}</strong></span>
            </div>
            <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs">
              {request.units} Unit{request.units > 1 ? 's' : ''} Needed
            </span>
          </div>

          {request.additionalInfo && (
            <p className="mt-2 p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 italic">
              "{request.additionalInfo}"
            </p>
          )}

          {request.donorName && (
            <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Assigned Donor: {request.donorName}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          {onViewDetails && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => onViewDetails(request)}
            >
              View Details
            </Button>
          )}

          {showAccept && !isAccepted && (
            <Button
              size="sm"
              variant="emergency"
              icon={HeartHandshake}
              className="flex-1 text-xs"
              onClick={handleAccept}
            >
              Accept Request
            </Button>
          )}

          {isAccepted && (
            <div className="flex-1 py-1 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg">
              ✓ Connected
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default RequestCard
