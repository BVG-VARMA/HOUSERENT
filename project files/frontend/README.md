# House Rent Management — Frontend

React + Bootstrap client for the House Rent Management System.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # set REACT_APP_API_URL to your backend
npm start
```

Runs on http://localhost:3000 by default and expects the backend API at the URL in `REACT_APP_API_URL` (defaults to `http://localhost:5000/api`).

## Structure

- `src/api/axios.js` — shared Axios instance; attaches the JWT from `localStorage` to every request and clears it on a 401.
- `src/context/AuthContext.js` — auth state (`user`, `token`), `login`/`register`/`logout`, and rehydrates the session from `localStorage` on page load.
- `src/components/` — `Navbar`, `PropertyCard`, `SearchFilter`, `PrivateRoute` (any logged-in user), `AdminRoute` (admins only).
- `src/pages/` — one file per route: `Home`, `Login`, `Register`, `PropertyDetails`, `AddProperty`, `Dashboard` (your listings, with edit/delete), `MyBookings`, `AdminPanel` (approve/reject listings, manage users).

## Notes

- The JWT is persisted in `localStorage` (key `nf_token`) so refreshing the page keeps you logged in.
- "Owner" isn't a separate role — any authenticated `user` can list a property, and edit/delete is restricted server-side to the listing's own `owner` field.
- Listings are `pending` until an admin approves them from `/admin`.
