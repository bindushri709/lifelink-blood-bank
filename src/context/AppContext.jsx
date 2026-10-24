import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  initialDonors,
  initialHospitals,
  initialBloodInventory,
  initialRequests,
  initialNotifications,
  compatibilityMatrix,
  donorGivesToMatrix,
} from '../data/mockData.js'
import { api } from '../services/api.js'

const AppContext = createContext(null)

const STORAGE_KEYS = {
  DONORS: 'lifelink_donors',
  REQUESTS: 'lifelink_requests',
  INVENTORY: 'lifelink_inventory',
  NOTIFICATIONS: 'lifelink_notifications',
  USER: 'lifelink_current_user',
}

export const AppProvider = ({ children }) => {
  // 1. Current logged-in user / role
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        // fallback
      }
    }
    // Default demo persona: Ananya Sharma (Donor)
    return {
      role: 'donor',
      id: 'DON-1001',
      name: 'Ananya Sharma',
      bloodGroup: 'O+',
      phone: '+91 98765 43210',
      email: 'ananya.sharma@example.com',
      city: 'Bengaluru',
      area: 'Koramangala',
      status: 'Available',
      availableForEmergency: true,
      donationsCount: 6,
      lastDonationDate: '2024-08-15',
    }
  })

  // 2. Core collections
  const [donors, setDonors] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DONORS)
    return saved ? JSON.parse(saved) : initialDonors
  })

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS)
    return saved ? JSON.parse(saved) : initialRequests
  })

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY)
    return saved ? JSON.parse(saved) : initialBloodInventory
  })

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
    return saved ? JSON.parse(saved) : initialNotifications
  })

  const [hospitals] = useState(initialHospitals)

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser))
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors))
  }, [donors])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
  }, [requests])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory))
  }, [inventory])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
  }, [notifications])

  // Try sync with API on mount
  useEffect(() => {
    const syncBackend = async () => {
      const donorsRes = await api.getDonors()
      if (donorsRes?.data?.length) {
        setDonors(donorsRes.data)
      }
      const requestsRes = await api.getRequests()
      if (requestsRes?.data?.length) {
        setRequests(requestsRes.data)
      }
      const bloodRes = await api.getBloodInventory()
      if (bloodRes?.data?.length) {
        setInventory(bloodRes.data)
      }
      const notifRes = await api.getNotifications()
      if (notifRes?.data?.length) {
        setNotifications(notifRes.data)
      }
    }
    syncBackend()
  }, [])

  // Switch role / login
  const loginAs = (role, customData = {}) => {
    let profile = { role }

    if (role === 'donor') {
      const match = donors.find((d) => d.id === customData.id) || donors[0]
      profile = {
        role: 'donor',
        ...match,
        ...customData,
      }
    } else if (role === 'hospital') {
      const match = hospitals[0]
      profile = {
        role: 'hospital',
        id: match.id,
        name: match.name,
        city: match.city,
        area: match.area,
        bloodBankHead: match.bloodBankHead,
        phone: match.phone,
        ...customData,
      }
    } else if (role === 'admin') {
      profile = {
        role: 'admin',
        id: 'ADMIN-01',
        name: 'LifeLink Admin',
        email: 'admin@lifelink.org',
        department: 'Karnataka State Blood Transfusion Council',
        ...customData,
      }
    } else {
      profile = { role: 'guest', name: 'Guest User' }
    }

    setCurrentUser(profile)
    return profile
  }

  // Register donor
  const registerDonor = async (donorData) => {
    const age = Number(donorData.age)
    if (age < 18) {
      throw new Error('Donor must be at least 18 years old.')
    }

    // Check donation date cooldown (90 days)
    let status = 'Available'
    let statusReason = ''
    if (donorData.lastDonationDate) {
      const last = new Date(donorData.lastDonationDate)
      const diff = Math.floor((Date.now() - last.getTime()) / (1000 * 3600 * 24))
      if (diff < 90) {
        status = 'Unavailable'
        statusReason = `Recent donation was ${diff} days ago. Mandatory 90-day waiting period active.`
      }
    }

    const newId = `DON-${Math.floor(1000 + Math.random() * 9000)}`
    const newDonor = {
      id: newId,
      name: donorData.name,
      age,
      gender: donorData.gender || 'Not specified',
      bloodGroup: donorData.bloodGroup,
      phone: donorData.phone,
      email: donorData.email,
      city: donorData.city || 'Bengaluru',
      area: donorData.area || 'Central',
      lastDonationDate: donorData.lastDonationDate || '',
      availableForEmergency: donorData.availableForEmergency !== false,
      status,
      statusReason,
      healthConfirmed: Boolean(donorData.healthConfirmed),
      donationsCount: 0,
      distanceKm: +(Math.random() * 3.5 + 1.2).toFixed(1),
      verified: true,
      joinedDate: new Date().toISOString().split('T')[0],
    }

    setDonors((prev) => [newDonor, ...prev])

    // Try API
    api.createDonor(newDonor)

    // Notify
    addNotification({
      type: 'reminder',
      title: 'Donor Registration Confirmed',
      message: `Welcome ${newDonor.name}! Your donor profile (${newDonor.bloodGroup}) is now active on LifeLink.`,
      bloodGroup: newDonor.bloodGroup,
      urgency: 'Normal',
    })

    // Set as active user
    setCurrentUser({
      role: 'donor',
      ...newDonor,
    })

    return newDonor
  }

  // Update donor profile or emergency toggle
  const updateDonor = (id, updates) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    )
    if (currentUser?.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updates }))
    }
    api.updateDonor(id, updates)
  }

  // Create Emergency Request
  const createEmergencyRequest = async (formData) => {
    const newId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`
    const newReq = {
      id: newId,
      patientName: formData.patientName,
      bloodGroup: formData.bloodGroup,
      units: Number(formData.units || 1),
      hospital: formData.hospital,
      location: formData.location || 'Bengaluru',
      contactNumber: formData.contactNumber,
      requiredBy: formData.requiredBy || 'Immediate (< 2 hours)',
      emergencyLevel: formData.emergencyLevel || 'Critical',
      additionalInfo: formData.additionalInfo || '',
      status: 'Donors Notified',
      createdAt: new Date().toISOString(),
      assignedDonor: null,
    }

    setRequests((prev) => [newReq, ...prev])

    // API
    api.createRequest(newReq)

    // Automatic push notification
    addNotification({
      type: 'emergency',
      title: `URGENT: ${newReq.bloodGroup} Blood Needed`,
      message: `${newReq.bloodGroup} blood (${newReq.units} units) urgently required at ${newReq.hospital} for patient ${newReq.patientName}.`,
      requestId: newReq.id,
      bloodGroup: newReq.bloodGroup,
      urgency: newReq.emergencyLevel,
    })

    return newReq
  }

  // Update Request Status
  const updateRequestStatus = (id, newStatus, extraData = {}) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, status: newStatus, ...extraData }
          return updated
        }
        return r
      })
    )

    api.updateRequest(id, { status: newStatus, ...extraData })

    if (newStatus === 'Donor Connected' && extraData.donorName) {
      addNotification({
        type: 'accepted',
        title: 'Donor Connected to Emergency',
        message: `${extraData.donorName} accepted emergency request ${id}. Contact initiated!`,
        requestId: id,
        urgency: 'Normal',
      })
    }
  }

  // Donor accepts emergency request
  const acceptEmergencyRequest = (requestId, donorId, donorName) => {
    updateRequestStatus(requestId, 'Donor Connected', {
      assignedDonor: donorId,
      donorName: donorName || currentUser?.name || 'LifeLink Donor',
    })
  }

  // Matching algorithm
  const findMatchingDonors = (bloodGroup, hospitalLocation = '', options = {}) => {
    if (!bloodGroup) return []
    const compatibleGroups = compatibilityMatrix[bloodGroup] || [bloodGroup]

    return donors
      .filter((d) => {
        if (!compatibleGroups.includes(d.bloodGroup)) return false
        if (options.onlyAvailable !== false) {
          if (d.status !== 'Available' || !d.availableForEmergency) return false
        }
        return true
      })
      .map((d) => ({
        ...d,
        distanceKm: d.distanceKm || +(Math.random() * 4 + 1.2).toFixed(1),
        isExactMatch: d.bloodGroup === bloodGroup,
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
  }

  // Notifications helpers
  const addNotification = (notif) => {
    const item = {
      id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
      read: false,
      urgency: 'Normal',
      ...notif,
    }
    setNotifications((prev) => [item, ...prev])
    api.createNotification(item)
    return item
  }

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    api.markNotificationRead(id)
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    api.markAllNotificationsRead()
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  // Inventory update
  const updateInventoryStock = (bloodGroup, units) => {
    const numUnits = Number(units)
    let status = 'Available'
    if (numUnits <= 0) status = 'Unavailable'
    else if (numUnits <= 4) status = 'Low Stock'

    setInventory((prev) =>
      prev.map((b) =>
        b.bloodGroup === bloodGroup
          ? { ...b, units: numUnits, status, lastUpdated: 'Just now' }
          : b
      )
    )
    api.updateBloodInventory(bloodGroup, numUnits)
  }

  // Reset to initial demo state
  const resetDemoData = () => {
    setDonors(initialDonors)
    setRequests(initialRequests)
    setInventory(initialBloodInventory)
    setNotifications(initialNotifications)
    loginAs('donor', { id: 'DON-1001' })
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const activeEmergencyRequests = requests.filter(
    (r) => r.status === 'Donors Notified' || r.status === 'Pending'
  )

  return (
    <AppContext.Provider
      value={{
        currentUser,
        loginAs,
        donors,
        requests,
        inventory,
        notifications,
        hospitals,
        unreadCount,
        activeEmergencyRequests,
        registerDonor,
        updateDonor,
        createEmergencyRequest,
        updateRequestStatus,
        acceptEmergencyRequest,
        findMatchingDonors,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        updateInventoryStock,
        resetDemoData,
        compatibilityMatrix,
        donorGivesToMatrix,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
