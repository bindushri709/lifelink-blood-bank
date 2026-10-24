import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Droplet,
  MapPin,
  Clock,
  Phone,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import Card from '../components/common/Card'
import BloodGroupBadge from '../components/common/BloodGroupBadge'
import StatusBadge from '../components/common/StatusBadge'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { bloodGroupsList } from '../data/mockData'

export const FindBloodPage = () => {
  const { inventory } = useApp()
  const navigate = useNavigate()

  // Filter state
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [selectedArea, setSelectedArea] = useState('All')
  const [minUnits, setMinUnits] = useState('1')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('units-desc')

  // Generate expanded hospital-level blood stock entries from inventory and hospital list
  const stockItems = useMemo(() => {
    const list = []
    inventory.forEach((item) => {
      if (item.hospitalBreakdown && item.hospitalBreakdown.length > 0) {
        item.hospitalBreakdown.forEach((hosp, idx) => {
          list.push({
            id: `STOCK-${item.bloodGroup}-${idx}`,
            bloodGroup: item.bloodGroup,
            units: hosp.units,
            hospital: hosp.hospital,
            location: `${hosp.location}, Bengaluru`,
            city: 'Bengaluru',
            area: hosp.location,
            lastUpdated: item.lastUpdated,
            status: hosp.units > 3 ? 'Available' : hosp.units > 0 ? 'Low Stock' : 'Unavailable',
            phone: '+91 80 2553 4400',
          })
        })
      } else {
        // If hospital breakdown is empty (e.g. AB- has 0 units)
        list.push({
          id: `STOCK-${item.bloodGroup}-0`,
          bloodGroup: item.bloodGroup,
          units: item.units,
          hospital: 'City Central Blood Repository',
          location: 'Bengaluru Central',
          city: 'Bengaluru',
          area: 'Central',
          lastUpdated: item.lastUpdated,
          status: item.status,
          phone: '+91 80 2553 4400',
        })
      }
    })
    return list
  }, [inventory])

  // Areas list extracted
  const areasList = ['All', 'Koramangala', 'Bannerghatta', 'Old Airport Road', 'Richmond Town', 'Central']

  // Filtered & sorted results
  const filteredResults = useMemo(() => {
    return stockItems
      .filter((item) => {
        if (selectedGroup !== 'All' && item.bloodGroup !== selectedGroup) return false
        if (selectedArea !== 'All' && !item.location.toLowerCase().includes(selectedArea.toLowerCase())) return false
        if (selectedStatus !== 'All' && item.status.toLowerCase() !== selectedStatus.toLowerCase()) return false
        if (Number(minUnits) > item.units && item.units !== 0) return false
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesHosp = item.hospital.toLowerCase().includes(q)
          const matchesLoc = item.location.toLowerCase().includes(q)
          const matchesBg = item.bloodGroup.toLowerCase().includes(q)
          if (!matchesHosp && !matchesLoc && !matchesBg) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'units-desc') return b.units - a.units
        if (sortBy === 'units-asc') return a.units - b.units
        if (sortBy === 'hospital') return a.hospital.localeCompare(b.hospital)
        return 0
      })
  }, [stockItems, selectedGroup, selectedArea, selectedStatus, minUnits, searchQuery, sortBy])

  const handleReset = () => {
    setSelectedGroup('All')
    setSelectedCity('All')
    setSelectedArea('All')
    setMinUnits('1')
    setSelectedStatus('All')
    setSearchQuery('')
    setSortBy('units-desc')
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 mb-2">
            <Droplet className="w-3.5 h-3.5 fill-red-600 text-red-600" />
            Live Blood Inventory Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find Blood Availability & Blood Banks
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Locate available units of whole blood, red cells, and platelets across accredited hospital blood banks in real-time.
          </p>
        </div>

        {/* Filter & Search Bar Card */}
        <Card className="p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital name, area, or blood group..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/50"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="units-desc">Units (Highest First)</option>
                <option value="units-asc">Units (Lowest First)</option>
                <option value="hospital">Hospital Name (A-Z)</option>
              </select>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Blood Group Filter Pills */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Filter by Blood Group:
              </label>
              <span className="text-xs text-slate-400">
                Showing {filteredResults.length} locations
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedGroup('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedGroup === 'All'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Groups
              </button>

              {bloodGroupsList.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setSelectedGroup(bg)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedGroup === bg
                      ? 'bg-red-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>

            {/* Sub-Filters: Area, Status, Min Units */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Area / Locality
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {areasList.map((area) => (
                    <option key={area} value={area}>
                      {area === 'All' ? 'All Areas (Bengaluru)' : area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Stock Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available (4+ units)</option>
                  <option value="Low Stock">Low Stock (1-3 units)</option>
                  <option value="Unavailable">Unavailable (0 units)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Min Units Needed
                </label>
                <select
                  value={minUnits}
                  onChange={(e) => setMinUnits(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="1">1+ Unit</option>
                  <option value="2">2+ Units</option>
                  <option value="4">4+ Units</option>
                  <option value="6">6+ Units</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Grid */}
        <div>
          {filteredResults.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                No matching blood stock found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No hospitals currently match your chosen criteria. You can post an emergency request to directly notify nearby voluntary donors.
              </p>
              <div className="mt-5">
                <Link to="/emergency-request">
                  <Button size="sm" variant="emergency" icon={AlertCircle}>
                    Create Emergency Blood Request
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((item) => (
                <Card
                  key={item.id}
                  className="flex flex-col justify-between hover:border-red-300 transition-all"
                >
                  <div>
                    {/* Header: Blood group, Status */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.id}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                          {item.hospital}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {item.location}
                        </p>
                      </div>

                      <BloodGroupBadge group={item.bloodGroup} size="lg" />
                    </div>

                    {/* Units & Availability Details */}
                    <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-semibold">Available Units</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          {item.units}{' '}
                          <span className="text-xs font-semibold text-slate-500">
                            Units
                          </span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-semibold">Status</span>
                        <StatusBadge status={item.status} className="mt-1" />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Updated {item.lastUpdated}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {item.phone}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() =>
                        alert(
                          `Calling ${item.hospital} Blood Bank at ${item.phone}. Extension: 204`
                        )
                      }
                    >
                      Call Hospital
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 text-xs"
                      onClick={() =>
                        navigate(
                          `/emergency-request?bloodGroup=${encodeURIComponent(
                            item.bloodGroup
                          )}&hospital=${encodeURIComponent(item.hospital)}`
                        )
                      }
                    >
                      Request Blood
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FindBloodPage
