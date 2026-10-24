import React, { useState } from 'react'
import {
  Heart,
  Droplet,
  Calendar,
  CheckCircle,
  Award,
  Clock,
  ShieldCheck,
  FileCheck,
} from 'lucide-react'
import Card, { DashboardCard } from '../components/common/Card'
import BloodGroupBadge from '../components/common/BloodGroupBadge'
import StatusBadge from '../components/common/StatusBadge'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import RequestCard from '../components/request/RequestCard'
import { useApp } from '../context/AppContext'

export const DonorDashboardPage = () => {
  const {
    currentUser,
    updateDonor,
    requests,
    acceptEmergencyRequest,
    compatibilityMatrix,
  } = useApp()

  const [selectedRequest, setSelectedRequest] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('requests') // 'requests' | 'history' | 'profile'

  // Donor data
  const donorName = currentUser?.name || 'Ananya Sharma'
  const donorBloodGroup = currentUser?.bloodGroup || 'O+'
  const donorStatus = currentUser?.status || 'Available'
  const isEmergencyAvail = currentUser?.availableForEmergency !== false
  const lastDonation = currentUser?.lastDonationDate || '2024-08-15'

  // Calculate next eligible date (90 days after last donation)
  let nextEligibleDate = 'Eligible Now'
  let daysUntilEligible = 0
  if (lastDonation) {
    const lastDate = new Date(lastDonation)
    const nextDate = new Date(lastDate.getTime() + 90 * 24 * 3600 * 1000)
    const diff = Math.ceil((nextDate.getTime() - Date.now()) / (1000 * 3600 * 24))
    if (diff > 0) {
      daysUntilEligible = diff
      nextEligibleDate = `In ${diff} Days (${nextDate.toISOString().split('T')[0]})`
    } else {
      nextEligibleDate = 'Eligible to Donate Today'
    }
  }

  // Find nearby requests that match donor's blood group
  // A donor with type D can donate to a request with recipient R if R's compatible types include D
  const matchingRequests = requests.filter((r) => {
    const compatibleWithPatient = compatibilityMatrix[r.bloodGroup] || [r.bloodGroup]
    return compatibleWithPatient.includes(donorBloodGroup)
  })

  // Sample donation history
  const donationHistory = [
    {
      id: 'DON-REC-901',
      date: '2024-08-15',
      hospital: 'City Care Hospital',
      location: 'Koramangala, Bengaluru',
      units: 1,
      type: 'Whole Blood',
      status: 'Administered to Patient',
      verifiedBy: 'Dr. Ramesh Kumar',
    },
    {
      id: 'DON-REC-842',
      date: '2024-04-10',
      hospital: 'Apollo Hospital',
      location: 'Bannerghatta Road, Bengaluru',
      units: 1,
      type: 'Whole Blood',
      status: 'Administered to Patient',
      verifiedBy: 'Dr. Shalini Roy',
    },
    {
      id: 'DON-REC-780',
      date: '2023-12-05',
      hospital: 'Manipal Hospital',
      location: 'HAL Old Airport Road, Bengaluru',
      units: 1,
      type: 'Platelets Transfusion',
      status: 'Emergency Transfusion',
      verifiedBy: 'Dr. Arvind Swamy',
    },
  ]

  const handleToggleEmergency = () => {
    const newStatus = !isEmergencyAvail
    updateDonor(currentUser?.id || 'DON-1001', {
      availableForEmergency: newStatus,
      status: newStatus ? 'Available' : 'Unavailable',
    })
  }

  const handleAccept = (req) => {
    acceptEmergencyRequest(req.id, currentUser?.id || 'DON-1001', donorName)
    setSelectedRequest({
      ...req,
      status: 'Donor Connected',
      donorName,
    })
    setDetailsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Donor Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {currentUser?.id || 'DON-1001'}
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {donorName} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Thank you for being an active life-saver in the Bengaluru emergency network.
            </p>
          </div>

          {/* Quick Emergency Availability Toggle */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shrink-0">
            <div className="text-right">
              <p className="text-xs font-extrabold text-slate-900">
                Emergency Alerts: {isEmergencyAvail ? 'ACTIVE' : 'PAUSED'}
              </p>
              <p className="text-[11px] text-slate-500">
                {isEmergencyAvail
                  ? 'Receiving nearby emergency requests'
                  : 'Temporarily hidden from search'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleEmergency}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isEmergencyAvail ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isEmergencyAvail ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Top 4 KPI Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DashboardCard
            title="Blood Group"
            value={donorBloodGroup}
            subvalue="Rh Factor Positive"
            icon={Droplet}
            iconBg="bg-red-50 text-red-600"
            badge={
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                Can donate to O+, A+, B+, AB+
              </span>
            }
          />

          <DashboardCard
            title="Donor Status"
            value={donorStatus}
            subvalue={isEmergencyAvail ? 'Available for emergency' : 'Paused by donor'}
            icon={CheckCircle}
            iconBg="bg-emerald-50 text-emerald-600"
            badge={<StatusBadge status={donorStatus} />}
          />

          <DashboardCard
            title="Last Donation"
            value={lastDonation}
            subvalue="Koramangala Blood Bank"
            icon={Calendar}
            iconBg="bg-blue-50 text-blue-600"
          />

          <DashboardCard
            title="Next Eligible Donation"
            value={daysUntilEligible > 0 ? `${daysUntilEligible} Days` : 'Eligible Today'}
            subvalue={nextEligibleDate}
            icon={Clock}
            iconBg="bg-amber-50 text-amber-600"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Nearby Emergency Requests</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-red-100 text-red-700">
              {matchingRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Donation History</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
              {donationHistory.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Profile & Settings
          </button>
        </div>

        {/* TAB 1: Nearby Emergency Requests */}
        {activeTab === 'requests' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Emergency Requests Matching Your Blood Type ({donorBloodGroup})
                </h3>
                <p className="text-xs text-slate-500">
                  Critical patients in nearby hospitals compatible with your donation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ● Geolocation Match Active
                </span>
              </div>
            </div>

            {matchingRequests.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">No active emergency requests</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  There are currently no open blood requests matching {donorBloodGroup} in your area. You will receive an instant notification when one is created.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onAccept={handleAccept}
                    onViewDetails={(item) => {
                      setSelectedRequest(item)
                      setDetailsModalOpen(true)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Donation History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Impact Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500 text-white shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                    Silver Life Saver
                  </h4>
                  <p className="text-sm font-bold text-amber-950 mt-0.5">6 Donations Completed</p>
                  <p className="text-[11px] text-amber-800">18 Potential Lives Touched</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-600 text-white shadow-xs">
                  <Droplet className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-900">
                    Total Volume Donated
                  </h4>
                  <p className="text-sm font-bold text-red-950 mt-0.5">2,700 ml Blood</p>
                  <p className="text-[11px] text-red-800">100% Sterile Red Cross certified</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                    Donor Health Status
                  </h4>
                  <p className="text-sm font-bold text-emerald-950 mt-0.5">Verified & Fit</p>
                  <p className="text-[11px] text-emerald-800">Hemoglobin 13.8 g/dL (Normal)</p>
                </div>
              </div>
            </div>

            {/* Donation Records Table */}
            <Card className="overflow-hidden p-0">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-sm">Past Blood Transfusion Records</h4>
                <span className="text-xs text-slate-400">All records authenticated by blood banks</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">Record ID</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Hospital</th>
                      <th className="px-6 py-3">Units & Type</th>
                      <th className="px-6 py-3">Transfusion Status</th>
                      <th className="px-6 py-3">Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {donationHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">
                          {item.id}
                        </td>
                        <td className="px-6 py-4 font-medium">{item.date}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{item.hospital}</p>
                          <p className="text-[11px] text-slate-400">{item.location}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-red-600">{item.units} Unit</span> • {item.type}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status="Fulfilled" />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => alert(`Certificate ${item.id} verified for ${donorName}`)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-bold"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: My Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 text-center p-6 sm:p-8">
              <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-2xl mx-auto shadow-sm">
                {donorName.charAt(0)}
              </div>
              <h3 className="mt-4 text-xl font-black text-slate-900">{donorName}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                ID: {currentUser?.id || 'DON-1001'}
              </p>

              <div className="mt-4 flex justify-center">
                <BloodGroupBadge group={donorBloodGroup} size="lg" />
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-left text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  <StatusBadge status={donorStatus} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Registered City</span>
                  <span className="font-bold text-slate-800">{currentUser?.city || 'Bengaluru'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Area</span>
                  <span className="font-bold text-slate-800">{currentUser?.area || 'Koramangala'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Donations</span>
                  <span className="font-bold text-red-600">6 times</span>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2 p-6 sm:p-8">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-6">
                Donor Contact & Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <p className="font-bold text-slate-900 text-sm">{currentUser?.phone || '+91 98765 43210'}</p>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <p className="font-bold text-slate-900 text-sm">{currentUser?.email || 'ananya.sharma@example.com'}</p>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Last Donation Date</label>
                  <p className="font-bold text-slate-900 text-sm">{lastDonation}</p>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Next Safe Date</label>
                  <p className="font-bold text-emerald-600 text-sm">{nextEligibleDate}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Privacy & Notification Settings
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEmergencyAvail}
                      onChange={handleToggleEmergency}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Enable emergency SMS broadcasts for critical requests within 5 km
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Details / Accept Confirmation Modal */}
      {selectedRequest && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Emergency Request: ${selectedRequest.id}`}
          subtitle="Patient Transfusion Details"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-red-800 uppercase">Emergency Level</p>
                  <h4 className="text-lg font-black text-slate-900 mt-0.5">
                    {selectedRequest.patientName}
                  </h4>
                </div>
                <BloodGroupBadge group={selectedRequest.bloodGroup} size="lg" />
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                <p><strong>Hospital:</strong> {selectedRequest.hospital}</p>
                <p><strong>Location:</strong> {selectedRequest.location}</p>
                <p><strong>Required Units:</strong> {selectedRequest.units} unit(s)</p>
                <p><strong>Urgency:</strong> {selectedRequest.emergencyLevel}</p>
                <p><strong>Contact Hospital:</strong> {selectedRequest.contactNumber}</p>
                {selectedRequest.additionalInfo && (
                  <p className="mt-2 text-slate-500 italic">"{selectedRequest.additionalInfo}"</p>
                )}
              </div>
            </div>

            {selectedRequest.status === 'Donor Connected' && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">You are connected to this emergency!</p>
                  <p className="text-[11px] text-emerald-700">
                    The hospital blood bank has received your confirmation. Please proceed to {selectedRequest.hospital}.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <Button
                size="md"
                variant="outline"
                onClick={() => setDetailsModalOpen(false)}
                className="flex-1 text-xs"
              >
                Close
              </Button>

              {selectedRequest.status !== 'Donor Connected' && (
                <Button
                  size="md"
                  variant="emergency"
                  onClick={() => handleAccept(selectedRequest)}
                  className="flex-1 text-xs"
                >
                  Accept Request Now
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default DonorDashboardPage
