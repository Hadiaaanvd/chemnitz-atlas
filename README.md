# 🌍 ChemnitzAtlas

**ChemnitzAtlas** is a full-stack web application that helps users explore categorized cultural places in Chemnitz, Germany. It features interactive map integration, search and filter capabilities, user authentication, favorites, reviews, and profile management.

---

## 🚀 Features

- 🗺️ Interactive map with categorized cultural sites (OpenStreetMap + Overpass API)
- 🔍 Filter and search by category, distance, and name
- 👤 User authentication (Signup, Login, Update, Soft Delete)
- ⭐ Mark places as favorites
- 💬 Submit and view reviews with ratings
- 🧑‍💼 User profile editing (name, location, password)
- 📍 Distance filtering and location autocomplete (Nominatim)

---

## 🧰 Tech Stack

### 🖼️ Frontend

- Vite + React
- Tailwind CSS
- React Icons
- Axios
- Leaflet (map UI)

### 🧠 Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Auth (jsonwebtoken)
- dotenv, bcrypt

### 🌐 APIs Used

- Overpass API (OpenStreetMap)
- Nominatim (location autocomplete)

---

## ⚙️ Getting Started (Local Setup)

### 📦 Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

---

### 🔧 1. Backend Setup

```bash
cd server
npm install
npm run dev


```
---

## 🔌 API Overview

See [`api-docs.md`](./api-docs.md) for full API documentation of:

-   `/api/auth` – Login, Signup, Profile, Favorites
-   `/api/places` – Fetch and Review places
-   `/api/location/search?q=` – Address autocomplete

---

## MongoDB Collections

-   `users`: User auth, favorites, soft deletion
-   `places`: Categorized OSM-based cultural places with reviews and ratings

---

## Deployment

You can deploy the frontend on **Vercel** and backend on **Render**, or use Docker/Node hosting. Ensure to update `.env` variables accordingly.

---

## Sample Accounts

You can register a user using the signup flow, or manually insert via MongoDB.

---

