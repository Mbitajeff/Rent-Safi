# RentSafi

RentSafi is a full-stack MERN application for the Kenyan rental market. It connects tenants and landlords, allowing users to search, book, and manage property rentals with real-time chat, booking requests, and a modern, user-friendly interface.

---

## 🚀 Live Demo
- **Frontend:** [https://rent-safi-git-main-jeff-mbitas-projects.vercel.app/](https://rent-safi-git-main-jeff-mbitas-projects.vercel.app/)
- **Backend API:** [https://rent-safi.onrender.com/](https://rent-safi.onrender.com/)

---

## 📸 Screenshots

> _Add screenshots of your Home page, property search, booking modal, dashboard, and chat here._

- ![Home Page](client/public/screenshots/home.png)
- ![Property Search](client/public/screenshots/search.png)
- ![Booking Modal](client/public/screenshots/booking.png)
- ![Dashboard](client/public/screenshots/dashboard.png)
- ![Chat](client/public/screenshots/chat.png)

---

## 🎥 Video Demonstration

> _Add a link to your 5-10 minute video demo here._

[![Watch the demo](https://img.youtube.com/vi/your_video_id/0.jpg)](https://youtube.com/your_video_link)

---

## 📝 Project Description

RentSafi is a modern property rental platform for Kenya, built with the MERN stack. It allows tenants to search and book properties, chat with landlords, and manage their favorite listings. Landlords can list properties, manage bookings, and communicate with tenants in real time.

**Key Features:**
- Tenant and landlord roles with separate dashboards
- Property search with filters and map
- Real-time chat and notifications
- Booking/viewing requests
- Add to cart/favorites
- Secure authentication and authorization
- Responsive, mobile-friendly UI

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```sh
git clone https://github.com/Mbitajeff/Rent-Safi.git
cd Rent-Safi
```

### 2. Install dependencies
- For the backend:
  ```sh
  cd server
  pnpm install
  # or npm install
  ```
- For the frontend:
  ```sh
  cd ../client
  pnpm install
  # or npm install
  ```

### 3. Environment Variables
- Create `.env` files in both `/server` and `/client` (see `.env.example` if provided)
- Set up MongoDB Atlas and add your connection string to `MONGODB_URI` in `/server/.env`
- Set `VITE_API_URL` in `/client/.env` to your backend URL (for local dev, use `http://localhost:5000/api`)

### 4. Run the app locally
- Start the backend:
  ```sh
  cd server
  pnpm run dev
  # or npm run dev
  ```
- Start the frontend:
  ```sh
  cd ../client
  pnpm run dev
  # or npm run dev
  ```

---

## 📚 More Documentation
- [API Documentation](#) <!-- Add link or section -->
- [User Guide](#) <!-- Add link or section -->
- [Technical Architecture](#) <!-- Add link or section -->

---

## 👤 Author
- [Mbitajeff](https://github.com/Mbitajeff)

--- 