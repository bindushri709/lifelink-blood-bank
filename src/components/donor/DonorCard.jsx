import React, { useState } from 'react'
import Card from '../common/Card'
import BloodGroupBadge from '../common/BloodGroupBadge'
import StatusBadge from '../common/StatusBadge'
import Button from '../common/Button'
import { MapPin, Phone, Calendar, Send, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const DonorCard = ({
  donor,
  requestId,
  onContact,
  onAlertSent,
}) => {
  const { addNotification } = useApp()
  const [showFullPhone, setShowFullPhone] = useState(false)
  const [alertSent, setAlertSent] = useState(false)

  const maskedPhone = donor.phone
    ? donor.phone.slice(0, 9) + ' •••••'
    : '+91 98765 •••••'

  const handleSendAlert = () => {
    setAlertSent(true)
    addNotification({
      type: 'match',
      title: 'Emergency Match Alert Dispatched',
      message: `Direct emergency alert sent to ${donor.name} (${donor.bloodGroup}) located in ${donor.area} (${donor.distanceKm || '2.4'} km away).`,
      requestId: requestId || null,
      bloodGroup: donor.bloodGroup,
      urgency: 'Critical',
    })
    if (onAlertSent) onAlertSent(donor)
  }

  return (
    <Card className="flex flex-col justify-between hover:border-red-200 transition-all">
      <div>
        {/* Header: Name, Verified, Blood Group */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-base shrink-0">
              {donor.name ? donor.name.charAt(0) : 'D'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-extrabold text-slate-900 text-base">{donor.name}</h4>
                {donor.verified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Donor" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {donor.area || 'Bengaluru'}, {donor.city || 'Bengaluru'}
                </span>
                <span>•</span>
                <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                  {donor.distanceKm || (Math.random() * 3 + 1.2).toFixed(1)} km away
                </span>
              </div>
            </div>
          </div>

          <BloodGroupBadge group={donor.bloodGroup} size="md" />
        </div>

        {/* Status & Eligibility Details */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Status</span>
            <StatusBadge status={donor.status} className="mt-1" />
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Last Donation</span>
            <div className="flex items-center gap-1 font-semibold text-slate-700 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {donor.lastDonationDate || 'First time donor'}
            </div>
          </div>
        </div>

        {/* Protected Phone / Privacy */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-slate-700 font-semibold">
              {showFullPhone ? donor.phone : maskedPhone}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowFullPhone((prev) => !prev)}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 underline"
          >
            {showFullPhone ? 'Hide' : 'Reveal'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs"
          onClick={() => (onContact ? onContact(donor) : setShowFullPhone(true))}
        >
          Contact Donor
        </Button>

        <Button
          size="sm"
          variant={alertSent ? 'success' : 'primary'}
          icon={alertSent ? CheckCircle2 : Send}
          disabled={alertSent || donor.status !== 'Available'}
          className="flex-1 text-xs"
          onClick={handleSendAlert}
        >
          {alertSent ? 'Alert Sent' : 'Send Alert'}
        </Button>
      </div>
    </Card>
  )
}

export default DonorCard
