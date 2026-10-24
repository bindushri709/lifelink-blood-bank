import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Droplet,
  Bell,
  Menu,
  X,
  AlertCircle,
  UserCheck,
  Building2,
  Shield,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const Navbar = () => {
  const { currentUser, loginAs, notifications, unreadCount, markNotificationRead, markAllNotificationsRead } =
    useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false)

  const notifRef = useRef(null)
  const roleRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false)
      }
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setRoleSwitcherOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setNotifDropdownOpen(false)
    setRoleSwitcherOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Blood', path: '/find-blood' },
    { name: 'Become a Donor', path: '/register' },
    { name: 'Donor Matching', path: '/match' },
    { name: 'Hospitals', path: '/hospitals' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'About', path: '/about' },
  ]

  const handleRoleSelect = (role) => {
    loginAs(role)
    setRoleSwitcherOpen(false)
    if (role === 'donor') navigate('/donor-dashboard')
    else if (role === 'hospital') navigate('/hospital-dashboard')
    else if (role === 'admin') navigate('/admin-dashboard')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* LifeLink Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-200 group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Life<span className="text-red-600">Link</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Online Blood Bank & Emergency Matching
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-red-600 bg-red-50/70 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Emergency Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* High Visibility Emergency CTA */}
            <Link
              to="/emergency-request"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-md shadow-red-200 transition-all hover:scale-[1.02] animate-emergency"
            >
              <AlertCircle className="w-4 h-4 fill-white text-red-600" />
              <span>Emergency Request</span>
            </Link>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifDropdownOpen((prev) => !prev)}
                aria-label="View notifications"
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white px-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                      <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 px-2 py-1">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id)
                            if (n.requestId) navigate(`/match?reqId=${n.requestId}`)
                          }}
                          className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                            !n.read ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                              {n.title}
                            </h5>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 px-4 border-t border-slate-100 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                    >
                      View all notifications <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill for Demo / Hackathon Presentation */}
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setRoleSwitcherOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                  {currentUser.role === 'donor' && '🩸'}
                  {currentUser.role === 'hospital' && '🏥'}
                  {currentUser.role === 'admin' && '🛡️'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="font-bold text-slate-900 block leading-tight">
                    {currentUser.role === 'donor' && (currentUser.name || 'Donor')}
                    {currentUser.role === 'hospital' && (currentUser.name || 'City Care Hosp.')}
                    {currentUser.role === 'admin' && 'Admin Portal'}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">{currentUser.role} View</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switch Dropdown */}
              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role (Demo Mode)
                    </p>
                  </div>

                  <button
                    onClick={() => handleRoleSelect('donor')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.role === 'donor'
                        ? 'bg-red-50 text-red-700 font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="font-semibold">Donor: Ananya Sharma</p>
                      <p className="text-[10px] text-slate-500">O+ Blood | Available</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('hospital')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.role === 'hospital'
                        ? 'bg-red-50 text-red-700 font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="font-semibold">Hospital: City Care</p>
                      <p className="text-[10px] text-slate-500">Manage Blood Requests</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.role === 'admin'
                        ? 'bg-red-50 text-red-700 font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold">System Administrator</p>
                      <p className="text-[10px] text-slate-500">Full Analytics & Controls</p>
                    </div>
                  </button>

                  <div className="pt-2 mt-1 border-t border-slate-100">
                    <Link
                      to="/login"
                      onClick={() => setRoleSwitcherOpen(false)}
                      className="block text-center text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
                    >
                      Login Selection Page →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-1 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive(link.path)
                    ? 'text-red-600 bg-red-50 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-slate-100">
              <p className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Dashboards
              </p>
              <Link
                to="/donor-dashboard"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                Donor Dashboard
              </Link>
              <Link
                to="/hospital-dashboard"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                Hospital Dashboard
              </Link>
              <Link
                to="/admin-dashboard"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
