import express from 'express'
import { initialNotifications } from '../data/seedData.js'

const router = express.Router()

let notifications = [...initialNotifications]

// Internal helper to push a notification
export const addInternalNotification = ({ type, title, message, requestId, bloodGroup, urgency = 'Normal' }) => {
  const notif = {
    id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
    type,
    title,
    message,
    requestId: requestId || null,
    bloodGroup: bloodGroup || 'All',
    timestamp: 'Just now',
    read: false,
    urgency,
  }
  notifications.unshift(notif)
  return notif
}

// GET all notifications
router.get('/', (req, res) => {
  const { unreadOnly } = req.query
  let list = [...notifications]
  if (unreadOnly === 'true') {
    list = list.filter((n) => !n.read)
  }
  res.json({
    success: true,
    count: list.length,
    unreadCount: notifications.filter((n) => !n.read).length,
    data: list,
  })
})

// POST: Trigger custom notification (e.g., "Send Alert" button on matching donor)
router.post('/', (req, res) => {
  const { type, title, message, requestId, bloodGroup, urgency } = req.body
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required.' })
  }

  const notif = addInternalNotification({
    type: type || 'emergency',
    title,
    message,
    requestId,
    bloodGroup,
    urgency: urgency || 'High',
  })

  res.status(201).json({ success: true, message: 'Notification dispatched', data: notif })
})

// PUT: Mark single notification as read
router.put('/:id/read', (req, res) => {
  const notif = notifications.find((n) => n.id === req.params.id)
  if (!notif) {
    return res.status(404).json({ success: false, message: 'Notification not found' })
  }
  notif.read = true
  res.json({ success: true, data: notif })
})

// PUT: Mark all as read
router.put('/read-all', (req, res) => {
  notifications = notifications.map((n) => ({ ...n, read: true }))
  res.json({ success: true, message: 'All notifications marked as read' })
})

// DELETE: Clear all notifications
router.delete('/clear', (req, res) => {
  notifications = []
  res.json({ success: true, message: 'Notifications cleared' })
})

export default router
