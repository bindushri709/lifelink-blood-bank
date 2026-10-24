// API Service with seamless fallback to localStorage

const API_BASE = '/api'

const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `HTTP error ${res.status}`)
    }
    return await res.json()
  } catch (error) {
    // If backend is not reached or returns error, pass through error for local fallback
    console.warn(`[LifeLink API] ${endpoint} fetch issue, falling back to local store:`, error.message)
    return null
  }
}

export const api = {
  // Donors
  getDonors: (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/donors${query}`)
  },
  getMatchingDonors: (bloodGroup, hospitalLocation) => {
    return request(`/donors/match?bloodGroup=${encodeURIComponent(bloodGroup)}&hospitalLocation=${encodeURIComponent(hospitalLocation || '')}`)
  },
  createDonor: (donorData) => {
    return request('/donors', {
      method: 'POST',
      body: JSON.stringify(donorData),
    })
  },
  updateDonor: (id, updates) => {
    return request(`/donors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  // Requests
  getRequests: (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/requests${query}`)
  },
  createRequest: (requestData) => {
    return request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  },
  updateRequest: (id, updates) => {
    return request(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  // Blood Inventory
  getBloodInventory: () => request('/blood'),
  updateBloodInventory: (bloodGroup, units) => {
    return request(`/blood/${bloodGroup}`, {
      method: 'PUT',
      body: JSON.stringify({ units }),
    })
  },

  // Notifications
  getNotifications: (unreadOnly = false) => request(`/notifications?unreadOnly=${unreadOnly}`),
  createNotification: (notifData) => {
    return request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notifData),
    })
  },
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Stats
  getStats: () => request('/stats'),
}
