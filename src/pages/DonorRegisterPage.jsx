import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Droplet,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import BloodGroupBadge from '../components/common/BloodGroupBadge'
import StatusBadge from '../components/common/StatusBadge'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'
import { bloodGroupsList } from '../data/mockData'

export const DonorRegisterPage = () => {
  const { registerDonor } = useApp()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    city: 'Bengaluru',
    area: 'Koramangala',
    lastDonationDate: '',
    availableForEmergency: true,
    healthConfirmed: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successDonor, setSuccessDonor] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const validate = () => {
    const err = {}
    if (!formData.name.trim()) err.name = 'Full name is required'
    if (!formData.age) {
      err.age = 'Age is required'
    } else if (Number(formData.age) < 18) {
      err.age = 'You must be at least 18 years old to donate blood'
    } else if (Number(formData.age) > 65) {
      err.age = 'Maximum donor age limit is 65 years'
    }

    if (!formData.phone.trim()) {
      err.phone = 'Contact number is required'
    } else if (formData.phone.trim().length < 10) {
      err.phone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.email.trim()) {
      err.email = 'Email address is required'
    } else if (!formData.email.includes('@')) {
      err.email = 'Please provide a valid email format'
    }

    if (!formData.city.trim()) err.city = 'City is required'
    if (!formData.area.trim()) err.area = 'Area/locality is required'

    if (!formData.healthConfirmed) {
      err.healthConfirmed = 'You must confirm the health & eligibility declaration'
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const createdDonor = await registerDonor(formData)
      setSuccessDonor(createdDonor)
      setShowSuccessModal(true)
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err.message }))
    } finally {
      setLoading(false)
    }
  }

  // Calculate 90 days warning preview
  let donationWarning = ''
  if (formData.lastDonationDate) {
    const diff = Math.floor(
      (Date.now() - new Date(formData.lastDonationDate).getTime()) / (1000 * 3600 * 24)
    )
    if (diff < 90) {
      donationWarning = `Note: Last donation was ${diff} days ago. Medical safety guidelines require a 90-day waiting gap. Your status will be set to Temporarily Unavailable until the period completes.`
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-red-100 text-red-600 mb-3 shadow-xs">
            <Droplet className="w-8 h-8 fill-red-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Register as a Voluntary Blood Donor
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Join thousands of everyday heroes in Bengaluru and beyond. When a patient needs your blood type, LifeLink alerts you immediately.
          </p>
        </div>

        {/* Prototype Clinical Disclaimer Box */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Medical Prototype Notice</p>
            <p className="mt-0.5 leading-relaxed text-amber-700">
              This application is a demonstration prototype. Actual physical and medical eligibility (hemoglobin ≥ 12.5 g/dL, blood pressure, weight, medical history) will be verified by certified healthcare professionals at the blood bank prior to collection.
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="p-6 sm:p-10 shadow-lg">
          {errors.general && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Personal Information */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                1. Personal Details
              </h3>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Iyer"
                    className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                      errors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Age <span className="text-red-500">* (18 - 65 yrs)</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                      errors.age ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  {errors.age && <p className="text-xs text-red-600 mt-1">{errors.age}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Blood Group & Eligibility */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                2. Blood Type & Eligibility
              </h3>

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Your Blood Group <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {bloodGroupsList.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, bloodGroup: bg }))}
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
              </div>

              {/* Last Donation Date */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Last Blood Donation Date (Optional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="lastDonationDate"
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.lastDonationDate}
                    onChange={handleChange}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>
                {donationWarning && (
                  <p className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                    {donationWarning}
                  </p>
                )}
              </div>
            </div>

            {/* Section 3: Contact & Location */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                3. Contact & Location Details
              </h3>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className={`w-full text-sm pl-12 pr-4 py-2.5 rounded-xl border ${
                        errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ramesh@example.com"
                    className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                      errors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Area / Locality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. Koramangala, Indiranagar"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Preferences & Declaration */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="availableForEmergency"
                  checked={formData.availableForEmergency}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Available for Emergency Blood Requests
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Allow nearby hospitals and patients in critical trauma situations to contact you. You can toggle this off anytime in your dashboard.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="healthConfirmed"
                  checked={formData.healthConfirmed}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Health & Eligibility Confirmation <span className="text-red-500">*</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    I confirm that I weigh over 45 kg, have had no tattoos or major surgery in the last 6 months, and have no chronic infectious diseases.
                  </p>
                </div>
              </label>
              {errors.healthConfirmed && (
                <p className="text-xs text-red-600">{errors.healthConfirmed}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                loading={loading}
                icon={UserCheck}
                className="w-full text-sm font-bold uppercase tracking-wider py-3.5"
              >
                Complete Donor Registration
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Success Modal */}
      {successDonor && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Registration Successful!"
          subtitle="Welcome to the LifeLink Donor Community"
          maxWidth="max-w-md"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">{successDonor.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Donor ID: <strong className="text-slate-900">{successDonor.id}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-around">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Blood Group</span>
                <BloodGroupBadge group={successDonor.bloodGroup} size="lg" className="mt-1" />
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Live Status</span>
                <StatusBadge status={successDonor.status} className="mt-1" />
              </div>
            </div>

            <p className="text-xs text-slate-600">
              You are now registered in the LifeLink network. When compatible patients in {successDonor.area} need blood, you will be notified.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                size="md"
                variant="primary"
                onClick={() => {
                  setShowSuccessModal(false)
                  navigate('/donor-dashboard')
                }}
                className="w-full text-xs font-bold"
              >
                Go to Donor Dashboard →
              </Button>

              <Button
                size="md"
                variant="outline"
                onClick={() => {
                  setShowSuccessModal(false)
                  navigate('/emergency-request')
                }}
                className="w-full text-xs"
              >
                Check Emergency Requests
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default DonorRegisterPage
