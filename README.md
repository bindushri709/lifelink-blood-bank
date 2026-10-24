# LifeLink – Online Blood Bank & Donor Management System

> **"Every Drop Can Save a Life."**  
> A modern web platform connecting voluntary blood donors, patients, hospitals, and blood banks when every minute matters.

---

## 🌟 Overview & Problem Statement

Finding blood donors during emergencies is often time-consuming, fragmented, and stressful. Families and medical staff frequently waste critical hours calling blood banks and personal contacts while trauma or surgical patients wait.

**LifeLink** solves this emergency bottleneck with:
- **Instant Emergency Blood Request Broadcasting**: Rapid intake of patient details, blood group, units, and urgency level.
- **Intelligent Donor Matching**: Automatic filtering by biological blood compatibility (ABO & Rh factor) and proximity distance ranking.
- **Real-Time Status Synchronization**: Complete transfusion lifecycle from `Pending` → `Donors Notified` → `Donor Connected` → `Fulfilled`.
- **Role-Based Portals**: Dedicated views for voluntary Donors, Hospital Blood Banks, and Healthcare Administrators.
- **Live Blood Inventory**: 8 blood group tracking (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) with hospital-by-hospital breakdown.
- **Privacy Protection**: Automatic phone masking to safeguard citizen donor data.

---

## 🚀 Quick Start & How to Run

### 1. Prerequisites
- **Node.js** (v18+ recommended, tested on Node v24)
- **npm** (v9+)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Complete Application
Run both the **Express API Backend (Port 5000)** and **Vite React Frontend (Port 5173)** simultaneously with a single command:

```bash
npm run dev
```

Then open your browser at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

### Alternative Run Modes:
- **Run Frontend Only**: `npm run client`
- **Run Backend API Only**: `npm run server`
- **Run Automated QA Tests**: `npm test`
- **Production Build**: `npm run build`
- **Preview Production Build**: `npm run preview`

---

## 🎭 1-Click Role Switcher (For Demo & Hackathon Presentation)

In the top navigation bar, click the **Role Switcher** pill on the right side to switch between personas instantly with zero re-login hassle:

1. **🩸 Donor: Ananya Sharma**
   - Blood Group: `O+`
   - Dashboard with emergency requests, donation history, and availability toggle.
2. **🏥 Hospital: City Care Hospital**
   - Transfusion coordination table, status updates, and emergency request dispatch.
3. **🛡️ System Administrator**
   - Live KPI cards, visual SVG blood distribution charts, donor verification, and system controls.

---

## 🎬 End-to-End Hackathon Demonstration Flow

Follow this presentation sequence to demonstrate the entire lifecycle in under 3 minutes:

1. **Landing Page (`/`)**:
   - Show the hero banner, live statistics counters, 4-step workflow, and interactive blood compatibility widget.
   - Click the top emergency alert banner or **"Emergency Request"** button.

2. **Register as a Donor (`/register`)**:
   - Fill out the form with age 18+, blood group (e.g. `O+`), locality, and confirm health eligibility.
   - Click **"Complete Donor Registration"** → Notice the assigned Donor ID (`DON-XXXX`) and immediate status set to **Available**.
   - Click **"Go to Donor Dashboard"**.

3. **Donor Dashboard (`/donor-dashboard`)**:
   - Review personalized cards: Blood Group, Live Status, Last Donation, and Next Safe Donation Date.
   - Test toggling **"Available for Emergency Requests"** on/off.
   - Inspect **"Nearby Requests"** matched specifically to your blood type.

4. **Create an Emergency Blood Request (`/emergency-request`)**:
   - Create a request for Patient *Kavita Menon* requiring `O+` blood at *City Care Hospital* (Critical urgency).
   - Click **"Broadcast Emergency Request"**.
   - Notice the animated **"Searching for matching donors nearby..."** state.
   - Watch the system return ranked compatible donors with simulated distance (e.g., 2.4 km).
   - Click **"Send Alert"** or **"Contact Donor"** to test the direct call/SMS simulation dialog.

5. **Search Blood Availability (`/find-blood`)**:
   - Filter by blood group, area, and required units.
   - Notice live statuses: `Available`, `Low Stock`, and `Unavailable`.

6. **Accept Request & Hospital Dashboard Sync (`/hospital-dashboard`)**:
   - In Donor Dashboard or Hospital Dashboard, mark request as **"Donor Connected"** or click **"Accept Request"**.
   - Watch the request status update to **Donor Connected** with the donor's name assigned!
   - Observe the notification counter badge update in the top navigation bar.

