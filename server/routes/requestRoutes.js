import express from 'express'
import { initialRequests, compatibilityMatrix, initialDonors } from '../data/seedData.js'
import { addInternalNotification } from './notificationRoutes.js'

const router = express.Router()

// In-memory requests store
let requests = [...initialRequests]

// GET all requests
router.get('/', (req, res) => {
  const { status, urgency, bloodGroup, hospital } = req.query
  let results = [...requests]

  if (status && status !== 'All') {
    results = results.filter((r) => r.status.toLowerCase() === status.toLowerCase())
  }
  if (urgency && urgency !== 'All') {
    results = results.filter((r) => r.emergencyLevel.toLowerCase() === urgency.toLowerCase())
  }
  if (bloodGroup && bloodGroup !== 'All') {
    results = results.filter((r) => r.bloodGroup === bloodGroup)
  }
  if (hospital && hospital !== 'All') {
    results = results.filter((r) => r.hospital.toLowerCase().includes(hospital.toLowerCase()))
  }

  res.json({ success: true, count: results.length, data: results })
})

// GET single request by ID
router.get('/:id', (req, res) => {
  const request = requests.find((r) => r.id === req.params.id)
  if (!request) {
    return res.status(404).json({ success: false, message: 'Emergency request not found' })
  }
  res.json({ success: true, data: request })
})

// POST: Create a new emergency blood request
router.post('/', (req, res) => {
  const {
    patientName,
    bloodGroup,
    units,
    hospital,
    location,
    contactNumber,
    requiredBy,
    emergencyLevel = 'Critical',
    additionalInfo = '',
  } = req.body

  if (!patientName || !bloodGroup || !units || !hospital || !contactNumber) {
    return res.status(400).json({
      success: false,
      message: 'Patient name, blood group, units, hospital, and contact number are required.',
    })
  }

  const requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`
  const newRequest = {
    id: requestId,
    patientName,
    bloodGroup,
    units: Number(units),
    hospital,
    location: location || 'Bengaluru',
    contactNumber,
    requiredBy: requiredBy || 'Immediate (< 2 hours)',
    emergencyLevel,
    additionalInfo,
    status: 'Donors Notified',
    createdAt: new Date().toISOString(),
    assignedDonor: null,
  }

  requests.unshift(newRequest)

  // Dispatch emergency notification automatically
  addInternalNotification({
    type: 'emergency',
    title: `URGENT: ${bloodGroup} Blood Needed`,
    message: `${bloodGroup} blood (${units} units) urgently required at ${hospital} for patient ${patientName}.`,
    requestId: newRequest.id,
    bloodGroup: newRequest.bloodGroup,
    urgency: emergencyLevel,
  })

  res.status(201).json({
    success: true,
    message: 'Emergency request created successfully. Nearby donors have been notified.',
    data: newRequest,
  })
})

// PUT: Update request status or assign donor
router.put('/:id', (req, res) => {
  const { id } = req.params
  const index = requests.findIndex((r) => r.id === id)

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Request not found' })
  }

  const current = requests[index]
  const updated = { ...current, ...req.body }
  requests[index] = updated

  // If status changed to Donor Connected
  if (req.body.status === 'Donor Connected' && req.body.donorName) {
    addInternalNotification({
      type: 'accepted',
      title: 'Donor Accepted Request',
      message: `${req.body.donorName} accepted emergency request ${id} at ${current.hospital}.`,
      requestId: id,
      bloodGroup: current.bloodGroup,
      urgency: 'Normal',
    })
  }

  res.json({ success: true, message: 'Request updated successfully', data: updated })
})

export default router
