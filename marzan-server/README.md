# marzan-server

Express + MongoDB backend for **BulldogEx Shop**, organized using the MVC pattern.

## Structure

```text
marzan-server/
├── components/
│   ├── config/        # config.js (env variables), db.js (MongoDB connection), constants.js (HttpStatus)
│   ├── controllers/   # request handling logic
│   ├── middleware/    # authentication.js (JWT), authorization.js (RBAC), auditLoggerMiddleware.js,
│   │                  # validationMiddleware.js, rateLimiterMiddleware.js, uploadImageMiddleware.js
│   ├── models/        # Mongoose schemas (product, category, supplier, cart, order, review, user, log)
│   ├── routes/        # API route definitions
│   └── utils/         # apiResponse.js (standard JSON responses)
├── index.js           # app entry point
├── seed.js            # adds/updates starter categories/suppliers/products and the admin account
├── vercel.json
└── .env.example
```

## Setup

```bash
npm install
cp .env.example .env   # then fill in your values
npm run seed           # loads sample data AND seeds the admin@bulldogex.nu.edu.ph account
npm run dev
```

## Authentication and roles

Every user has a `role` of `Customer` (default) or `Admin`. Signing up always creates a
`Customer`; there is no endpoint that lets a client make itself an Admin. `npm run seed`
creates one Admin account for testing:

| Email | Password |
|---|---|
| `admin@bulldogex.nu.edu.ph` | `Admin123!` |

Sign in (`POST /api/v1/sessions`) returns a JWT that carries the user's id and role.
Send it as `Authorization: Bearer <token>` on protected routes.

- **`components/middleware/authentication.js`** verifies the JWT and sets `req.user = { id, email, role }`.
- **`components/middleware/authorization.js`** is used as `authorization("Admin")`; it rejects the
  request with 403 unless `req.user.role` is one of the given roles.
- Catalog writes (create/update/delete on products, categories, suppliers) require an Admin.
- A Customer can only read, update, or delete their **own** user account, cart, and orders; an
  Admin can access any. Product, category, supplier, and review listings stay public.

## Middleware and API security

- **`components/middleware/auditLoggerMiddleware.js`** logs every request to the `logs`
  collection (method, path, IP, the signed-in user if any, status code, duration), readable
  via `GET /api/v1/logs` (Admin only) or MongoDB Atlas.
- **`components/middleware/validationMiddleware.js`** checks the shape of the request body
  (express-validator) before it reaches a controller: `registerValidation`, `loginValidation`,
  `updateUserValidation`.
- **`components/middleware/rateLimiterMiddleware.js`** (express-rate-limit):
  - `apiLimiter` — 300 requests / 15 min per IP, applied to every route.
  - `loginLimiter` — 20 / 15 min per IP on `POST /api/v1/sessions`.
  - `registerLimiter` — 10 / hour per IP on `POST /api/v1/users`.
  - `loginLockout` — an escalating, per-account lockout on repeated failed logins (in-memory,
    resets if the server restarts): 5 failures → locked 3 minutes, 8 → 5 minutes, 10+ → 30 minutes.
- **Helmet** sets a locked-down Content-Security-Policy (this is a JSON API, not an HTML app),
  `X-Frame-Options: DENY`, and removes the `X-Powered-By` header.
- **CORS** only allows the origin(s) in `CORS_ORIGIN` (`.env`; defaults to the Vite/CRA dev
  ports). Add the deployed frontend's URL here once it is on Vercel.

## Product images (Cloudinary)

`components/middleware/uploadImageMiddleware.js` (Multer, in-memory, JPEG/PNG/WebP only, 5 MB
max) and `components/config/cloudinary.js` handle product photos:

- `POST /api/v1/products/:name/upload-image` (Admin, `multipart/form-data`, field `image`)
  uploads to Cloudinary under `bulldogs-exchange/products/` and saves the result's
  `secure_url`/`public_id` on the product as `image`/`imagePublicId`.
- Uploading again **replaces** the image: the previous Cloudinary asset is deleted.
- Deleting a product also deletes its Cloudinary asset, so nothing is left orphaned.
- `image` holds either a Cloudinary URL (once uploaded) or still a local asset filename
  (e.g. `"totebag.png"`) for the products seeded before this activity existed.

