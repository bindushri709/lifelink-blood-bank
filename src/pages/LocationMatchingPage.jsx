import React, { useState, useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  MapPin,
  Users,
  Compass,
  ShieldAlert,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import BloodGroupBadge from '../components/common/BloodGroupBadge'
import StatusBadge from '../components/common/StatusBadge'
import DonorCard from '../components/donor/DonorCard'
import ContactDonorModal from '../components/request/ContactDonorModal'
import { useApp } from '../context/AppContext'
import { bloodGroupsList, compatibilityMatrix } from '../data/mockData'

export const LocationMatchingPage = () => {
  const { requests, findMatchingDonors } = useApp()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const initialReqId = queryParams.get('reqId') || (requests.length > 0 ? requests[0].id : '')
  const initialBg = queryParams.get('bloodGroup') || 'O+'

  // State
  const [selectedRequestId, setSelectedRequestId] = useState(initialReqId)
  const [manualBloodGroup, setManualBloodGroup] = useState(initialBg)
  const [maxDistanceKm, setMaxDistanceKm] = useState(10)
  const [onlyAvailable, setOnlyAvailable] = useState(true)

  const [contactModalDonor, setContactModalDonor] = useState(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  // Current active request if chosen from dropdown
  const activeRequest = useMemo(() => {
    return requests.find((r) => r.id === selectedRequestId) || null
  }, [requests, selectedRequestId])

  // Effective target blood group
  const targetBloodGroup = activeRequest ? activeRequest.bloodGroup : manualBloodGroup

  // Compatible donor list
  const compatibleDonors = useMemo(() => {
    const donors = findMatchingDonors(targetBloodGroup, activeRequest?.location, { onlyAvailable })
    return donors.filter((d) => {
      if (d.distanceKm && d.distanceKm > maxDistanceKm) return false
      return true
    })
  }, [findMatchingDonors, targetBloodGroup, activeRequest, onlyAvailable, maxDistanceKm])

  const compatibleTypes = compatibilityMatrix[targetBloodGroup] || [targetBloodGroup]

  const handleContact = (donor) => {
    setContactModalDonor(donor)
    setContactModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 mb-2">
            <Compass className="w-3.5 h-3.5 text-red-600" />
            Intelligent Location-Based Matching Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Donor Matching & Emergency Dispatch
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Match compatible voluntary blood donors based on red cell biological compatibility, availability status, and real-time geographic proximity.
          </p>
        </div>

        {/* Prototype matching notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-800">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Prototype Demo Matching Engine:</strong> Geographic distances and locations are simulated for academic/hackathon demonstration. Actual transfusion compatibility must be confirmed by qualified medical laboratory professionals.
          </span>
        </div>

        {/* Controls Card */}
        <Card className="p-6 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Choose Emergency Request */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Active Emergency Request:
              </label>
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">-- Or Choose Custom Blood Group Below --</option>
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id}: {r.patientName} ({r.bloodGroup}) – {r.hospital}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Blood Group Selector if no request selected */}
            <div className="lg:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Recipient Blood Group:
              </label>
              <div className="flex flex-wrap gap-1">
                {bloodGroupsList.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => {
                      setSelectedRequestId('')
                      setManualBloodGroup(bg)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      targetBloodGroup === bg
                        ? 'bg-red-600 text-white shadow-xs scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Radius Range Slider */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-1.5 text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider">Search Radius:</span>
                <span className="text-red-600">{maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Compatibility Breakdown Ribbon */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">
                Compatible Donor Blood Types for <strong className="text-slate-900">{targetBloodGroup}</strong>:
              </span>
              <div className="flex items-center gap-1">
                {compatibleTypes.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                Show Available Donors Only
              </label>
            </div>
          </div>
        </Card>

        {/* Selected Request Context Box if applicable */}
        {activeRequest && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <BloodGroupBadge group={activeRequest.bloodGroup} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{activeRequest.id}</span>
                  <StatusBadge status={activeRequest.emergencyLevel} />
                  <StatusBadge status={activeRequest.status} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">
                  Patient: {activeRequest.patientName} • {activeRequest.units} units required
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeRequest.hospital} ({activeRequest.location})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/emergency-request">
                <Button size="sm" variant="outline" className="text-xs">
                  Create New Request
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Donors Results Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Matching Donors Nearby ({compatibleDonors.length} Found)
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by shortest travel distance. Donor contact details are masked for confidentiality.
              </p>
            </div>
          </div>

          {compatibleDonors.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">
                No matching donors found within {maxDistanceKm} km
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try expanding the search radius using the slider above, or broadcast an emergency notification across the city.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compatibleDonors.map((donor) => (
                <DonorCard
                  key={donor.id}
                  donor={donor}
                  requestId={activeRequest?.id}
                  onContact={handleContact}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Donor Modal */}
      <ContactDonorModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        donor={contactModalDonor}
        request={activeRequest}
      />
    </div>
  )
}

export default LocationMatchingPage
