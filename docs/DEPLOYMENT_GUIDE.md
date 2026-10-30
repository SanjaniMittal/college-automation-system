# Acadexa Deployment Guide (Production & Cloud)

This guide provides instructions to deploy **Acadexa (College Automation System)** to free, production-ready cloud platforms so anyone can access it over the public internet, enter their credentials, and use the application.

---

## Architecture Overview

```
 [Users / Browsers]
         │
         ▼
[Frontend: Vercel / Netlify]  ──── HTTPS Requests ────▶  [Backend API: Render / Railway]
(React + Vite Single Page App)                            (Node.js + Express + JWT)
                                                                    │
                                                                    ▼
                                                        [Cloud Database: MongoDB Atlas]
                                                              (Free M0 Cluster)
```

---

## Step 1: Set Up Free Cloud Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Click **Build a Database** and select the **M0 Free** cluster.
3. Choose a provider and region nearest to you (e.g., AWS / Mumbai or N. Virginia).
4. Set up security:
   - **Database User**: Create a user (e.g. username: `acadexa_admin`, password: `<your-secure-password>`).
   - **Network Access / IP Access List**: Add `0.0.0.0/0` (Allow access from anywhere) so cloud servers can connect.
5. In your Cluster view, click **Connect** ➔ **Drivers** (Node.js).
6. Copy the connection string. It will look like:
   ```env
   mongodb+srv://acadexa_admin:<password>@cluster0.abcde.mongodb.net/acadexa?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your actual password and ensure `/acadexa` is specified before the `?`)*.

---

## Step 2: Push Your Code to GitHub

1. Initialize and commit your repository:
   ```bash
   git add .
   git commit -m "feat: complete Acadexa college automation system with production configs"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g., `college-automation-system`).
3. Push your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/college-automation-system.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy Backend API (Render)

1. Sign up / Log in to [Render](https://render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service:
   - **Name**: `acadexa-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   | Key | Value |
   |-----|-------|
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://acadexa_admin:<password>@cluster0.abcde.mongodb.net/acadexa?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `generate_or_paste_a_random_32_character_string` |
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide a public URL, for example:
   `https://acadexa-backend.onrender.com`
8. Verify it: Open `https://acadexa-backend.onrender.com/` in your browser. You should see:
   ```json
   {
     "name": "Acadexa College Automation API",
     "status": "Healthy",
     "version": "1.0.0"
   }
   ```

### Seed Production Database with Demo Users & Sample Data:
Option A (Render Shell):
- In Render dashboard, click on your service ➔ **Shell** tab.
- Run: `npm run seed`
- Done! All users, students, faculty, timetable sessions, and sample records are populated into MongoDB Atlas.

Option B (From your local machine):
- Temporarily update `backend/.env` with your MongoDB Atlas URI.
- Run `npm run seed` in your backend directory.
- Revert your local `.env`.

---

## Step 4: Deploy Frontend (Vercel)

1. Sign up / Log in to [Vercel](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository (`college-automation-system`).
4. In the configuration screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://acadexa-backend.onrender.com/api` |
   *(Make sure to append `/api` at the end of your backend URL)*.
6. Click **Deploy**.
7. Vercel will build the frontend and provide you with a live domain:
   `https://acadexa-frontend.vercel.app` (or custom name).

---

## Alternative: 1-Click Render Blueprint

Since this repo includes `render.yaml`, you can also deploy both frontend and backend directly on Render:
1. Go to [Render Blueprints](https://dashboard.render.com/blueprints).
2. Click **New Blueprint Instance**.
3. Connect your repository. Render will automatically detect `render.yaml`, configure the Web Service and Static Site, and prompt you to input your `MONGODB_URI` and `VITE_API_URL`.

---

## Step 5: How Any User Uses the System

Once deployed, share the frontend URL with any user. They can open it on mobile, tablet, or desktop.

### 1. Default Credentials for Instant Login:
| Role | Email | Password | Allowed Access |
|------|-------|----------|----------------|
| **Admin** | `admin@acadexa.com` | `admin123` | Full system control: Manage Students, Faculty, Courses, Global Attendance, Notices, Analytics |
| **Faculty** | `faculty@acadexa.com` | `faculty123` | Mark daily attendance, Create & Grade assignments, View assigned classes & schedule |
| **Student** | `student@acadexa.com` | `student123` | View attendance percentage, Submit assignments, View class timetable & grades |

### 2. 1-Click Quick Demo Login:
The login page includes quick-access demo buttons for **Admin**, **Faculty**, and **Student**. Users can simply click the badge corresponding to their role, and the credentials will automatically populate and log them in!

### 3. Creating New User Credentials:
Any logged-in **Admin** can create new credentials:
- Navigate to **Students** ➔ Click **Add Student** to create new student profiles with roll number, department, and email.
- Navigate to **Faculty** ➔ Click **Add Faculty** to onboard new professors and assign them subjects.
- Backend endpoint `POST /api/auth/register` is also available for programmatic user registration.
