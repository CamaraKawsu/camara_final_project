# 🎓 Student Management System – MEAN Stack

This is a **full-stack Student Management System** built with the **MEAN stack** (MongoDB, Express.js, Angular, Node.js). It features secure authentication, dynamic role-based authorization (Admin, Editor, Viewer), and a clean user-friendly interface.

---

## 🛠 Features

- ✅ User Registration & Login (JWT Auth)
- ✅ Role-Based Access Control (Admin, Editor, Viewer)
- ✅ Route Protection (Backend & Frontend)
- ✅ Clean Angular UI with conditional views
- ✅ MongoDB Atlas integration

---

## 📁 Folder Structure

```
/frontend   → Angular frontend
/backend    → Node.js + Express backend
.env        → Environment variables (create this file)
```

---

## 🔧 Setup Instructions

### 1. Clone or Fork the Repository

```bash
git clone https://github.com/your-username/student-management-mean.git
cd student-management-mean
```

---

### 2. Create `.env` File in Root of `/backend`

Create a `.env` file inside the **backend folder** and add:

```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=1h
```

---

### 3. Install Dependencies

#### 🖥 Backend

```bash
cd backend
npm install
```

#### 🌐 Frontend

```bash
cd ../frontend
npm install
```

---

## ▶️ How to Run the App

### 🚀 Start the Backend Server

Make sure you're in the `/backend` folder:

```bash
npm run start
```

The backend will run on: `http://localhost:5000`

---

### 🌍 Start the Frontend Angular App

Go to the `/frontend` folder:

```bash
ng serve
```

Frontend runs on: `http://localhost:4200`

---

## 👥 Pre-Created Test Users

You can log in using the following demo accounts:

| Role    | Email                  | Password  |
|---------|------------------------|-----------|
| Admin   | admin@example.com      | password  |
| Editor  | editor@example.com     | password  |
| Viewer  | viewer@example.com     | password  |

Admins can manage users and assign roles dynamically.

---

## 📌 Technologies Used

- **Frontend:** Angular 15+
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT, bcrypt
- **Role-Based Routing:** Angular Guards + Express Middleware

---

## 🙌 Author

- **Instructor:** Mr. Camara (GTMI, The Gambia)
- **Course:** Internet & Web Programming II
- **Institution:** University of The Gambia

---

## 🧠 Note for Students

- Don’t forget to commit regularly.
- Always keep your `.env` file private.
- If you contribute or extend this system, push to your **own fork** and submit via Google Classroom.

---

> 💬 "Learning to code is hard — until it’s not. Keep showing up." – Mr. Camara
