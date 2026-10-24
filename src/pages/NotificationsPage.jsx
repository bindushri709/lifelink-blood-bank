import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  AlertCircle,
  Users,
  Calendar,
  CheckCircle2,
  Trash2,
  CheckCheck,
  ArrowRight,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import StatusBadge from '../components/common/StatusBadge'
import { useApp } from '../context/AppContext'

export const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useApp()
  const navigate = useNavigate()

  const [filterType, setFilterType] = useState('All')

  const filteredNotifications = notifications.filter((n) => {
    if (filterType !== 'All' && n.type !== filterType) return false
    return true
  })

  const getNotifIcon = (type) => {
    switch (type) {
      case 'emergency':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'match':
        return <Users className="w-5 h-5 text-indigo-600" />
      case 'reminder':
        return <Calendar className="w-5 h-5 text-amber-600" />
      case 'accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      default:
        return <Bell className="w-5 h-5 text-slate-600" />
    }
  }

  const getNotifBg = (type) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-600'
      case 'match':
        return 'bg-indigo-100 text-indigo-600'
      case 'reminder':
        return 'bg-amber-100 text-amber-600'
      case 'accepted':
        return 'bg-emerald-100 text-emerald-600'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Alert Center
              </span>
              {unreadCount > 0 && (
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              System Notifications & Alerts
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Live updates regarding emergency broadcasts, nearby matching donors, and transfusion acceptance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                icon={CheckCheck}
                onClick={markAllNotificationsRead}
                className="text-xs"
              >
                Mark All Read
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              icon={Trash2}
              onClick={clearNotifications}
              className="text-xs text-slate-500 hover:text-red-600"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'emergency', 'match', 'reminder', 'accepted'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterType === t
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t === 'All' ? 'All Alerts' : t}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No notifications found</p>
              <p className="text-xs text-slate-400 mt-0.5">
                New alerts will appear here in real-time.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <Card
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id)
                  if (notif.requestId) {
                    navigate(`/match?reqId=${notif.requestId}`)
                  }
                }}
                className={`p-4 sm:p-5 transition-all cursor-pointer ${
                  !notif.read
                    ? 'border-red-300 bg-red-50/20 hover:border-red-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getNotifBg(
                      notif.type
                    )}`}
                  >
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={notif.urgency || 'Normal'} />
                        {notif.bloodGroup && notif.bloodGroup !== 'All' && (
                          <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                            Blood Group: {notif.bloodGroup}
                          </span>
                        )}
                      </div>

                      {notif.requestId && (
                        <span className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1">
                          View Request <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
