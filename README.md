# ChemnitzAtlas

ChemnitzAtlas is a web application that helps users discover categorized cultural places in Chemnitz, Germany. It features map integration, user authentication, favorites, reviews, and filtering by category, distance, and search.

## Features

-   Interactive map with categorized cultural sites (OSM + Overpass API)
-   Filter and search by category, distance, and name
-   User authentication (signup, login, update, soft delete)
-   Mark places as favorites
-   Submit and view reviews with ratings
-   User profile editing (name, location, password)
-   Distance filtering and location autocomplete via Nominatim

---

## Tech Stack

### Frontend

-   React
-   Tailwind CSS
-   React Icons
-   Axios
-   Leaflet

### Backend

-   Node.js / Express
-   MongoDB / Mongoose
-   JWT Authentication
-   dotenv, bcrypt

### APIs

-   Overpass API (OSM) for data
-   Nominatim for location autocomplete

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   MongoDB URI (e.g. from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Environment Setup

Create a `.env` file in the root of your backend with the following:

```
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

---

### 1️⃣ Backend Setup

```bash
cd server
npm install
npm run dev          # Starts the backend at http://localhost:4000
```

## 🛠️ Initialize the Database

To populate the database with places from OpenStreetMap (Overpass API):


````bash
cd server
node server/utils/fetchOverpass.js  # Seed DB with sample OSM places

---

### 2️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev          # Starts frontend at http://localhost:3000
````

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

## License

MIT – for academic use only.
