import React, { useState } from 'react'
import {
  Users,
  Activity,
  AlertCircle,
  Building2,
  Droplet,
  CheckCircle,
  Eye,
  Search,
} from 'lucide-react'
import Card, { DashboardCard } from '../components/common/Card'
import BloodGroupBadge from '../components/common/BloodGroupBadge'
import StatusBadge from '../components/common/StatusBadge'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'

export const AdminDashboardPage = () => {
  const {
    donors,
    requests,
    inventory,
    hospitals,
    updateDonor,
    updateRequestStatus,
  } = useApp()

  // Tabs: 'donors' | 'requests' | 'hospitals' | 'charts'
  const [activeTab, setActiveTab] = useState('donors')
  const [searchFilter, setSearchFilter] = useState('')
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [donorModalOpen, setDonorModalOpen] = useState(false)

  // Metrics
  const totalDonors = donors.length + 140
  const activeDonors = donors.filter((d) => d.status === 'Available').length + 95
  const totalRequestsCount = requests.length + 24
  const emergencyRequestsCount = requests.filter(
    (r) => r.emergencyLevel === 'Critical' || r.emergencyLevel === 'High'
  ).length
  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0)
  const totalHospitalsCount = hospitals.length + 8

  // Toggle donor active / disabled
  const handleToggleDonorStatus = (donor) => {
    const newStatus = donor.status === 'Available' ? 'Unavailable' : 'Available'
    updateDonor(donor.id, {
      status: newStatus,
      availableForEmergency: newStatus === 'Available',
    })
  }

  // Verify donor
  const handleVerifyDonor = (donor) => {
    updateDonor(donor.id, { verified: !donor.verified })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                System Administration Control Center
              </span>
              <span className="text-xs text-slate-400 font-mono">Karnataka State Transfusion Council</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              LifeLink Platform Administration
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage voluntary donors, hospital registrations, emergency request escalations, and regional blood bank inventory.
            </p>
          </div>
        </div>

        {/* 6 Key Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <DashboardCard
            title="Total Donors"
            value={totalDonors}
            subvalue="Enrolled"
            icon={Users}
            iconBg="bg-blue-50 text-blue-600"
          />

          <DashboardCard
            title="Active Donors"
            value={activeDonors}
            subvalue="Ready for Alert"
            icon={CheckCircle}
            iconBg="bg-emerald-50 text-emerald-600"
          />

          <DashboardCard
            title="Blood Requests"
            value={totalRequestsCount}
            subvalue="Total Logged"
            icon={Activity}
            iconBg="bg-slate-100 text-slate-700"
          />

          <DashboardCard
            title="Emergencies"
            value={emergencyRequestsCount}
            subvalue="Critical Need"
            icon={AlertCircle}
            iconBg="bg-red-50 text-red-600"
          />

          <DashboardCard
            title="Available Units"
            value={totalUnits}
            subvalue="Across Banks"
            icon={Droplet}
            iconBg="bg-rose-50 text-rose-600"
          />

          <DashboardCard
            title="Hospitals"
            value={totalHospitalsCount}
            subvalue="Verified Centers"
            icon={Building2}
            iconBg="bg-indigo-50 text-indigo-600"
          />
        </div>

        {/* Visual Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Blood Group Distribution Bar Chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Blood Group Distribution & Reserve Stock
                </h4>
                <p className="text-xs text-slate-400">Total units stored by blood group</p>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                Live Stock
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="mt-6 space-y-3">
              {inventory.map((item) => {
                const maxUnits = 20
                const percent = Math.min(100, Math.round((item.units / maxUnits) * 100))
                return (
                  <div key={item.bloodGroup} className="flex items-center gap-3 text-xs">
                    <span className="w-10 font-black font-mono text-slate-800">
                      {item.bloodGroup}
                    </span>
                    <div className="flex-1 h-5 rounded-lg bg-slate-100 overflow-hidden relative">
                      <div
                        className={`h-full rounded-lg transition-all duration-500 ${
                          item.status === 'Available'
                            ? 'bg-red-500'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-16 font-bold text-slate-900 text-right">
                      {item.units} Units
                    </span>
                    <span className="w-24 text-right">
                      <StatusBadge status={item.status} />
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Chart 2: Urgency & Donor Availability Ratio */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-slate-100">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Donor Health & Verification
                </h4>
                <p className="text-xs text-slate-400">Network readiness statistics</p>
              </div>

              <div className="mt-6 space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-600">Verified Donors</span>
                    <span className="text-emerald-700">92%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-600">Available for Emergency</span>
                    <span className="text-blue-700">78%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-600">90-Day Cooldown Period</span>
                    <span className="text-amber-700">14%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <p className="font-bold text-slate-900">Compliance & Regulatory</p>
              <p className="text-slate-500 mt-0.5">
                All mock hospital blood banks comply with National Blood Transfusion Council (NBTC) norms.
              </p>
            </div>
          </Card>
        </div>

        {/* Management Tables with Tab Switcher */}
        <div>
          {/* Tab Navigation */}
          <div className="border-b border-slate-200 flex items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('donors')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'donors'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Voluntary Donors Directory</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                  {donors.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'requests'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Emergency Requests</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                  {requests.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('hospitals')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'hospitals'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Hospital Network</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                  {hospitals.length}
                </span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search table..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
              />
            </div>
          </div>

          {/* TAB 1: Donors Table */}
          {activeTab === 'donors' && (
            <Card className="mt-4 overflow-hidden p-0 border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Donor ID</th>
                      <th className="px-6 py-3.5">Full Name</th>
                      <th className="px-6 py-3.5">Blood Group</th>
                      <th className="px-6 py-3.5">Location</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Verification</th>
                      <th className="px-6 py-3.5 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {donors
                      .filter((d) => {
                        if (!searchFilter.trim()) return true
                        const q = searchFilter.toLowerCase()
                        return (
                          d.name.toLowerCase().includes(q) ||
                          d.id.toLowerCase().includes(q) ||
                          d.bloodGroup.toLowerCase().includes(q) ||
                          d.area.toLowerCase().includes(q)
                        )
                      })
                      .map((donor) => (
                        <tr key={donor.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-900">
                            {donor.id}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-extrabold text-slate-900">{donor.name}</p>
                            <p className="text-[11px] text-slate-400">{donor.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800">{donor.area}</p>
                            <p className="text-[11px] text-slate-400">{donor.city}</p>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={donor.status} />
                          </td>
                          <td className="px-6 py-4">
                            {donor.verified ? (
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDonor(donor)
                                  setDonorModalOpen(true)
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleVerifyDonor(donor)}
                                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                  donor.verified
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {donor.verified ? 'Unverify' : 'Verify'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleDonorStatus(donor)}
                                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                  donor.status === 'Available'
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {donor.status === 'Available' ? 'Disable' : 'Enable'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB 2: Requests Table */}
          {activeTab === 'requests' && (
            <Card className="mt-4 overflow-hidden p-0 border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Req ID</th>
                      <th className="px-6 py-3.5">Patient</th>
                      <th className="px-6 py-3.5">Blood</th>
                      <th className="px-6 py-3.5">Hospital</th>
                      <th className="px-6 py-3.5">Urgency</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Quick Transition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">
                          {req.id}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-slate-900">
                          {req.patientName}
                        </td>
                        <td className="px-6 py-4">
                          <BloodGroupBadge group={req.bloodGroup} size="sm" />
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {req.hospital}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.emergencyLevel} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {req.status !== 'Fulfilled' && (
                              <button
                                type="button"
                                onClick={() => updateRequestStatus(req.id, 'Fulfilled')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                              >
                                Mark Fulfilled
                              </button>
                            )}
                            {req.status !== 'Closed' && (
                              <button
                                type="button"
                                onClick={() => updateRequestStatus(req.id, 'Closed')}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold"
                              >
                                Close
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB 3: Hospitals Network */}
          {activeTab === 'hospitals' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((hosp) => (
                <Card key={hosp.id} className="p-5 border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {hosp.id}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                        {hosp.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{hosp.address}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Accredited
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Head of Blood Bank</span>
                      <strong className="text-slate-800">{hosp.bloodBankHead}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Emergency Hotline</span>
                      <strong className="text-red-600 font-mono">{hosp.emergencyContact}</strong>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donor Details Modal */}
      {selectedDonor && (
        <Modal
          isOpen={donorModalOpen}
          onClose={() => setDonorModalOpen(false)}
          title={`Donor Profile: ${selectedDonor.name}`}
          subtitle="Administrative Donor File"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-slate-400">{selectedDonor.id}</p>
                <h4 className="text-lg font-black text-slate-900">{selectedDonor.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedDonor.age} yrs • {selectedDonor.gender}
                </p>
              </div>
              <BloodGroupBadge group={selectedDonor.bloodGroup} size="lg" />
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Phone:</span>
                <span className="font-mono font-bold">{selectedDonor.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Email:</span>
                <span>{selectedDonor.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Location:</span>
                <span className="font-bold">{selectedDonor.area}, {selectedDonor.city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Status:</span>
                <StatusBadge status={selectedDonor.status} />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Verification:</span>
                <span className="font-bold text-emerald-600">
                  {selectedDonor.verified ? 'Verified Citizen' : 'Pending Verification'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Lifetime Donations:</span>
                <span className="font-bold text-red-600">{selectedDonor.donationsCount || 6} times</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDonorModalOpen(false)}
                className="w-full text-xs"
              >
                Close Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminDashboardPage
