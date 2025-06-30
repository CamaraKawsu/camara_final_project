# 🏫 School Management System – MEAN Stack

A modern full-stack **School Management System** built with the **MEAN stack** (MongoDB, Express.js, Angular, Node.js). It allows user registration, login, and dynamic role-based access control for Admins, Teachers, and Students.

---

## 📌 Key Features

- ✅ Secure JWT Authentication
- ✅ Role-Based Access (Admin, Teacher, Student)
- ✅ Student Records Management
- ✅ Course & Subject Management
- ✅ Angular Route Guards for Role-Specific Views
- ✅ MongoDB Atlas Integration

---

## 📁 Project Structure

```
/frontend   → Angular Frontend
/backend    → Express.js + MongoDB Backend
.env        → Contains environment variables (create this file in backend)
```

---

## 🔧 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/school-management-mean.git
cd school-management-mean
```

---

### 2. Create `.env` File in `/backend`

Inside the `/backend` folder, create a file named `.env` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=1h
```

---

### 3. Install Dependencies

#### 🖥 Backend Setup
```bash
cd backend
npm install
```

#### 🌐 Frontend Setup
```bash
cd ../frontend
npm install
```

---

## ▶️ Running the Application

### 🚀 Start Backend (API Server)
```bash
cd backend
npm run start
```

- Runs at: `http://localhost:5000`

---

### 🌍 Start Frontend (Angular UI)
```bash
cd frontend
ng serve
```

- Runs at: `http://localhost:4200`

---

## 👥 Pre-Created Demo Users

| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Admin    | admin@school.com       | password  |
| Teacher  | teacher@school.com     | password  |
| Student  | student@school.com     | password  |

---

## 🧰 Tech Stack

- **Frontend:** Angular 15+
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Auth:** JSON Web Token (JWT)
- **UI Protection:** Angular Route Guards + Express Middleware

---

## ✍️ Developed By

- **Instructor:** Mr. Camara  
- **Course:** Internet & Web Programming II  
- **Institution:** University of The Gambia / GTMI

---

## 📌 Notes for Students

- Commit your code often.
- Never push your `.env` file to GitHub.
- Use your forked repo for submission via Google Classroom.

---

> 📢 “Discipline + Consistency = Mastery. Let’s build the future, one line of code at a time.” – Mr. Camara
