import express from 'express'
import { initialDonors, compatibilityMatrix } from '../data/seedData.js'

const router = express.Router()

// In-memory store initialized with seed data
let donors = [...initialDonors]

// GET all donors with optional query filters
router.get('/', (req, res) => {
  const { bloodGroup, city, status, availableForEmergency } = req.query
  let results = [...donors]

  if (bloodGroup && bloodGroup !== 'All') {
    results = results.filter((d) => d.bloodGroup === bloodGroup)
  }
  if (city && city !== 'All') {
    results = results.filter((d) => d.city.toLowerCase() === city.toLowerCase())
  }
  if (status && status !== 'All') {
    results = results.filter((d) => d.status.toLowerCase() === status.toLowerCase())
  }
  if (availableForEmergency !== undefined) {
    const isAvail = availableForEmergency === 'true'
    results = results.filter((d) => d.availableForEmergency === isAvail)
  }

  res.json({ success: true, count: results.length, data: results })
})

// GET /match: Find matching donors for a blood request
router.get('/match', (req, res) => {
  const { bloodGroup, hospitalLocation } = req.query
  if (!bloodGroup) {
    return res.status(400).json({ success: false, message: 'bloodGroup query parameter is required' })
  }

  // Compatible donors who can donate to this recipient blood group
  const compatibleTypes = compatibilityMatrix[bloodGroup] || [bloodGroup]

  // Filter available donors with compatible types
  const matchingDonors = donors.filter(
    (d) => compatibleTypes.includes(d.bloodGroup) && d.status === 'Available' && d.availableForEmergency
  )

  // Sort by simulated distance
  const sorted = matchingDonors.map((d) => {
    // Generate realistic distance if not set
    const distanceKm = d.distanceKm || +(Math.random() * 5 + 1.2).toFixed(1)
    return {
      ...d,
      distanceKm,
      isExactMatch: d.bloodGroup === bloodGroup,
    }
  }).sort((a, b) => a.distanceKm - b.distanceKm)

  res.json({
    success: true,
    recipientBloodGroup: bloodGroup,
    compatibleBloodGroups: compatibleTypes,
    count: sorted.length,
    data: sorted,
  })
})

// POST: Register a new donor
router.post('/', (req, res) => {
  const {
    name,
    age,
    gender,
    bloodGroup,
    phone,
    email,
    city,
    area,
    lastDonationDate,
    availableForEmergency = true,
    healthConfirmed = true,
  } = req.body

  if (!name || !age || !bloodGroup || !phone || !email || !city) {
    return res.status(400).json({
      success: false,
      message: 'Name, age, bloodGroup, phone, email, and city are required fields.',
    })
  }

  if (Number(age) < 18) {
    return res.status(400).json({
      success: false,
      message: 'Donor must be at least 18 years old to be eligible for blood donation.',
    })
  }

  // Calculate eligibility based on last donation date (90 days interval)
  let status = 'Available'
  let statusReason = ''
  if (lastDonationDate) {
    const lastDate = new Date(lastDonationDate)
    const diffDays = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 3600 * 24))
    if (diffDays < 90) {
      status = 'Unavailable'
      statusReason = `Recent donation was ${diffDays} days ago (must wait ${90 - diffDays} more days).`
    }
  }

  const newId = `DON-${Math.floor(1000 + Math.random() * 9000)}`
  const newDonor = {
    id: newId,
    name,
    age: Number(age),
    gender: gender || 'Other',
    bloodGroup,
    phone,
    email,
    city,
    area: area || 'Central',
    lastDonationDate: lastDonationDate || '',
    availableForEmergency: Boolean(availableForEmergency),
    status,
    statusReason,
    healthConfirmed: Boolean(healthConfirmed),
    donationsCount: 0,
    distanceKm: +(Math.random() * 4 + 1.5).toFixed(1),
    verified: true,
    joinedDate: new Date().toISOString().split('T')[0],
  }

  donors.unshift(newDonor)
  res.status(201).json({
    success: true,
    message: 'Donor registered successfully! Status is set to Available.',
    data: newDonor,
  })
})

// PUT: Update donor details (availability, profile, etc.)
router.put('/:id', (req, res) => {
  const { id } = req.params
  const index = donors.findIndex((d) => d.id === id)

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Donor not found' })
  }

  donors[index] = { ...donors[index], ...req.body }
  res.json({ success: true, message: 'Donor profile updated successfully', data: donors[index] })
})

export default router
