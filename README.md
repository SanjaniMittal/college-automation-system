# 🎓 Acadexa — Intelligent College Automation & Management Platform

A modern, full-fledged web application designed to automate and streamline academic administration, faculty workflows, and student life. Built with a responsive React frontend, Node.js/Express REST API, and MongoDB with Mongoose ODM.

---

## 🌟 Key Highlights & Feature Matrix

### 🛡️ 1. Administrator Portal
- **Central Analytics Dashboard**: Real-time KPI cards for enrolled students, faculty members, offered courses, and college-wide attendance rate.
- **Student Directory**: Add, search, edit, and delete student records with roll number, program, semester, email, and active status.
- **Faculty Directory**: Manage professors and lecturers, departmental designations, employee IDs, and contact info.
- **Course Catalog**: Define courses with codes, credits, department associations, and assign lead faculty.
- **Campus Attendance Oversight**: Filter records by class, subject, and date; toggle attendance and record new sessions.
- **College Notice Board**: Publish academic, examination, holiday, meeting, and event circulars with target audience segmentation.

### 👨‍🏫 2. Faculty Portal
- **Faculty Dashboard**: View assigned teaching modules, student counts, and today's upcoming lecture timetable.
- **My Classes**: Overview of active semester courses, credit distribution, and enrolled batches.
- **Real-Time Attendance Marking**:
  - Filter by course, class section (CSE-A, CSE-B), and calendar date.
  - One-click **"Mark All Present"** and **"Mark All Absent"** bulk actions.
  - Interactive toggle buttons with instant state persistence to MongoDB.
- **Assignment Management & Online Grading**:
  - Create and post homework tasks with title, due dates, instructions, and target classes.
  - Inspect student submissions in real-time.
  - **Inline Grading**: Award numerical marks (0–100) and provide qualitative feedback to students.
- **Notice Board**: Stay informed with campus circulars and official announcements.

### 🎓 3. Student Portal
- **Personalized Student Dashboard**:
  - Subject-wise visual attendance performance chart.
  - Real-time attendance rate percentage.
  - Pending assignment alert counter.
  - Today's lecture schedule with room locations and faculty names.
- **My Attendance**: Breakdown of total classes, attended sessions, missed sessions, and attendance percentages per subject.
- **My Assignments & Submission Hub**:
  - Track upcoming due dates and urgency tags.
  - Submit answers directly through the interactive submission modal.
  - Review graded assignments with marks scored and faculty comments.
- **Weekly Timetable**: Filter schedule by day of the week with time slots and classroom/lab indicators.
- **Notice Board**: Categorized notices (Academic, Examination, Holiday, General).
- **Student Profile**: View official enrollment data and edit contact phone and residential address.

---

## 🔑 Pre-Configured Demo Accounts

For instant testing, use the **Quick Demo Access** buttons on the login page or enter the credentials below:

| Role | Email | Password | Details |
|---|---|---|---|
| **Administrator** | `admin@acadexa.com` | `admin123` | Full administrative privileges |
| **Faculty** | `faculty@acadexa.com` | `faculty123` | Dr. Neha Kapoor (Computer Science) |
| **Student** | `student@acadexa.com` | `student123` | Aarav Sharma (Roll: `CSE001`, Class: `CSE-A`) |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` (or MongoDB Atlas URI)

### 1. Clone & Install Dependencies
From the root directory:
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Configure Environment Variables
In `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/acadexa
JWT_SECRET=acadexa_jwt_secret_token_key_2026_secure
```

### 3. Seed Realistic Demo Data
Populate the database with demo users, students, faculty, courses, attendance sessions, assignments, submissions, and timetable:
```bash
npm run seed
```

### 4. Run Both Backend & Frontend Concurrently
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173` (or port indicated by Vite)

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, React Router v7, Axios, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express 5, Mongoose 9, JWT (JSON Web Tokens), Bcrypt.js
- **Database**: MongoDB (with compound indexes for duplicate prevention)

---

## 📁 Project Architecture

```
college-automation-system/
├── backend/
│   ├── src/
│   │   ├── config/             # Configuration utilities
│   │   ├── middleware/         # JWT auth & role validation middleware
│   │   ├── models/             # Mongoose schemas (User, Student, Faculty, Course, Attendance, Assignment, Submission, Notice, Timetable)
│   │   ├── routes/             # REST API routers (auth, students, faculty, courses, attendance, assignments, submissions, notices, timetable, stats)
│   │   ├── seed.js             # Realistic test database seeding script
│   │   └── server.js           # Express application entrypoint
│   ├── .env                    # Backend environment config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components (Sidebar, Navbar, ProtectedRoute, StatCard, AttendanceChart, DataTable, NoticeCard, PageHeader)
│   │   ├── context/            # AuthContext (JWT token storage, session restore, user state)
│   │   ├── layouts/            # DashboardLayout (Sidebar, Navbar, mobile drawer)
│   │   ├── pages/
│   │   │   ├── admin/          # Dashboard, Students, Faculty, Courses, Attendance, Notices
│   │   │   ├── faculty/        # Dashboard, MyClasses, Attendance, Assignments, Notices
│   │   │   ├── student/        # Dashboard, MyAttendance, Assignments, Timetable, Notices, Profile
│   │   │   └── auth/           # Login with Quick Demo account buttons
│   │   ├── services/           # Axios API modules (api, authService, studentService, assignmentService, noticeService, statsService)
│   │   ├── App.jsx             # Route definitions with role-based ProtectedRoute
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.md               # Complete MongoDB entity relationship & schema docs
├── docs/
│   └── API_DOCUMENTATION.md    # REST API endpoints & request/response specs
├── package.json                # Root concurrent scripts
└── README.md                   # Project documentation
```

---

## 🚀 Cloud Deployment

The application is pre-configured for 1-click cloud deployment:
- **Backend API**: Ready for [Render](https://render.com) or [Railway](https://railway.app) (see [`render.yaml`](file:///c:/Users/LENOVO/Desktop/Coding/college-automation-system/render.yaml))
- **Frontend SPA**: Ready for [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (includes [`vercel.json`](file:///c:/Users/LENOVO/Desktop/Coding/college-automation-system/frontend/vercel.json) & Netlify redirects)
- **Database**: Works with [MongoDB Atlas Free M0](https://www.mongodb.com/cloud/atlas)

For the complete step-by-step walkthrough, see [DEPLOYMENT_GUIDE.md](file:///c:/Users/LENOVO/Desktop/Coding/college-automation-system/docs/DEPLOYMENT_GUIDE.md).

---

## 📜 License
MIT License © 2026 Acadexa Team
