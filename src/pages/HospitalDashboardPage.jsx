import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Eye,
  Users,
  Droplet,
} from 'lucide-react'
import Card, { DashboardCard } from '../components/common/Card'
import BloodGroupBadge from '../components/common/BloodGroupBadge'
import StatusBadge from '../components/common/StatusBadge'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'

export const HospitalDashboardPage = () => {
  const {
    requests,
    donors,
    inventory,
    updateRequestStatus,
    currentUser,
  } = useApp()
  const navigate = useNavigate()

  // Selected request for details or status update
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('Pending')

  // Search & filter
  const [searchFilter, setSearchFilter] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Metrics
  const totalRequests = requests.length
  const activeEmergencies = requests.filter(
    (r) => r.status === 'Donors Notified' || r.status === 'Pending'
  ).length
  const completedRequests = requests.filter(
    (r) => r.status === 'Fulfilled' || r.status === 'Closed'
  ).length
  const totalAvailableUnits = inventory.reduce((sum, item) => sum + item.units, 0)
  const totalDonorsAvailable = donors.filter((d) => d.status === 'Available').length

  // Filter requests table
  const filteredRequests = requests.filter((r) => {
    if (urgencyFilter !== 'All' && r.emergencyLevel !== urgencyFilter) return false
    if (statusFilter !== 'All' && r.status !== statusFilter) return false
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase()
      const matchId = r.id.toLowerCase().includes(q)
      const matchPatient = r.patientName.toLowerCase().includes(q)
      const matchHospital = r.hospital.toLowerCase().includes(q)
      const matchBg = r.bloodGroup.toLowerCase().includes(q)
      if (!matchId && !matchPatient && !matchHospital && !matchBg) return false
    }
    return true
  })

  const handleOpenStatusModal = (req) => {
    setSelectedRequest(req)
    setNewStatus(req.status)
    setStatusModalOpen(true)
  }

  const handleSaveStatus = () => {
    if (selectedRequest) {
      updateRequestStatus(selectedRequest.id, newStatus)
      setStatusModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Hospital Command Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentUser?.name || 'City Care Hospital'}
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Emergency Transfusion Center
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage patient blood transfusion requests, donor dispatches, and inventory status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/emergency-request">
              <Button size="md" variant="emergency" icon={Plus}>
                New Emergency Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard 5 Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <DashboardCard
            title="Total Requests"
            value={totalRequests}
            subvalue="All Time"
            icon={Building2}
            iconBg="bg-blue-50 text-blue-600"
          />

          <DashboardCard
            title="Active Emergency"
            value={activeEmergencies}
            subvalue="Awaiting Transfusion"
            icon={AlertCircle}
            iconBg="bg-red-50 text-red-600"
            badge={
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                High Priority
              </span>
            }
          />

          <DashboardCard
            title="Blood Units Found"
            value={totalAvailableUnits}
            subvalue="In Network Stock"
            icon={Droplet}
            iconBg="bg-rose-50 text-rose-600"
          />

          <DashboardCard
            title="Matching Donors"
            value={totalDonorsAvailable}
            subvalue="Available in City"
            icon={Users}
            iconBg="bg-emerald-50 text-emerald-600"
          />

          <DashboardCard
            title="Completed"
            value={completedRequests}
            subvalue="Transfusions Done"
            icon={CheckCircle}
            iconBg="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Requests Management Table */}
        <Card className="overflow-hidden p-0 border border-slate-200 shadow-sm">
          {/* Table Header & Search Filter Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Patient Blood Requests
              </h3>
              <p className="text-xs text-slate-500">
                Track status from initial notification to donor connection and successful transfusion.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter requests..."
                  className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 bg-slate-50"
                />
              </div>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="All">All Urgency</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Donors Notified">Donors Notified</option>
                <option value="Donor Connected">Donor Connected</option>
                <option value="Pending">Pending</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Request ID</th>
                  <th className="px-6 py-3.5">Patient Name</th>
                  <th className="px-6 py-3.5">Blood Group</th>
                  <th className="px-6 py-3.5">Units</th>
                  <th className="px-6 py-3.5">Hospital</th>
                  <th className="px-6 py-3.5">Urgency</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                      No blood requests match your selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {req.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-slate-900">{req.patientName}</p>
                        <p className="text-[11px] text-slate-400">Req: {req.requiredBy}</p>
                      </td>
                      <td className="px-6 py-4">
                        <BloodGroupBadge group={req.bloodGroup} size="sm" />
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        {req.units} Unit{req.units > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{req.hospital}</p>
                        <p className="text-[11px] text-slate-400">{req.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.emergencyLevel} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.status} />
                        {req.donorName && (
                          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                            Assigned: {req.donorName}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRequest(req)
                              setDetailsModalOpen(true)
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Find Matching Donors */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/match?bloodGroup=${encodeURIComponent(
                                  req.bloodGroup
                                )}&reqId=${req.id}`
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs"
                            title="Find Matching Donors"
                          >
                            Find Donors
                          </button>

                          {/* Update Status */}
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(req)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-xs"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Request Details: ${selectedRequest.id}`}
          subtitle="Hospital Clinical Transfusion Record"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 font-mono">Patient</p>
                <h4 className="text-lg font-black text-slate-900">{selectedRequest.patientName}</h4>
                <p className="text-xs text-slate-500 mt-1">{selectedRequest.hospital}</p>
              </div>
              <BloodGroupBadge group={selectedRequest.bloodGroup} size="lg" />
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Emergency Priority:</span>
                <StatusBadge status={selectedRequest.emergencyLevel} />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Current Status:</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Required By:</span>
                <span className="font-bold">{selectedRequest.requiredBy}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Required Units:</span>
                <span className="font-bold text-red-600">{selectedRequest.units} Units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Emergency Contact:</span>
                <span className="font-bold">{selectedRequest.contactNumber}</span>
              </div>
              {selectedRequest.donorName && (
                <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                  <span className="font-semibold">Connected Donor:</span>
                  <span className="font-bold">{selectedRequest.donorName}</span>
                </div>
              )}
              {selectedRequest.additionalInfo && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-0.5">Clinical Remarks:</span>
                  <p className="italic bg-slate-50 p-2 rounded-lg text-slate-600">
                    "{selectedRequest.additionalInfo}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDetailsModalOpen(false)}
                className="flex-1 text-xs"
              >
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setDetailsModalOpen(false)
                  navigate(
                    `/match?bloodGroup=${encodeURIComponent(
                      selectedRequest.bloodGroup
                    )}&reqId=${selectedRequest.id}`
                  )
                }}
                className="flex-1 text-xs"
              >
                Find Donors →
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Status Modal */}
      {selectedRequest && (
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Update Status: ${selectedRequest.id}`}
          subtitle="Progress transfusion lifecycle"
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select New Status:
              </label>
              <div className="space-y-2">
                {[
                  { val: 'Donors Notified', desc: 'Broadcast alert sent to nearby donors' },
                  { val: 'Donor Connected', desc: 'Donor accepted & is en route' },
                  { val: 'Fulfilled', desc: 'Blood drawn and administered to patient' },
                  { val: 'Closed', desc: 'Request completed or cancelled' },
                ].map((item) => (
                  <label
                    key={item.val}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                      newStatus === item.val
                        ? 'border-red-600 bg-red-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={item.val}
                      checked={newStatus === item.val}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="mt-0.5 text-red-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.val}</p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStatusModalOpen(false)}
                className="flex-1 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleSaveStatus}
                className="flex-1 text-xs"
              >
                Save Status
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default HospitalDashboardPage
