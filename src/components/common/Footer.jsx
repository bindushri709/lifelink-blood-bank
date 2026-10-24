import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Droplet, PhoneCall, ShieldAlert, Heart, ExternalLink, HelpCircle } from 'lucide-react'
import CompatibilityModal from './CompatibilityModal'

export const Footer = () => {
  const [compatModalOpen, setCompatModalOpen] = useState(false)

  return (
    <>
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
                  <Droplet className="w-5 h-5 fill-white text-white" />
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Life<span className="text-red-500">Link</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
                LifeLink is an intelligent blood bank and emergency donor management platform
                connecting hospitals, donors, and critically ill patients when every second counts.
              </p>

              {/* Emergency Hotline Box */}
              <div className="mt-6 p-4 rounded-2xl bg-red-950/40 border border-red-900/50 flex items-center gap-3.5 max-w-sm">
                <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase font-extrabold tracking-wider text-red-400">
                    24/7 Emergency Blood Helpline
                  </p>
                  <p className="text-lg font-black text-white tracking-tight">
                    108 <span className="text-xs font-normal text-slate-400">/ 104 (Toll Free)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/find-blood" className="hover:text-red-400 transition-colors">
                    Find Blood Availability
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-red-400 transition-colors">
                    Become a Donor
                  </Link>
                </li>
                <li>
                  <Link to="/emergency-request" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                    Emergency Blood Request
                  </Link>
                </li>
                <li>
                  <Link to="/match" className="hover:text-red-400 transition-colors">
                    Donor Matching Engine
                  </Link>
                </li>
                <li>
                  <Link to="/inventory" className="hover:text-red-400 transition-colors">
                    Live Blood Inventory
                  </Link>
                </li>
              </ul>
            </div>

            {/* Dashboards */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Portals</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/donor-dashboard" className="hover:text-red-400 transition-colors">
                    Donor Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/hospital-dashboard" className="hover:text-red-400 transition-colors">
                    Hospital Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin-dashboard" className="hover:text-red-400 transition-colors">
                    Admin Analytics
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-red-400 transition-colors">
                    Role Switcher / Login
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setCompatModalOpen(true)}
                    className="text-left text-slate-300 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    Compatibility Matrix <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Eligibility & Info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/about" className="hover:text-red-400 transition-colors">
                    About LifeLink
                  </Link>
                </li>
                <li>
                  <Link to="/about#eligibility" className="hover:text-red-400 transition-colors">
                    Donation Eligibility
                  </Link>
                </li>
                <li>
                  <Link to="/about#faq" className="hover:text-red-400 transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.who.int/campaigns/world-blood-donor-day"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400 transition-colors inline-flex items-center gap-1 text-slate-400"
                  >
                    WHO Blood Guidelines <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Prototype Disclaimer */}
          <div className="mt-12 pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>Academic Prototype Notice:</strong> LifeLink is built for demonstration
                and project presentation. Actual clinical blood transfusion requires medical
                supervision and screening by licensed blood banks.
              </span>
            </div>
            <p className="shrink-0">
              © {new Date().getFullYear()} LifeLink. Every Drop Can Save a Life.
            </p>
          </div>
        </div>
      </footer>

      {/* Compatibility Matrix Modal */}
      <CompatibilityModal
        isOpen={compatModalOpen}
        onClose={() => setCompatModalOpen(false)}
      />
    </>
  )
}

export default Footer
