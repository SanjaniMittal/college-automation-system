# Acadexa API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate and retrieve JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user credentials and profile | Yes (Bearer) |
| `PUT` | `/api/auth/profile` | Update contact information (phone, address) | Yes (Bearer) |

### Sample Login Request:
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@acadexa.com",
  "password": "student123",
  "role": "student"
}
```

### Sample Login Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "6ae32bf631427528136d2899",
    "name": "Aarav Sharma",
    "email": "student@acadexa.com",
    "role": "student",
    "rollNo": "CSE001",
    "className": "CSE-A",
    "department": "Computer Science & Engineering"
  }
}
```

---

## 2. Student Management (`/api/students`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all student records |
| `GET` | `/api/students/class/:className` | Get students filtered by class (e.g. `CSE-A`) |
| `GET` | `/api/students/roll/:rollNo` | Get student by roll number |
| `POST` | `/api/students` | Add a new student |
| `PUT` | `/api/students/:id` | Update student details |
| `DELETE` | `/api/students/:id` | Remove student record |

---

## 3. Faculty Management (`/api/faculty`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/faculty` | Get all faculty members |
| `POST` | `/api/faculty` | Register new faculty member |
| `PUT` | `/api/faculty/:id` | Update faculty details |
| `DELETE` | `/api/faculty/:id` | Remove faculty member |

---

## 4. Course Management (`/api/courses`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | Get all enrolled courses |
| `POST` | `/api/courses` | Create new course/subject |
| `PUT` | `/api/courses/:id` | Update course details |
| `DELETE` | `/api/courses/:id` | Delete course |

---

## 5. Attendance Tracking (`/api/attendance`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/attendance` | Fetch attendance records |
| `POST` | `/api/attendance` | Record student attendance |
| `PUT` | `/api/attendance/:id` | Update attendance status |
| `DELETE` | `/api/attendance/:id` | Delete attendance record |

---

## 6. Assignments & Submissions (`/api/assignments`, `/api/submissions`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments` | Get all published assignments |
| `POST` | `/api/assignments` | Create new assignment (Faculty) |
| `PUT` | `/api/assignments/:id` | Edit assignment |
| `DELETE` | `/api/assignments/:id` | Delete assignment |
| `GET` | `/api/submissions` | Get all student submissions |
| `GET` | `/api/submissions/assignment/:id` | Get submissions for specific assignment |
| `GET` | `/api/submissions/student/:rollNo` | Get submissions by student |
| `POST` | `/api/submissions` | Submit student assignment answer |
| `PUT` | `/api/submissions/:id/grade` | Grade submission (marks & feedback) |
| `DELETE` | `/api/submissions/:id` | Remove submission |

---

## 7. Notice Board (`/api/notices`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notices` | Fetch announcements and circulars |
| `POST` | `/api/notices` | Publish new notice |
| `PUT` | `/api/notices/:id` | Edit notice |
| `DELETE` | `/api/notices/:id` | Remove notice |

---

## 8. Real-time Dashboard Analytics (`/api/stats`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats/admin` | Aggregate counts: students, faculty, courses, attendance % |
| `GET` | `/api/stats/student/:rollNo` | Student metrics: attendance %, enrolled courses, pending tasks, chart data |
| `GET` | `/api/timetable` | Weekly class timetable slots |
