import React, { useState } from 'react'
import Modal from './Modal'
import BloodGroupBadge from './BloodGroupBadge'
import { compatibilityMatrix, donorGivesToMatrix, bloodGroupsList } from '../../data/mockData'
import { Check, X, Info } from 'lucide-react'

export const CompatibilityModal = ({ isOpen, onClose }) => {
  const [selectedGroup, setSelectedGroup] = useState('O+')

  const canReceiveFrom = compatibilityMatrix[selectedGroup] || []
  const canGiveTo = donorGivesToMatrix[selectedGroup] || []

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Blood Group Compatibility Guide"
      subtitle="Understand donor-recipient matching rules and universal blood types"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Universal Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Universal Donor: O-
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Can donate red blood cells to <strong>all 8 blood types</strong>. Highly requested in trauma emergencies.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Universal Recipient: AB+
                </h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Can safely receive red blood cells from <strong>all 8 blood types</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select a blood group to test compatibility:
          </label>
          <div className="flex flex-wrap gap-2">
            {bloodGroupsList.map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedGroup(bg)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  selectedGroup === bg
                    ? 'bg-red-600 text-white shadow-sm shadow-red-200 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Test Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              {selectedGroup} Patient Can Receive From:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {bloodGroupsList.map((bg) => {
                const isMatch = canReceiveFrom.includes(bg)
                return (
                  <span
                    key={bg}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isMatch
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-300 line-through'
                    }`}
                  >
                    {isMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {bg}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
              {selectedGroup} Donor Can Donate To:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {bloodGroupsList.map((bg) => {
                const isMatch = canGiveTo.includes(bg)
                return (
                  <span
                    key={bg}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isMatch
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-300 line-through'
                    }`}
                  >
                    {isMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {bg}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Close Guide
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default CompatibilityModal
