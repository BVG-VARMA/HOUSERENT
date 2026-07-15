# House Rent Management System — Backend

Node.js + Express + MongoDB (Mongoose) API for the House Rent Management System.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
3. Start MongoDB (local or Atlas), then run the server:
   ```bash
   npm run dev   # nodemon, for development
   npm start     # plain node, for production
   ```

Server runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

## API Routes

### Auth (`/api/auth`)
- `POST /register` — create user
- `POST /login` — verify credentials, return JWT
- `GET /me` — get logged-in user (protected)

### Properties (`/api/properties`)
- `GET /` — list approved properties (`?location=&price=&type=&minPrice=&maxPrice=`)
- `GET /mine` — properties created by logged-in user (protected)
- `GET /:id` — single property detail
- `POST /` — create listing (protected)
- `PUT /:id` — edit own listing (protected, owner/admin only)
- `DELETE /:id` — delete own listing (protected, owner/admin only)

### Bookings (`/api/bookings`)
- `POST /` — create booking request (protected)
- `GET /mine` — bookings made by logged-in user (protected)
- `PUT /:id/cancel` — cancel booking (protected)

### Admin (`/api/admin`) — requires `role: admin`
- `GET /properties/pending`
- `PUT /properties/:id/approve`
- `PUT /properties/:id/reject`
- `GET /users`
- `DELETE /users/:id`

## Notes
- Passwords are hashed with bcryptjs before saving (User model pre-save hook).
- JWT is required in the `Authorization: Bearer <token>` header for protected routes.
- New listings default to `status: pending` and must be approved by an admin before they appear in public search results.
- To create your first admin account, register normally then manually update that user's `role` field to `admin` in MongoDB (public registration cannot set the admin role directly).