Requires a free [Cloudinary](https://cloudinary.com/) account; put its Cloud Name, API Key,
and API Secret in `.env` (see `.env.example`).

## Username

Users may set an optional `username` with `PATCH /api/v1/users/:id` (their own account, or any
as Admin): 3–30 characters, no spaces, special characters allowed (e.g. `Josh_M!`, `jm★2026`).
It is unique ignoring letter case (`Josh_M!` and `josh_m!` clash → 409 "That username is already
taken"). Reviews and orders include it when the user is populated.

## Changing a password

`PATCH /api/v1/users/:id` with `{ "currentPassword": "...", "password": "<new, 6+ chars>" }`.
Changing **your own** password requires `currentPassword` (400 if missing or wrong). An Admin
resetting **another** user's password does not need it.

## Order status

An Admin moves an order forward with `PATCH /api/v1/orders/:id` (`{ "status": "Processing" }`,
`{ "isPaid": true }`, or both). Only these steps are allowed; anything else returns 409:

`Pending → Processing → Shipped → Delivered`, and `Pending`/`Processing → Cancelled`.
`Delivered` and `Cancelled` are final.

A Customer may send only `{ "status": "Cancelled" }`, only for their own order, and only while it
is still `Pending` (before the store confirms it); otherwise 403/409. The order's `cancelledBy`
is set to `"Customer"` or `"Store"`.

## Response format

Every response has the same shape:

```json
{ "success": true, "message": "Products retrieved successfully.", "count": 5, "data": [] }
{ "success": false, "message": "Product not found" }
```

`GET /api/v1/products` also returns `total`, `page`, `limit`, and `totalPages`.

## API Endpoints (v1)

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/` | – |
| POST | `/api/v1/users` (sign up) | – |
| POST | `/api/v1/sessions` (sign in, returns a JWT) | – |
| GET | `/api/v1/users/me` | Bearer token |
| GET | `/api/v1/users` | Admin |
| GET | `/api/v1/users/:id` | Admin |
| PATCH | `/api/v1/users/:id` | Admin, or that same user |
| DELETE | `/api/v1/users/:id` | Admin |
| GET | `/api/v1/products` | – |
| GET | `/api/v1/products/:name` | – |
| POST | `/api/v1/products` | Admin |
| PUT | `/api/v1/products/:name` | Admin |
| DELETE | `/api/v1/products/:name` | Admin |
| POST | `/api/v1/products/:name/upload-image` (`multipart/form-data`, field `image`) | Admin |
| GET | `/api/v1/categories` | – |
| GET | `/api/v1/categories/:id` | – |
| POST | `/api/v1/categories` | Admin |
| PUT | `/api/v1/categories/:id` | Admin |
| DELETE | `/api/v1/categories/:id` | Admin |
| GET | `/api/v1/suppliers` | – |
| GET | `/api/v1/suppliers/:id` | – |
| POST | `/api/v1/suppliers` | Admin |
| PUT | `/api/v1/suppliers/:id` | Admin |
| DELETE | `/api/v1/suppliers/:id` | Admin |
| GET | `/api/v1/carts` (optional `?user=<id>`) | Bearer token (own cart; Admin: any) |
| GET | `/api/v1/carts/:id` | Bearer token (own cart; Admin: any) |
| POST | `/api/v1/carts` | Bearer token (own cart; Admin: any user) |
| GET | `/api/v1/orders` (optional `?user=<id>`, `?status=<status>`) | Bearer token (own orders; Admin: any) |
| GET | `/api/v1/orders/:id` | Bearer token (own orders; Admin: any) |
| POST | `/api/v1/orders` | Bearer token (own order; Admin: any user) |
| PATCH | `/api/v1/orders/:id` (`status` and/or `isPaid`) | Admin; the owner may only cancel a Pending order |
| GET | `/api/v1/reviews` (optional `?product=<id>`) | – |
| GET | `/api/v1/reviews/:id` | – |
| POST | `/api/v1/reviews` | Bearer token (own review; Admin: any user) |
| GET | `/api/v1/logs` (optional `?level=`, `?limit=`) | Admin |

### Product query parameters

| Parameter | Example | Description |
|---|---|---|
| `page`, `limit` | `?page=2&limit=5` | Pagination (default page 1, 10 per page, max 100) |
| `category` | `?category=Uniforms` | Category name (case-insensitive) or id |
| `supplier` | `?supplier=Bulldog Threads` | Supplier name (case-insensitive) or id |
| `minPrice`, `maxPrice` | `?minPrice=300&maxPrice=600` | Price range |
| `search` | `?search=jacket` | Keyword search in title and description |
| `sort` | `?sort=-price,title` | `price`, `title`, `name`, `createdAt`; `-` = highest/latest first |

All parameters can be combined, e.g. `/api/v1/products?page=1&limit=5&category=Apparel&sort=price&search=jacket`.
