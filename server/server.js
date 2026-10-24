import express from 'express'
import cors from 'cors'
import donorRoutes from './routes/donorRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import bloodRoutes from './routes/bloodRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import statsRoutes from './routes/statsRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'LifeLink - Online Blood Bank & Donor Management System',
    timestamp: new Date().toISOString(),
  })
})

// Mount API routes
app.use('/api/donors', donorRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/blood', bloodRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/stats', statsRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error', details: err.message })
})

app.listen(PORT, () => {
  console.log(`[LifeLink Backend] API Server listening on port ${PORT}`)
})
