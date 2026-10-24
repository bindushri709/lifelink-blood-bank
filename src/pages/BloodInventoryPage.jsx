import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Droplet,
  Clock,
  Edit2,
} from 'lucide-react'
import Card from '../components/common/Card'
import BloodGroupBadge from '../components/common/BloodGroupBadge'
import StatusBadge from '../components/common/StatusBadge'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'

export const BloodInventoryPage = () => {
  const { inventory, updateInventoryStock } = useApp()
  const navigate = useNavigate()

  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [unitsInput, setUnitsInput] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const totalStock = inventory.reduce((sum, item) => sum + item.units, 0)

  const handleOpenUpdate = (item) => {
    setSelectedBloodGroup(item.bloodGroup)
    setUnitsInput(String(item.units))
    setUpdateModalOpen(true)
  }

  const handleSaveStock = (e) => {
    e.preventDefault()
    if (selectedBloodGroup) {
      updateInventoryStock(selectedBloodGroup, Number(unitsInput))
      setUpdateModalOpen(false)
    }
  }

  const filteredInventory = inventory.filter((item) => {
    if (filterStatus !== 'All' && item.status !== filterStatus) return false
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 mb-2">
              <Droplet className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              Real-Time Stock Audit
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Live Blood Bank Inventory
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-xl">
              Consolidated real-time reserve across all 8 major human blood groups in accredited hospital storage facilities.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-right shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 block">
              Total In-Stock Reserve
            </span>
            <span className="text-3xl font-black text-red-900 tracking-tight">
              {totalStock}{' '}
              <span className="text-sm font-semibold text-red-700">Units</span>
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filter Status:
            </span>
            {['All', 'Available', 'Low Stock', 'Unavailable'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === st
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            Click 'Update Stock' on any card to simulate incoming collection or transfusion outflow.
          </p>
        </div>

        {/* All 8 Blood Groups Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredInventory.map((item) => {
            const isZero = item.units === 0
            const isLow = item.status === 'Low Stock'

            return (
              <Card
                key={item.bloodGroup}
                className={`flex flex-col justify-between transition-all ${
                  isZero
                    ? 'border-red-300 bg-red-50/20'
                    : isLow
                    ? 'border-amber-200 bg-amber-50/10'
                    : 'hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top: Blood badge & status */}
                  <div className="flex items-start justify-between">
                    <BloodGroupBadge group={item.bloodGroup} size="lg" />
                    <StatusBadge status={item.status} />
                  </div>

                  {/* Units Count */}
                  <div className="mt-5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {item.units}
                    </span>
                    <span className="ml-2 text-sm font-bold text-slate-500 uppercase">
                      Units Available
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Last Updated: <strong>{item.lastUpdated}</strong>
                  </p>

                  {/* Hospital breakdown list */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Hospital Reserve Breakdown:
                    </p>

                    {item.hospitalBreakdown && item.hospitalBreakdown.length > 0 ? (
                      <div className="space-y-1.5">
                        {item.hospitalBreakdown.map((hosp, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 text-slate-700"
                          >
                            <span className="truncate pr-2 font-medium">{hosp.hospital}</span>
                            <span className="font-mono font-bold text-slate-900 shrink-0">
                              {hosp.units} u
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-2 px-3 rounded-lg bg-red-50/50 border border-red-200/60 text-xs text-red-700 font-semibold text-center">
                        Zero reserve in network. Voluntary donor alert required.
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Edit2}
                    onClick={() => handleOpenUpdate(item)}
                    className="flex-1 text-xs"
                  >
                    Update Units
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      navigate(
                        `/emergency-request?bloodGroup=${encodeURIComponent(item.bloodGroup)}`
                      )
                    }
                    className="flex-1 text-xs"
                  >
                    Request {item.bloodGroup}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Update Stock Modal */}
      <Modal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title={`Update Stock: ${selectedBloodGroup}`}
        subtitle="Modify available units for this blood group"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleSaveStock} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              New Available Units (Total Count)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={unitsInput}
              onChange={(e) => setUnitsInput(e.target.value)}
              className="w-full text-base font-bold px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Setting units to 0 will automatically mark the status as 'Unavailable'. 1-4 units marks as 'Low Stock'.
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUpdateModalOpen(false)}
              className="flex-1 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="primary"
              className="flex-1 text-xs"
            >
              Save Units
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default BloodInventoryPage
