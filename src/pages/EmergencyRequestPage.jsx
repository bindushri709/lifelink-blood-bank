import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  AlertCircle,
  Send,
  CheckCircle2,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import DonorCard from '../components/donor/DonorCard'
import ContactDonorModal from '../components/request/ContactDonorModal'
import { useApp } from '../context/AppContext'
import { bloodGroupsList, initialHospitals } from '../data/mockData'

export const EmergencyRequestPage = () => {
  const { createEmergencyRequest, findMatchingDonors } = useApp()
  const location = useLocation()

  // Read URL search params (e.g. from Find Blood page)
  const queryParams = new URLSearchParams(location.search)
  const prefillBg = queryParams.get('bloodGroup') || 'O+'
  const prefillHospital = queryParams.get('hospital') || 'City Care Hospital'

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: prefillBg,
    units: '2',
    hospital: prefillHospital,
    location: 'Koramangala, Bengaluru',
    contactNumber: '+91 98450 11223',
    requiredBy: 'Immediate (< 2 hours)',
    emergencyLevel: 'Critical',
    additionalInfo: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Post-submit State
  const [createdRequest, setCreatedRequest] = useState(null)
  const [searchingDonors, setSearchingDonors] = useState(false)
  const [matchingDonorsList, setMatchingDonorsList] = useState([])
  const [contactModalDonor, setContactModalDonor] = useState(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  const validate = () => {
    const err = {}
    if (!formData.patientName.trim()) {
      err.patientName = 'Patient full name is required'
    } else if (formData.patientName.trim().length < 2) {
      err.patientName = 'Patient name must be at least 2 characters'
    }

    if (!formData.bloodGroup) {
      err.bloodGroup = 'Please select a required blood group'
    }

    if (!formData.hospital.trim()) {
      err.hospital = 'Hospital name is required'
    }

    if (!formData.location.trim()) {
      err.location = 'Hospital location/area is required'
    }

    const digitsOnly = formData.contactNumber.trim().replace(/\D/g, '')
    if (!formData.contactNumber.trim()) {
      err.contactNumber = 'Emergency contact phone number is required'
    } else if (digitsOnly.length < 10) {
      err.contactNumber = 'Please provide a valid 10-digit emergency contact phone number'
    }

    const unitsNum = Number(formData.units)
    if (!formData.units || isNaN(unitsNum) || unitsNum < 1) {
      err.units = 'At least 1 blood unit is required (positive whole number)'
    } else if (unitsNum > 20) {
      err.units = 'Maximum 20 units can be requested per emergency batch'
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleHospitalSelect = (e) => {
    const hospName = e.target.value
    const found = initialHospitals.find((h) => h.name === hospName)
    setFormData((prev) => ({
      ...prev,
      hospital: hospName,
      location: found ? `${found.area}, Bengaluru` : prev.location,
      contactNumber: found ? found.emergencyContact : prev.contactNumber,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const newReq = await createEmergencyRequest(formData)
      setCreatedRequest(newReq)
      setSearchingDonors(true)

      // Simulate automated intelligent donor matching animation
      setTimeout(() => {
        const matches = findMatchingDonors(newReq.bloodGroup, newReq.location)
        setMatchingDonorsList(matches)
        setSearchingDonors(false)
      }, 1500)
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err.message }))
      setLoading(false)
    }
  }

  const handleContactDonor = (donor) => {
    setContactModalDonor(donor)
    setContactModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* If Request Created -> Show Confirmation & Live Donor Matching */}
        {createdRequest ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Confirmation Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-red-600 to-rose-700 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-red-500/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-bold shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-red-200">
                      Emergency Alert Broadcasted
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Emergency Request Created
                    </h2>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-red-200 uppercase font-mono font-bold block">
                    Request ID
                  </span>
                  <span className="text-lg font-mono font-black text-white">
                    {createdRequest.id}
                  </span>
                </div>
              </div>

              {/* Request Parameters Summary */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white/10">
                  <span className="text-red-200 block">Patient</span>
                  <strong className="text-sm font-bold text-white mt-0.5 block truncate">
                    {createdRequest.patientName}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-white/10">
                  <span className="text-red-200 block">Blood Group</span>
                  <strong className="text-sm font-black text-white mt-0.5 block">
                    {createdRequest.bloodGroup} ({createdRequest.units} Units)
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-white/10">
                  <span className="text-red-200 block">Hospital</span>
                  <strong className="text-sm font-bold text-white mt-0.5 block truncate">
                    {createdRequest.hospital}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-white/10">
                  <span className="text-red-200 block">Live Status</span>
                  <span className="inline-block mt-1 font-bold text-xs bg-yellow-300 text-slate-900 px-2 py-0.5 rounded-full">
                    {createdRequest.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Search Spinner / Matching Donors Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              {searchingDonors ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Searching for matching donors nearby...
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Scanning registered donors with compatible blood types ({createdRequest.bloodGroup}) within 10 km of {createdRequest.hospital}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="text-lg font-black text-slate-900">
                          {matchingDonorsList.length} Compatible Donors Found
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Donors ranked by approximate distance to {createdRequest.hospital}. Click 'Send Alert' or 'Contact Donor' to initiate immediate dispatch.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to="/hospital-dashboard">
                        <Button size="sm" variant="outline" className="text-xs">
                          Open Hospital Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {matchingDonorsList.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No nearby voluntary donors are currently marked Available for {createdRequest.bloodGroup}.
                      Please contact central blood bank helpline 108 directly.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {matchingDonorsList.map((donor) => (
                        <DonorCard
                          key={donor.id}
                          donor={donor}
                          requestId={createdRequest.id}
                          onContact={handleContactDonor}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setCreatedRequest(null)
                  setMatchingDonorsList([])
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
              >
                ← Create Another Emergency Request
              </button>

              <div className="flex items-center gap-3">
                <Link to="/find-blood">
                  <Button size="sm" variant="outline" className="text-xs">
                    Search Hospital Inventory
                  </Button>
                </Link>
                <Link to="/hospital-dashboard">
                  <Button size="sm" variant="primary" className="text-xs">
                    View in Hospital Portal →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Emergency Request Creation Form */
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-2xl bg-red-100 text-red-600 mb-3 shadow-xs">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Emergency Blood Request
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                Immediately trigger an emergency broadcast to matching voluntary donors and nearby blood banks.
              </p>
            </div>

            <Card className="p-6 sm:p-10 shadow-lg border-red-200">
              {errors.general && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Emergency Level Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Emergency Priority Level <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { level: 'Critical', desc: 'Accident / Surgery (< 2h)', color: 'border-red-600 bg-red-50 text-red-700' },
                      { level: 'High', desc: 'Transfusion Needed (< 6h)', color: 'border-orange-500 bg-orange-50 text-orange-700' },
                      { level: 'Normal', desc: 'Elective Procedure (24h)', color: 'border-blue-500 bg-blue-50 text-blue-700' },
                    ].map((item) => (
                      <button
                        key={item.level}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, emergencyLevel: item.level }))}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          formData.emergencyLevel === item.level
                            ? `${item.color} font-bold ring-2 ring-red-500/20 shadow-xs`
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <p className="text-xs font-black">{item.level}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient & Blood Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Patient Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      placeholder="e.g. Kavita Menon"
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                        errors.patientName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    />
                    {errors.patientName && (
                      <p className="text-xs text-red-600 mt-1">{errors.patientName}</p>
                    )}
                  </div>

                  {/* Units Required */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Units Required <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="units"
                      value={formData.units}
                      onChange={handleChange}
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                        errors.units ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-red-500 bg-white`}
                    >
                      <option value="1">1 Unit (approx 450 ml)</option>
                      <option value="2">2 Units</option>
                      <option value="3">3 Units</option>
                      <option value="4">4 Units</option>
                      <option value="5">5+ Units (Major Trauma)</option>
                    </select>
                    {errors.units && <p className="text-xs text-red-600 mt-1">{errors.units}</p>}
                  </div>
                </div>

                {/* Blood Group Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Required Blood Group <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {bloodGroupsList.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, bloodGroup: bg }))
                          if (errors.bloodGroup) setErrors((prev) => ({ ...prev, bloodGroup: null }))
                        }}
                        className={`py-3 rounded-xl font-black text-sm transition-all border ${
                          formData.bloodGroup === bg
                            ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-red-300'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                  {errors.bloodGroup && <p className="text-xs text-red-600 mt-1">{errors.bloodGroup}</p>}
                </div>

                {/* Hospital & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hospital Quick Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={initialHospitals.some((h) => h.name === formData.hospital) ? formData.hospital : 'Other Hospital'}
                      onChange={handleHospitalSelect}
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    >
                      {initialHospitals.map((h) => (
                        <option key={h.id} value={h.name}>
                          {h.name} ({h.area})
                        </option>
                      ))}
                      <option value="Other Hospital">Other Hospital (Enter below)</option>
                    </select>
                    {formData.hospital === 'Other Hospital' && (
                      <input
                        type="text"
                        name="hospital"
                        onChange={handleChange}
                        placeholder="Enter hospital name..."
                        className="mt-2 w-full text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    )}
                    {errors.hospital && <p className="text-xs text-red-600 mt-1">{errors.hospital}</p>}
                  </div>

                  {/* Hospital Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hospital Location / Area <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Koramangala 4th Block, Bengaluru"
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                        errors.location ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    />
                    {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hospital Emergency Contact / Doctor Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="+91 98450 11223"
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                        errors.contactNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    />
                    {errors.contactNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.contactNumber}</p>
                    )}
                  </div>

                  {/* Required By Timeline */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Required By Timeline
                    </label>
                    <select
                      name="requiredBy"
                      value={formData.requiredBy}
                      onChange={handleChange}
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    >
                      <option value="Immediate (< 2 hours)">Immediate (&lt; 2 hours)</option>
                      <option value="Within 6 hours">Within 6 hours</option>
                      <option value="Within 12 hours">Within 12 hours</option>
                      <option value="Within 24 hours">Within 24 hours</option>
                    </select>
                  </div>
                </div>

                {/* Additional Clinical Information */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Additional Information / Medical Reason (Optional)
                  </label>
                  <textarea
                    rows={3}
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="e.g. Emergency surgery scheduled at 6 PM. Cross-matching in progress at Lab 3."
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    variant="emergency"
                    loading={loading}
                    icon={Send}
                    className="w-full py-4 text-sm font-extrabold uppercase tracking-wider"
                  >
                    Broadcast Emergency Request & Find Donors
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>

      {/* Contact Donor Modal */}
      <ContactDonorModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        donor={contactModalDonor}
        request={createdRequest}
      />
    </div>
  )
}

export default EmergencyRequestPage
