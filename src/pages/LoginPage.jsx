import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Droplet,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import Card from '../components/common/Card'
import { useApp } from '../context/AppContext'

export const LoginPage = () => {
  const { loginAs } = useApp()
  const navigate = useNavigate()

  const handleQuickLogin = (role) => {
    loginAs(role)
    if (role === 'donor') navigate('/donor-dashboard')
    else if (role === 'hospital') navigate('/hospital-dashboard')
    else if (role === 'admin') navigate('/admin-dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8">
        {/* Brand header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white mx-auto shadow-md shadow-red-200 mb-3">
            <Droplet className="w-7 h-7 fill-white text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Life<span className="text-red-600">Link</span> Portal Access
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Select a role to experience the prototype as a Donor, Hospital Blood Bank, or System Administrator.
          </p>
        </div>

        {/* 1-Click Demo Personas */}
        <Card className="p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Instant 1-Click Demo Profiles (Recommended)
            </h3>
          </div>

          <div className="space-y-3">
            {/* Donor Persona */}
            <button
              type="button"
              onClick={() => handleQuickLogin('donor')}
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-red-500 hover:bg-red-50/30 text-left transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                  🩸
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Ananya Sharma (Donor)
                    </h4>
                    <span className="text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      O+ Blood
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    View matching emergency requests, toggle availability, accept dispatches
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
            </button>

            {/* Hospital Persona */}
            <button
              type="button"
              onClick={() => handleQuickLogin('hospital')}
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 text-left transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                  🏥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      City Care Hospital
                    </h4>
                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      Hospital Transfusion Dept
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Create emergency blood requests, find donors, track transfusion statuses
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            {/* Admin Persona */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                  🛡️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      LifeLink Administrator
                    </h4>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Full System Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Analytics, blood inventory charts, donor verification, hospital network
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </button>
          </div>

          {/* Prototype Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Prototype mode active. No passwords or external authentication required for presentation.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
