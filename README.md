🌌 AlienSoft Product Management System

A modern, production-ready Vue 3 Product Management App built for the AlienSoft Frontend Technical Assessment.
This system includes authentication, complete product CRUD operations, dynamic category creation, custom measurement units, image upload support, analytics, and a fully responsive interface.

🌐 Live Demo

🔗 App URL: https://drippy-2.github.io/AlienSoftManager/

🔐 Test Admin Login (DummyJSON)


(Other test users follow username → {username}pass)

🚀 Tech Stack

Vue 3 (Composition API)

Vite

Pinia (State management)

Vue Router 4

Tailwind CSS

Axios

DummyJSON API

gh-pages for deployment

✨ Features Overview
🔐 Authentication

Login via DummyJSON API

Token stored in localStorage

Automatic session restoration

Navigation guards for protected routes

Logged-in users cannot access login page

📦 Product Management
Products Page (/products)

Responsive product table

Search by title

Dynamic category filter (built-in + custom)

Sort by price, stock, newest

Pagination for large product lists

Click a product to open its full details

View Product Page (/products/:id)

Large thumbnail preview

Title, category, measurement unit

Price (USD) + live KES conversion

Stock display + low-stock color indicator

Rating & discount info

Edit & Delete actions

Add Product Page (/products/new)

Fields: Title, Description, Category, Price, Stock, Measurement Unit

"Other" category → user can create custom categories

Uploaded categories are stored globally

Supports image URL OR uploaded image file (Base64)

Live USD → KES conversion

Instant UI update without refetching

Edit Product Page (/products/:id/edit)

Uses a fully reactive local copy of data

No direct binding to store to avoid residual state

Supports editing custom categories

Supports editing uploaded images (Base64)

Updates:

Product list

Product details

Category filters

Dashboard charts

No redirect after save (stays on edit page)

No API re-fetch (DummyJSON is non-persistent)

📊 Dashboard & Analytics (/home)

Total products

Total stock count

Inventory value (KES)

Low-stock alerts

Category distribution chart

Top stocked products

Fully reactive — updates as products change

🏷️ Dynamic Category System
Built-in Categories

groceries

beauty

fragrances

furniture

Custom Categories

Added via “Other” field on Add Product

Auto-added globally to:

Add Product page

Edit Product page

Category filters

Dashboard charts

Products listing

📦 Measurement Units

Every product supports these units:

units

trays

packs

bottles

kg

g

liters

custom (user-defined)

Used consistently across:

Product list

View product page

Edit product page

Stock analytics

🖼️ Image Handling

Products support:

Direct URL

Uploaded image file → saved as Base64

Images show correctly on:

Products table

Product view

Edit page

Add page

💰 Currency Conversion

Automatic calculation:

KES = USD × 129.60


Used in Add + Edit pages with live updates.

📁 Project Structure
src/
├── assets/
├── components/
├── layouts/
├── pages/
├── router/
├── stores/
├── utils/
├── App.vue
├── main.js
└── tailwind.css

🛠 Installation
Requirements

Node.js v18+

Install
npm install

Run Development Server
npm run dev


Open:
http://localhost:5000

🌐 Deploy to GitHub Pages
Build
npm run build

Deploy
npm run deploy

Vite Config Requirement

vite.config.js must include:

base: '/AlienSoftManager/'

📝 API Endpoints (DummyJSON)
Authentication
POST https://dummyjson.com/auth/login

Products
GET    https://dummyjson.com/products
GET    https://dummyjson.com/products/:id
POST   https://dummyjson.com/products/add
PUT    https://dummyjson.com/products/:id
DELETE https://dummyjson.com/products/:id

📌 Important Notes

DummyJSON does not persist new or edited products

All changes are stored locally in Pinia

Fully mobile responsive

UI matches AlienSoft branding (primary color: #000080)

🔮 Future Enhancements

Real backend + database

Admin roles / permissions

Image file uploads to cloud storage

Bulk product updates

Infinite scroll / server pagination

Unit tests + E2E tests

📄 License

Created exclusively for the AlienSoft Frontend Technical Test.
