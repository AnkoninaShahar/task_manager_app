# Task Manager App
**AUTHOR . . . . . . .** Shahar Ankonina                                                                                                                                                           
**DESCRIPTION. . .** Secure full-stack CRUD task manager with React, Node.js, Express, Prisma, and PostgreSQL

---
## About
A robust, production-ready task management application featuring secure JWT authentication, email normalization, relational database handling via Prisma ORM, and a clean, responsive React frontend. Built with a strong focus on clean architecture, separated route/controller logic, and centralized API request management.

---
## Features
- *Secure Authentication:* User registration and login protected by bcrypt password hashing, JWT tokens, and automated email normalization.
- *Protected Routes:* Client-side and server-side middleware ensuring private routes are inaccessible to unauthenticated users.
- *Full Task CRUD:* Create, read, update (titles, descriptions, and completion toggles), and delete tasks dynamically per user.
- *Clean Architecture:* Express backend organized with dedicated controllers, validation schemas (Zod), and secure Prisma database queries.
- *Axios Interceptors:* Centralized frontend API handling that automatically attaches authorization headers to requests.
- *Modern UI:* Sleek, responsive interface styled with custom CSS for an optimal user experience.

---
## Tech Stack
- *Frontend:* React, Vite, React Router, Axios, CSS
- *Backend:* Node.js, Express, Prisma ORM, JSON Web Tokens, bcrypt, Zod
- *Database:* PostgreSQL
- *Tools & Platforms:* Git/GitHub, VS Code, Neon

---
## Installation
Follow these steps to run the project locally:

```bash
# Clone the repo
git clone [https://github.com/YourUsername/your-repo-name.git](https://github.com/YourUsername/your-repo-name.git)

# Navigate into the project directory
cd your-repo-name

# --- Backend Setup ---
cd server
npm install
# Create a .env file and configure your DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run dev

# --- Frontend Setup (In a separate terminal tab) ---
cd ../client
npm install
npm run dev
```
---
## Usage
- Register a new account or log in with existing credentials.
- Navigate to the secure dashboard to add tasks with titles and descriptions.
- Mark tasks as complete, edit details inline, or delete them as needed.
- Log out securely to clear session tokens and restrict route access.
