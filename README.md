# Members Only
A full-stack web application activity in The Odin Project where visitors can see posts but must sign up and log in to create posts. The app also includes an admin feature that allows admins to delete posts.

## 📌Features
- View posts without an account
- Sign up & login to create posts.
- Secure authentication using Passport.js
- Admin role with the ability to delete posts.
- Responsive UI built with React and Tailwind CSS.
- Backend powered by Express and PostgreSQL.

## 🛠️ Tech Stack
### **Frontend (Client)**
- React 19
- React Router
- Tailwind CSS
- Vite

### **Backend (Server)**
- Express.js
- PostgreSQL (pg)
- Passport.js for authentication
- bcryptjs for password hashing
- dotenv for environment variables
- CORS for cross-origin requests

## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Four26/members-only.git
cd members-only
```
### Setup server
```sh
cd server
npm install
```
### Setup client
```sh

cd client
npm install
npm run dev