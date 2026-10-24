import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Droplet,
  Heart,
  Search,
  UserPlus,
  AlertCircle,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  Activity,
  Users,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import BloodGroupBadge from '../components/common/BloodGroupBadge'
import Button from '../components/common/Button'
import CompatibilityModal from '../components/common/CompatibilityModal'
import { useApp } from '../context/AppContext'
import { bloodGroupsList } from '../data/mockData'

export const LandingPage = () => {
  const { donors, requests, inventory } = useApp()
  const [compatModalOpen, setCompatModalOpen] = useState(false)
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+')

  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0)
  const activeEmergencies = requests.filter(
    (r) => r.status === 'Donors Notified' || r.status === 'Pending'
  )

  const stats = [
    { label: 'Registered Donors', value: `${donors.length + 140}+`, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Blood Units Available', value: `${totalUnits} Units`, icon: Droplet, color: 'text-red-600 bg-red-50' },
    { label: 'Emergency Requests', value: `${requests.length + 24}`, icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
    { label: 'Lives Connected', value: '1,280+', icon: Heart, color: 'text-emerald-600 bg-emerald-50' },
  ]

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Submit Blood Request',
      desc: 'Patients or hospitals create an emergency request specifying required blood group, units, and urgency level.',
      icon: AlertCircle,
    },
    {
      step: '02',
      title: 'Location & Donor Match',
      desc: 'Our engine instantly searches compatible, eligible donors within a 10 km radius and ranks by proximity.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Instant Alerts Dispatched',
      desc: 'Donors receive immediate priority notifications via SMS, voice, and in-app alerts with hospital directions.',
      icon: Activity,
    },
    {
      step: '04',
      title: 'Transfusion & Life Saved',
      desc: 'Donor arrives at the blood bank or hospital. Status updates live on hospital & patient tracking dashboards.',
      icon: Heart,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Soft decorative background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-50/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-700 mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                Rapid Emergency Donor Network
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Every Drop <br />
                <span className="text-red-600 inline-block underline decoration-red-200 decoration-wavy">
                  Can Save a Life.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Find blood donors faster. Connect hospitals, patients, and voluntary blood donors when every minute matters.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link to="/find-blood">
                  <Button size="lg" variant="primary" icon={Search}>
                    Find Blood
                  </Button>
                </Link>

                <Link to="/register">
                  <Button size="lg" variant="outline" icon={UserPlus}>
                    Become a Donor
                  </Button>
                </Link>

                <Link to="/emergency-request">
                  <Button size="lg" variant="emergency" icon={AlertCircle}>
                    Emergency Request
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Free Public Initiative</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span>Under 5-Min Donor Matching</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Verified Blood Banks</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Quick Status Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 border border-slate-200 relative">
                {/* Active Emergency Callout */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Live Emergency Transfusion Need
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                {activeEmergencies.length > 0 ? (
                  <div className="mt-4 p-4 rounded-2xl bg-linear-to-r from-red-50 to-rose-50/50 border border-red-200 text-left">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {activeEmergencies[0].id}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                          {activeEmergencies[0].patientName}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {activeEmergencies[0].hospital}
                        </p>
                      </div>
                      <BloodGroupBadge group={activeEmergencies[0].bloodGroup} size="lg" />
                    </div>

                    <div className="mt-3 pt-3 border-t border-red-200/60 flex items-center justify-between text-xs">
                      <span className="text-red-700 font-bold">
                        {activeEmergencies[0].units} Units Needed Urgently
                      </span>
                      <Link
                        to={`/match?bloodGroup=${encodeURIComponent(activeEmergencies[0].bloodGroup)}&reqId=${activeEmergencies[0].id}`}
                        className="font-bold text-red-600 hover:text-red-800 underline inline-flex items-center gap-1"
                      >
                        Match Donors <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    All emergency requests currently connected.
                  </div>
                )}

                {/* Quick Blood Group Availability Matrix Mini */}
                <div className="mt-6 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Inventory Availability
                    </p>
                    <Link
                      to="/inventory"
                      className="text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      View All 8 Groups →
                    </Link>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {inventory.slice(0, 4).map((item) => (
                      <div
                        key={item.bloodGroup}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center"
                      >
                        <p className="font-mono font-black text-slate-900 text-sm">
                          {item.bloodGroup}
                        </p>
                        <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                          {item.units} Units
                        </p>
                        <span
                          className={`mt-1 inline-block w-2 h-2 rounded-full ${
                            item.status === 'Available'
                              ? 'bg-emerald-500'
                              : item.status === 'Low Stock'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link to="/emergency-request" className="block w-full">
                    <button className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors">
                      🚨 Need Blood Urgently? Request Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Platform Statistics */}
      <section className="bg-slate-900 py-12 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800">
                  <div className="inline-flex p-3 rounded-xl bg-slate-800 text-red-400 mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Streamlined Process
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How LifeLink Saves Lives in Minutes
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              When a medical emergency occurs, traditional phone calls to friends and blood banks can waste critical hours. LifeLink automates the discovery and matching process.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.step}
                  className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200 font-mono">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Interactive Blood Compatibility Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Medical Knowledge Base
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Blood Group Compatibility Checker
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Ensure rapid emergency response with automated red blood cell antigen matching.
            </p>
          </div>

          {/* Quick interactive test strip */}
          <div className="mt-10 max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Choose Patient Blood Group</p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  Check who is compatible for immediate transfusion:
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {bloodGroupsList.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBloodGroup(bg)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedBloodGroup === bg
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs text-slate-500 block">Compatible Donors for {selectedBloodGroup}</span>
                <span className="text-lg font-bold text-slate-900">
                  {selectedBloodGroup === 'O-' && 'Only O- (Universal Donor)'}
                  {selectedBloodGroup === 'O+' && 'O- and O+ Donors'}
                  {selectedBloodGroup === 'A-' && 'O- and A- Donors'}
                  {selectedBloodGroup === 'A+' && 'O-, O+, A-, and A+ Donors'}
                  {selectedBloodGroup === 'B-' && 'O- and B- Donors'}
                  {selectedBloodGroup === 'B+' && 'O-, O+, B-, and B+ Donors'}
                  {selectedBloodGroup === 'AB-' && 'O-, A-, B-, and AB- Donors'}
                  {selectedBloodGroup === 'AB+' && 'All 8 Blood Types (Universal Recipient)'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCompatModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
              >
                Open Full Matrix Guide
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Donate Blood? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                Community Impact
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                Why Should You Donate Blood on LifeLink?
              </h2>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                India and global healthcare systems require millions of blood units annually for surgery, accident victims, cancer patients, and thalassemia treatments.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  {
                    title: 'One Donation Saves up to 3 Lives',
                    desc: 'Your blood is separated into red cells, platelets, and plasma, helping three distinct patients.',
                  },
                  {
                    title: 'Stimulates Fresh Blood Cell Production',
                    desc: 'The body replenishes donated fluid within 24-48 hours and produces fresh healthy cells.',
                  },
                  {
                    title: 'Real-Time Emergency Geolocation Alerts',
                    desc: 'Only get notified when someone truly needs your specific blood group nearby—no spam.',
                  },
                  {
                    title: 'Transparent Digital Transfusion Tracking',
                    desc: 'Know exactly when your unit reaches the hospital and is administered.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/register">
                  <Button size="md" variant="primary" icon={UserPlus}>
                    Register as Life-Saving Donor Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-linear-to-br from-red-600 to-rose-700 text-white shadow-xl">
                  <h3 className="text-3xl font-black">450 ml</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-200 mt-1">
                    Standard Donation
                  </p>
                  <p className="text-xs text-white/90 mt-3 leading-relaxed">
                    Takes less than 15 minutes of your time and makes a lifelong difference to a family.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
                  <h3 className="text-3xl font-black">90 Days</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                    Safe Interval
                  </p>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Adults can safely donate whole blood every 3 months with complete physiological recovery.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-emerald-700 text-white shadow-xl">
                  <h3 className="text-3xl font-black">100%</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-200 mt-1">
                    Sterile & Safe
                  </p>
                  <p className="text-xs text-white/90 mt-3 leading-relaxed">
                    All hospital blood banks follow stringent single-use sterile protocols.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-indigo-700 text-white shadow-xl">
                  <h3 className="text-3xl font-black">24 / 7</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-200 mt-1">
                    Emergency Match
                  </p>
                  <p className="text-xs text-white/90 mt-3 leading-relaxed">
                    Automated donor alerts operate day and night during critical surgical traumas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Prominent Emergency CTA */}
      <section className="bg-linear-to-r from-red-700 via-rose-700 to-red-800 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 text-white mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Need Blood Urgently for a Loved One or Hospital?
          </h2>

          <p className="mt-3 text-base text-red-100 max-w-2xl mx-auto leading-relaxed">
            Do not lose precious time. Post an emergency blood request now to immediately notify compatible donors within minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/emergency-request">
              <button className="px-8 py-3.5 rounded-xl bg-white text-red-700 hover:bg-red-50 active:bg-red-100 font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all scale-105">
                Request Blood Now →
              </button>
            </Link>

            <Link to="/find-blood">
              <button className="px-6 py-3.5 rounded-xl bg-red-900/60 hover:bg-red-900 text-white font-bold text-sm border border-red-400/40 transition-colors">
                Search Blood Inventory
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Compatibility Modal */}
      <CompatibilityModal
        isOpen={compatModalOpen}
        onClose={() => setCompatModalOpen(false)}
      />
    </div>
  )
}

export default LandingPage
