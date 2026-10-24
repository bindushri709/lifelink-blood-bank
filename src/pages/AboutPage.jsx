import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Droplet,
  Heart,
  ShieldCheck,
  Users,
  ChevronDown,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import CompatibilityModal from '../components/common/CompatibilityModal'

export const AboutPage = () => {
  const [compatModalOpen, setCompatModalOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      q: 'Who is eligible to donate blood on LifeLink?',
      a: 'Any healthy individual between 18 and 65 years old, weighing at least 45 kg, with hemoglobin level ≥ 12.5 g/dL and no active chronic infection or recent surgery/tattoos within the past 6 months.',
    },
    {
      q: 'How frequently can I donate blood?',
      a: 'Healthy male donors can donate whole blood every 90 days (3 months), while female donors can safely donate every 120 days (4 months). Platelet apheresis donations can be performed more frequently (every 14 days) under physician guidance.',
    },
    {
      q: 'Is donating blood safe? Does it weaken the immune system?',
      a: 'Completely safe. All blood collection uses 100% single-use sterile disposable equipment. Your body replaces the fluid volume within 24 to 48 hours and produces new red blood cells within several weeks.',
    },
    {
      q: 'How does the LifeLink Emergency Matching algorithm work?',
      a: 'When an emergency request is logged by a hospital or patient, LifeLink runs an instant biological compatibility check (matching compatible ABO and Rh antigens) and filters available donors within a 10 km geographic radius, ranking them by distance.',
    },
    {
      q: 'Is donor contact information public?',
      a: 'No. To protect citizen privacy, LifeLink masks phone numbers by default. Direct contact is facilitated through authenticated emergency alerts or secured hospital dispatch protocols.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 mb-3">
            <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
            Empowering Emergency Healthcare
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            About LifeLink – Online Blood Bank & Donor Network
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            LifeLink bridges the critical gap between voluntary blood donors, trauma centers, and critically ill patients during life-or-death emergencies.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
              <Droplet className="w-6 h-6 fill-red-600" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Zero Transfusion Delay</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Every year, thousands of patients in trauma accidents and labor complications suffer because family members waste crucial hours calling blood banks. LifeLink matches nearby compatible donors in seconds.
            </p>
          </Card>

          <Card className="p-6 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">100% Voluntary & Free</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              LifeLink promotes ethical, voluntary, uncompensated blood donation aligned with National Blood Transfusion Council (NBTC) and World Health Organization (WHO) standards.
            </p>
          </Card>

          <Card className="p-6 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Community Driven</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Designed as a modern collaborative platform empowering colleges, tech parks, and residential societies to mobilize when blood shortages arise in urban and rural centers.
            </p>
          </Card>
        </div>

        {/* Eligibility Criteria Matrix */}
        <div id="eligibility" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              Medical Screening
            </span>
            <h2 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              Clinical Blood Donation Eligibility Guidelines
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Check your eligibility before visiting the hospital collection center.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">Age & Weight</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>• Age: 18 – 65 years</li>
                <li>• Weight: ≥ 45 kg (≥ 100 lbs)</li>
                <li>• Pulse: 60 to 100 bpm regular</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">Hemoglobin & BP</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>• Hb: ≥ 12.5 g/dL</li>
                <li>• Systolic: 100–140 mmHg</li>
                <li>• Diastolic: 60–90 mmHg</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">Waiting Intervals</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>• Whole blood: 90 days gap</li>
                <li>• Dental work: 72 hours</li>
                <li>• Tattoo/piercing: 6 months</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">General Health</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>• No fever or infection</li>
                <li>• No major surgery in 6 months</li>
                <li>• Alcohol-free for 24 hours</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Curious about which blood types you can donate to or receive from?
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCompatModalOpen(true)}
              className="text-xs font-bold"
            >
              Open Blood Compatibility Guide →
            </Button>
          </div>
        </div>

        {/* FAQs */}
        <div id="faq" className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Common questions from donors, patients, and hospital coordinators.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="p-5 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </div>
                {openFaq === idx && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Presentation & Academic Credits Callout */}
        <Card className="p-8 bg-linear-to-r from-slate-900 to-slate-950 text-white border-0 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Academic Project Demonstration
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1">
                LifeLink: Full Working Prototype
              </h3>
              <p className="mt-2 text-xs text-slate-300 max-w-xl leading-relaxed">
                Developed as a comprehensive healthcare platform featuring complete state synchronization, real-time emergency matching, interactive role management, and clean RESTful backend APIs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/register">
                <Button size="md" variant="primary" className="text-xs w-full sm:w-auto">
                  Register as Donor
                </Button>
              </Link>
              <Link to="/emergency-request">
                <Button size="md" variant="emergency" className="text-xs w-full sm:w-auto">
                  Emergency Request
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <CompatibilityModal
        isOpen={compatModalOpen}
        onClose={() => setCompatModalOpen(false)}
      />
    </div>
  )
}

export default AboutPage
