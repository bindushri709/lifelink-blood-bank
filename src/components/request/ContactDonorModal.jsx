import React, { useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import BloodGroupBadge from '../common/BloodGroupBadge'
import { Phone, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const ContactDonorModal = ({ isOpen, onClose, donor, request }) => {
  const { addNotification } = useApp()
  const [callActive, setCallActive] = useState(false)
  const [smsSent, setSmsSent] = useState(false)
  const [customMsg, setCustomMsg] = useState(
    `Hello, an emergency blood request has been created at ${request?.hospital || 'Hospital'} for ${request?.bloodGroup || donor?.bloodGroup} blood. Your donation can save this patient's life.`
  )

  if (!donor) return null

  const handleStartCall = () => {
    setCallActive(true)
    setTimeout(() => {
      setCallActive(false)
      addNotification({
        type: 'match',
        title: `Simulated Call to ${donor.name}`,
        message: `Phone call initiated with donor ${donor.name} (${donor.phone}).`,
        urgency: 'Normal',
      })
    }, 2500)
  }

  const handleSendSMS = () => {
    setSmsSent(true)
    addNotification({
      type: 'emergency',
      title: `Emergency SMS Sent to ${donor.name}`,
      message: `Direct dispatch: "${customMsg}" delivered to ${donor.phone}.`,
      urgency: 'Critical',
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Emergency Donor"
      subtitle="Prototype communication dispatch (Simulated for demonstration)"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Donor Summary Header */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-slate-900">{donor.name}</h4>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {donor.area}, {donor.city} • <strong className="text-red-600">{donor.distanceKm || '2.4'} km away</strong>
            </p>
            <p className="font-mono text-xs font-semibold text-slate-700 mt-1">
              {donor.phone}
            </p>
          </div>
          <BloodGroupBadge group={donor.bloodGroup} size="lg" />
        </div>

        {/* Action 1: Direct Voice Call Simulation */}
        <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Direct Phone Call (Simulation)</p>
                <p className="text-[11px] text-slate-500">Test voice dialer connection to donor</p>
              </div>
            </div>
            <Button
              size="sm"
              variant={callActive ? 'success' : 'outline'}
              onClick={handleStartCall}
              loading={callActive}
            >
              {callActive ? 'Connecting...' : 'Simulate Call'}
            </Button>
          </div>
        </div>

        {/* Action 2: Direct SMS Alert */}
        <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Emergency SMS Dispatch (Simulation)</p>
              <p className="text-[11px] text-slate-500">Fast delivery with patient & hospital details</p>
            </div>
          </div>

          <textarea
            rows={3}
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
          />

          <div className="mt-2 flex justify-end">
            <Button
              size="sm"
              variant={smsSent ? 'success' : 'primary'}
              icon={smsSent ? CheckCircle2 : Send}
              onClick={handleSendSMS}
              disabled={smsSent}
            >
              {smsSent ? 'SMS Sent Successfully' : 'Send Emergency SMS'}
            </Button>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Close Window
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ContactDonorModal
