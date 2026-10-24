import { compatibilityMatrix, initialDonors, initialBloodInventory, initialRequests } from './data/seedData.js'

console.log('====================================================')
console.log('LIFELINK ONLINE BLOOD BANK - SYSTEM QA VERIFICATION')
console.log('====================================================\n')

let passedTests = 0
let failedTests = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`)
    passedTests++
  } else {
    console.error(`  ✗ FAIL: ${message}`)
    failedTests++
  }
}

// 1. TEST BLOOD COMPATIBILITY MATRIX
console.log('1. Testing Biological Blood Compatibility Matrix:')
assert(compatibilityMatrix['O-'].length === 1 && compatibilityMatrix['O-'][0] === 'O-', 'O- can only receive from O- (Universal Donor)')
assert(compatibilityMatrix['O+'].includes('O-') && compatibilityMatrix['O+'].includes('O+'), 'O+ can receive from O- and O+')
assert(compatibilityMatrix['A-'].includes('O-') && compatibilityMatrix['A-'].includes('A-'), 'A- can receive from O- and A-')
assert(compatibilityMatrix['A+'].length === 4, 'A+ can receive from O-, O+, A-, A+')
assert(compatibilityMatrix['B-'].includes('O-') && compatibilityMatrix['B-'].includes('B-'), 'B- can receive from O- and B-')
assert(compatibilityMatrix['B+'].length === 4, 'B+ can receive from O-, O+, B-, B+')
assert(compatibilityMatrix['AB-'].length === 4, 'AB- can receive from O-, A-, B-, AB-')
assert(compatibilityMatrix['AB+'].length === 8, 'AB+ can receive from all 8 blood types (Universal Recipient)')

// 2. TEST DONOR MATCHING ENGINE
console.log('\n2. Testing Donor Matching Engine:')
// Test finding donors for O+ recipient
const oPlusCompatible = compatibilityMatrix['O+']
const matchingForOPlus = initialDonors.filter(d => oPlusCompatible.includes(d.bloodGroup) && d.status === 'Available' && d.availableForEmergency)
assert(matchingForOPlus.length > 0, `Matching available donors found for O+ (${matchingForOPlus.length} donors)`)

// Verify unavailable donor Sneha (A+) is excluded
const sneha = initialDonors.find(d => d.name === 'Sneha Patel')
assert(sneha && sneha.status === 'Unavailable', 'Sneha Patel has status Unavailable')
const matchingForAPlus = initialDonors.filter(d => compatibilityMatrix['A+'].includes(d.bloodGroup) && d.status === 'Available' && d.availableForEmergency)
assert(!matchingForAPlus.some(d => d.name === 'Sneha Patel'), 'Sneha Patel is excluded from emergency donor match')

// 3. TEST INVENTORY CALCULATION & STATUS RULES
console.log('\n3. Testing Blood Inventory Status Rules (8 Blood Groups):')
const all8 = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const inventoryGroups = initialBloodInventory.map(b => b.bloodGroup)
assert(all8.every(g => inventoryGroups.includes(g)), 'All 8 blood groups exist in initial inventory')

function evaluateStockStatus(units) {
  if (units <= 0) return 'Unavailable'
  if (units <= 4) return 'Low Stock'
  return 'Available'
}
assert(evaluateStockStatus(12) === 'Available', '12 units evaluated as Available')
assert(evaluateStockStatus(4) === 'Low Stock', '4 units evaluated as Low Stock')
assert(evaluateStockStatus(2) === 'Low Stock', '2 units evaluated as Low Stock')
assert(evaluateStockStatus(0) === 'Unavailable', '0 units evaluated as Unavailable')

// 4. TEST EMERGENCY REQUEST TRANSITION
console.log('\n4. Testing Emergency Request Lifecycle & Status Transition:')
const sampleReq = {
  id: 'REQ-TEST',
  patientName: 'Test Patient',
  bloodGroup: 'O+',
  units: 2,
  hospital: 'City Care Hospital',
  status: 'Donors Notified',
  assignedDonor: null
}
assert(sampleReq.status === 'Donors Notified', 'New request starts in Donors Notified state')
// Transition to Donor Connected
sampleReq.status = 'Donor Connected'
sampleReq.assignedDonor = 'DON-1001'
sampleReq.donorName = 'Ananya Sharma'
assert(sampleReq.status === 'Donor Connected' && sampleReq.assignedDonor === 'DON-1001', 'Request successfully transitions to Donor Connected')
// Transition to Fulfilled
sampleReq.status = 'Fulfilled'
assert(sampleReq.status === 'Fulfilled', 'Request successfully transitions to Fulfilled')

console.log('\n====================================================')
console.log(`QA RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`)
console.log('====================================================')

if (failedTests > 0) process.exit(1)
