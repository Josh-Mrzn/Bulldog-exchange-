# CTWEBPGL Web Programming - Long Exam 1

This repository contains a React frontend built with Vite, React Router, and Tailwind CSS.

The current project is **BulldogEx Shop**, a low-fidelity e-commerce wireframe for campus products. It includes a full-width hero banner, product catalog cards, product detail pages, store information pages, shared layouts, and authentication screens.

## Tech Stack

- React 19
- Vite
- React Router DOM
- Tailwind CSS 4
- ESLint

## Main Features

- Full-width e-commerce hero section with background image overlay
- Product listing page with reusable product cards
- Product detail page with price, category, stock, description, and action buttons
- Store-focused home, about, footer, and not found pages
- Authentication pages for sign in and sign up
- Shared layout, navbar, footer, and button components

## Fork and Clone Instructions

Fork the original repository first on GitHub. This creates your own copy of the repository under your GitHub account.

After the repository is forked, clone your forked repository to your local device:

1. Go to the root folder where you want to save the project.
2. Open that folder in **VS Code**.
3. Open the **VS Code Terminal**.
4. Run `git clone` using the URL of your forked repository:

```bash
git clone <forked-repository-url>
```

Example:

```bash
git clone https://github.com/your-username/surname-long-exam.git
```

After cloning the forked repository, go inside the cloned project folder:

```bash
cd surname-long-exam
```

## Project Setup

Install dependencies inside the client app:

```bash
cd surname-client
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Push to GitHub Using Git Bash

Open **Git Bash** or **VS Code Terminal**, then go to the project root folder:

Example
```bash
cd /c/Users/ACER/Desktop/cy.dev/cy.dev.reactjs/course-material/webprog/long-exam1
```

Check the files before committing:

```bash
git status
```

If this folder is not yet a Git repository, initialize it:

```bash
git init
```

Stage, commit, and push the project:

```bash
git add .
git commit -m "initial long-exam1"
git push origin main
```

For future updates after editing files:

```bash
git status
git add .
git commit -m "enhanced long-exam1"
git push
```

## Current Routes

- `/` - Home page
- `/about` - About page
- `/products` - Product list page
- `/products/:name` - Single product page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/cart`, `/orders` - Cart/checkout and My Orders (see "Connected to the API" below)
- `/admin/dashboard`, `/admin/products` - Admin area

## Key Files

- `src/assets/product-content.js` - product data used by the catalog and product pages
- `src/components/ProductCard.jsx` - reusable product card component
- `src/components/ProductList.jsx` - product grid component
- `src/pages/LandingPages/ProductListPage.jsx` - product catalog page
- `src/pages/LandingPages/ProductPage.jsx` - single product detail page
- `src/pages/LandingPages/HomePage.jsx` - landing page with full-width hero banner

## Current File Structure

```text
long-exam1/
├── README.md
└── marzan-client/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── assets/
        │   ├── hero.png
        │   ├── product-content.js
        │   ├── react.svg
        │   ├── vite.svg
        │   ├── img/
        │   │   ├── nu_bulldogex_banner.jpg
        │   │   └── nubdexchange_logo.png
        │   └── styles/
        │       └── index.css
        ├── components/
        │   ├── Button.jsx
        │   ├── Footer.jsx
        │   ├── NavBar.jsx
        │   ├── ProductCard.jsx
        │   └── ProductList.jsx
        ├── layouts/
        │   ├── AuthLayout.jsx
        │   └── Layout.jsx
        └── pages/
            ├── NotFoundPage.jsx
            ├── AuthPages/
            │   ├── SignInPage.jsx
            │   └── SignUpPage.jsx
            └── LandingPages/
                ├── AboutPage.jsx
                ├── ProductListPage.jsx
                ├── ProductPage.jsx
                └── HomePage.jsx
```

## Notes

- `node_modules/` and `dist/` are not included in the structure above because they are generated folders.
- The application uses `Layout.jsx` for public pages and `AuthLayout.jsx` for authentication pages.
- Product routes use the product's `name` (URL slug) from the database. `product-content.js` is
  no longer used by any page; it is kept only as the original Long Exam catalog.

## Enhancement Instructions
- Enhancement 1: Develop an original product catalog with appropriate product names, descriptions, prices, categories, and images.
- Enhancement 2: Create a customized footer and notfoundpage that aligns with the website theme and ensure that all links function correctly.
- Enhancement 3: Provide accessible navigation links for both Sign In and Sign Up pages.
- Enhancement 4: Improve the overall visual design through consistent colors, typography, spacing, and imagery without changing the existing component order or page structure.
- Enhancement 5: Research and apply a custom font to the web application using an appropriate implementation method.

## Connected to the API (CTADWEBL)

The client now runs on the live `marzan-server` API instead of `product-content.js`.
Requires `marzan-server` running and `marzan-client/.env`'s `VITE_API_URL` pointing to it
(defaults to `http://localhost:5000`).

**Accounts and access**

- Opening the app goes to `/auth/signin` first; every store page requires a signed-in user.
- `/auth/signup` creates a real Customer account and signs it in straight to the Home page.
- One log in page for everyone: a **Customer** goes to Home, an **Admin** goes to the dashboard
  (seeded Admin: `admin@bulldogex.nu.edu.ph` / `Admin123!`). "Remember me" keeps the session
  after the browser is closed.
- The navbar shows My Orders, the user's name (their profile), Cart, Log Out, and Dashboard for an Admin.
- `/profile` (Customer) and `/admin/profile` (Admin) — change first/last name and set a username
  (3–30 characters, no spaces, special characters allowed, unique). The username replaces the
  first name in the navbar, the dashboard greeting, and on product reviews. The same page has a
  Change Password form (current password, new password, confirm).

**Store**

- `/products` — products, categories, and images from the database, with a category filter and sorting.
- `/products/:name` — product details, related products, and Add to Cart with a quantity.
- `/cart` — cart (saved in the browser per user) and checkout, which places a real order
  (`POST /api/v1/orders`).
- `/orders` — the signed-in user's orders and their status.
- `/orders/:id` — order tracking (Placed → Confirmed → Shipped → Delivered), opened right after
  checkout and refreshed automatically. The customer can cancel it while it is still Pending
  (before the store confirms it). Once the order is Delivered, the customer rates each
  product 1–5 stars with an optional comment (`POST /api/v1/reviews`); reviews and the average
  rating show on the product page.
- Home and About show live product, category, and order counts.

**Admin** (Admin role only)

- `/admin/dashboard` — live counts (products, categories, users, orders and sales), recent orders,
  and products that still have no photo.
- `/admin/analytics` — sales analytics for a chosen period (7/30/90 days or all time): total sales,
  orders, average order, items sold, a sales-over-time chart, sales by category (donut), orders by
  status, best-selling products, and the full sales history with a status filter. Built from the
  existing `GET /api/v1/orders` and `GET /api/v1/products` (no backend changes) with Recharts;
  cancelled orders are excluded from sales.
- `/admin/orders` — every order with its items and shipping address; the Admin confirms it
  (Pending → Processing), marks it Shipped and Delivered, marks it Paid, or cancels it. The
  customer sees the new status on My Orders.
- `/admin/products`, `/admin/products/new`, `/admin/products/:name/edit` — manage products and
  upload images to Cloudinary (preview before upload, inline errors for the wrong file type or a
  file over 5 MB).
