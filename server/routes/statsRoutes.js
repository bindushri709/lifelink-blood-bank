import express from 'express'
import { initialDonors, initialBloodInventory, initialRequests, initialHospitals } from '../data/seedData.js'

const router = express.Router()

router.get('/', (req, res) => {
  const totalUnits = initialBloodInventory.reduce((sum, b) => sum + b.units, 0)
  const activeEmergencies = initialRequests.filter(
    (r) => r.status === 'Donors Notified' || r.status === 'Pending'
  ).length
  const fulfilledRequests = initialRequests.filter((r) => r.status === 'Fulfilled').length

  // Blood group breakdown
  const bloodGroupDistribution = initialBloodInventory.map((b) => ({
    group: b.bloodGroup,
    units: b.units,
    status: b.status,
  }))

  res.json({
    success: true,
    data: {
      registeredDonors: 148, // Live baseline + mock pool
      activeDonors: 112,
      bloodUnitsAvailable: totalUnits + 65,
      emergencyRequests: initialRequests.length,
      activeEmergencies,
      livesConnected: fulfilledRequests * 3 + 240,
      registeredHospitals: initialHospitals.length + 8,
      bloodGroupDistribution,
    },
  })
})

export default router
