import express from 'express'
import { initialBloodInventory } from '../data/seedData.js'

const router = express.Router()

let inventory = [...initialBloodInventory]

// GET full inventory
router.get('/', (req, res) => {
  const { bloodGroup, status } = req.query
  let list = [...inventory]

  if (bloodGroup && bloodGroup !== 'All') {
    list = list.filter((b) => b.bloodGroup === bloodGroup)
  }
  if (status && status !== 'All') {
    list = list.filter((b) => b.status.toLowerCase() === status.toLowerCase())
  }

  const totalUnits = list.reduce((acc, curr) => acc + curr.units, 0)

  res.json({
    success: true,
    totalUnits,
    count: list.length,
    data: list,
  })
})

// PUT: Update units for a specific blood group
router.put('/:bloodGroup', (req, res) => {
  const { bloodGroup } = req.params
  const { units, hospitalName } = req.body

  const item = inventory.find((b) => b.bloodGroup === bloodGroup)
  if (!item) {
    return res.status(404).json({ success: false, message: 'Blood group not found' })
  }

  const newUnits = Number(units)
  item.units = newUnits
  item.lastUpdated = 'Just now'

  // Dynamic status evaluation
  if (newUnits <= 0) {
    item.status = 'Unavailable'
  } else if (newUnits <= 4) {
    item.status = 'Low Stock'
  } else {
    item.status = 'Available'
  }

  res.json({ success: true, message: `Blood group ${bloodGroup} updated`, data: item })
})

export default router
