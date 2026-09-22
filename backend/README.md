# RailBite - Backend REST API 🚆🍲

RailBite is an IRCTC-partner train food delivery system backend providing REST APIs for train tracking, station schedules, restaurant menus, order management, coupons, and authentication.

## 🚀 Features
- **Train Search & PNR Lookup**: Real-time train schedules, intermediate stations, and PNR verification.
- **Station-Specific Catering**: Browse IRCTC-authorized restaurants and food menus filtered by station.
- **Cart & Order Processing**: Dynamic seat delivery order placement with OTP validation and live status tracking.
- **Coupons & Discounts**: Real-time promo code validation.
- **Authentication**: Secure passenger authentication with PBKDF2 password hashing & token issuance.

## 🛠️ Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Middleware**: CORS, JSON parser
- **Storage**: Persistent JSON database engine & SQL schema

## 📦 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the API Server**:
   ```bash
   npm start
   ```
   *The server runs by default at `http://localhost:5000`.*

3. **Development Mode (Auto-reload)**:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/trains` | List all trains |
| `GET` | `/api/trains/:trainNo` | Train details with station schedule |
| `GET` | `/api/pnr/:pnrNumber` | Fetch journey details for a PNR |
| `GET` | `/api/restaurants?station=NDLS` | Restaurants at a specific station |
| `GET` | `/api/restaurants/:id` | Restaurant details & food menu |
| `POST` | `/api/orders` | Place a seat food order |
| `GET` | `/api/orders/:orderNumber` | Track live order status |
| `POST` | `/api/coupons/apply` | Validate coupon code |
| `POST` | `/api/auth/register` | Passenger account registration |
| `POST` | `/api/auth/login` | Passenger login |