7. **Blood Inventory Audit (`/inventory`)**:
   - View all 8 blood groups with hospital breakdown.
   - Click **"Update Units"** to simulate fresh blood unit deposits or withdrawals.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 (Vite 8) |
| **Styling** | Tailwind CSS v4, Modern Healthcare Palette |
| **Icons** | Lucide React |
| **Routing** | React Router v7 (`react-router-dom`) |
| **Backend Server** | Node.js + Express 5 (REST APIs) |
| **Data Persistence** | Dual-Layer: Express REST APIs + `localStorage` client fallback |
| **Development Tooling** | Concurrently |

---

## 📂 Project Architecture

```
blood-bank/
├── server/                        # Express Backend
│   ├── server.js                  # Express API Server (Port 5000)
│   ├── data/
│   │   └── seedData.js            # Initial mock DB & compatibility matrices
│   └── routes/
│       ├── donorRoutes.js         # GET, POST, PUT /api/donors, /api/donors/match
│       ├── requestRoutes.js       # GET, POST, PUT /api/requests
│       ├── bloodRoutes.js         # GET, PUT /api/blood
│       ├── notificationRoutes.js  # GET, POST, PUT /api/notifications
│       └── statsRoutes.js         # GET /api/stats
├── src/                           # React Frontend
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx         # Navigation, emergency badge, role switcher
│   │   │   ├── EmergencyAlertBanner.jsx # Top critical banner
│   │   │   ├── BloodGroupBadge.jsx# Pill badge
│   │   │   ├── StatusBadge.jsx    # Status indicators
│   │   │   ├── Card.jsx           # Soft-shadow cards & KPI widgets
│   │   │   ├── Button.jsx         # Red, emergency, and ghost variants
│   │   │   ├── Modal.jsx          # Accessible dialog
│   │   │   ├── Footer.jsx         # Healthcare footer & emergency hotlines
│   │   │   └── CompatibilityModal.jsx # Interactive compatibility matrix
│   │   ├── donor/
│   │   │   └── DonorCard.jsx      # Donor profile card with masked phone
│   │   └── request/
│   │       ├── RequestCard.jsx    # Emergency request cards
│   │       └── ContactDonorModal.jsx # Simulated call & emergency SMS
│   ├── pages/
│   │   ├── LandingPage.jsx        # Hero, stats, workflow, compatibility widget
│   │   ├── DonorRegisterPage.jsx  # 18+ validation, cooldown check, registration
│   │   ├── DonorDashboardPage.jsx # Availability toggle, matching requests, history
│   │   ├── FindBloodPage.jsx      # Search & filter across hospital blood banks
│   │   ├── EmergencyRequestPage.jsx # Intake form -> live matching transition
│   │   ├── LocationMatchingPage.jsx # Radius slider & distance matching
│   │   ├── HospitalDashboardPage.jsx# Clinical requests table & status updates
│   │   ├── AdminDashboardPage.jsx # Analytics, charts, donor verification
│   │   ├── BloodInventoryPage.jsx # All 8 blood groups & stock adjustments
│   │   ├── NotificationsPage.jsx  # Notification center & deep links
│   │   ├── LoginPage.jsx          # 1-click preset demo logins
│   │   └── AboutPage.jsx          # Guidelines, clinical criteria, FAQs
│   ├── context/
│   │   └── AppContext.jsx         # Global state & cross-component events
│   ├── services/
│   │   └── api.js                 # API service with local fallback
│   ├── data/
│   │   └── mockData.js            # Client fallback seed data & rules
│   ├── App.jsx                    # Routing configuration
│   ├── main.jsx                   # React DOM entry
│   └── index.css                  # Tailwind styles & theme variables
├── package.json
└── vite.config.js
```

---

## 💉 Blood Group Compatibility Reference

| Recipient Type | Can Safely Receive From |
|---|---|
| **O-** | **O-** (Universal Donor) |
| **O+** | O-, O+ |
| **A-** | O-, A- |
| **A+** | O-, O+, A-, A+ |
| **B-** | O-, B- |
| **B+** | O-, O+, B-, B+ |
| **AB-** | O-, A-, B-, AB- |
| **AB+** | **All 8 Blood Groups** (Universal Recipient) |

---

## ⚠️ Academic Disclaimer

*LifeLink is an educational prototype built for hackathon and academic demonstration. Actual blood transfusions require licensed clinical screening, serological cross-matching, and qualified medical supervision. For life-threatening emergencies, always dial 108 or your national emergency medical hotline.*
