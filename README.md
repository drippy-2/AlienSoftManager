# AlienSoft Product Management App

A complete, production-ready Vue 3 product management application built for the AlienSoft frontend technical test.

## 🚀 Tech Stack

- **Vue 3** (Composition API)
- **Vite** - Fast build tool and dev server
- **Vue Router 4** - Client-side routing with navigation guards
- **Pinia** - State management (auth + products)
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **DummyJSON API** - Mock backend for authentication and products

## ✨ Features

### Authentication
- Login page with DummyJSON authentication API
- Token-based authentication with localStorage persistence
- Session restoration on page reload
- Protected routes with navigation guards
- Auto-redirect logic (authenticated users can't access login page)

### Product Management
- **Product List Page** (`/products`)
  - Display products in a clean, responsive table
  - Real-time search by product title
  - Product details: thumbnail, title, description, category, price, stock
  - Click any row to view full product details
  - "Add New Product" button

- **View Product Page** (`/products/:id`)
  - Full product details with large thumbnail
  - Additional info: rating, discount percentage
  - Edit button to modify product details
  - Delete product with confirmation dialog
  - Color-coded stock status (green/orange/red)

- **Add Product Page** (`/products/new`)
  - Form to create new products
  - Fields: title, description, category, price, stock, thumbnail URL
  - Form validation and error handling
  - Redirects to product list on success

- **Edit Product Page** (`/products/:id/edit`)
  - Pre-filled form with existing product data
  - Update product information
  - Image preview for thumbnail URL
  - Immediate state synchronization after update
  - Redirects to product details on success

### UI/UX
- **Fully Responsive Design** - Works perfectly on mobile, tablet, and desktop
  - Mobile: Sidebar hidden, single column layouts, touch-friendly buttons
  - Tablet & Desktop: Full sidebar navigation, multi-column grids
- Navbar with user greeting (desktop) and logout button
- Sidebar navigation (hidden on mobile < 768px)
- Loading indicators during API calls
- Error message display
- Primary color: #000080 (Navy Blue)
- Clean, modern design with Tailwind CSS
- Hover states and smooth transitions
- Responsive typography and spacing across all screen sizes

## 📁 Project Structure

```
/
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Reusable Vue components
│   │   ├── ErrorMessage.vue
│   │   ├── Loader.vue
│   │   ├── Navbar.vue
│   │   ├── ProductRow.vue
│   │   ├── ProductTable.vue
│   │   └── Sidebar.vue
│   ├── layouts/             # Layout components
│   │   ├── AppLayout.vue    # Main app layout (with Navbar + Sidebar)
│   │   └── AuthLayout.vue   # Authentication layout
│   ├── pages/               # Page components (routes)
│   │   ├── AddProduct.vue
│   │   ├── EditProduct.vue
│   │   ├── Login.vue
│   │   ├── Products.vue
│   │   └── ViewProduct.vue
│   ├── router/              # Vue Router configuration
│   │   ├── guards.js        # Route guard logic
│   │   └── index.js         # Router setup
│   ├── stores/              # Pinia stores
│   │   ├── auth.js          # Authentication state
│   │   └── products.js      # Products state
│   ├── utils/               # Utility functions
│   │   ├── api.js           # Axios API configuration
│   │   └── truncate.js      # Text truncation utility
│   ├── App.vue              # Root component
│   ├── main.js              # App entry point
│   └── tailwind.css         # Tailwind imports
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm

### Steps

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 🎮 Usage

### Login Credentials
Use these test credentials from DummyJSON:

```
Username: emilys
Password: emilyspass
```

Other test users: `michaelw`, `sophiab`, etc. (password pattern: `{username}pass`)

### Navigation Flow
1. Login with test credentials
2. View products list with search functionality
3. Click any product to view full details
4. Edit product information via the "Edit Product" button
5. Delete products with confirmation dialog
6. Add new products via the "Add New Product" button
7. Logout from the navbar

## 🏗️ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## 🌐 GitHub Pages Deployment

### Option 1: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deployment script to package.json**
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Update vite.config.js for GitHub Pages**
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 2: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install and Build
        run: |
          npm install
          npm run build
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Enable GitHub Pages in repository settings and select the `gh-pages` branch.

## 📝 API Endpoints Used

### Authentication
- `POST https://dummyjson.com/auth/login` - User login

### Products
- `GET https://dummyjson.com/products` - Get all products
- `GET https://dummyjson.com/products/:id` - Get single product
- `POST https://dummyjson.com/products/add` - Add new product
- `PUT https://dummyjson.com/products/:id` - Update product
- `DELETE https://dummyjson.com/products/:id` - Delete product

## 📌 Notes & Assumptions

1. **DummyJSON Limitations**: The DummyJSON API is a mock API. While it accepts POST, PUT, and DELETE requests, the changes are not persisted on the server. The app updates the local Pinia store to reflect these changes.

2. **Authentication**: The token from DummyJSON is stored in localStorage for session persistence. In a production app, consider using httpOnly cookies for better security.

3. **Primary Color**: The primary color #000080 (Navy Blue) is used throughout the application as specified in the requirements.

4. **Responsive Design**: The app is fully responsive and optimized for:
   - Mobile devices (< 640px): Single column layouts, hidden sidebar, stacked buttons
   - Tablets (640px - 1024px): Optimized spacing and readable typography
   - Desktop (> 1024px): Full sidebar, multi-column layouts, all features visible

5. **Category Filter**: The basic implementation includes search by title. Category filtering can be added as an enhancement.

6. **Form Validation**: Basic HTML5 validation is implemented. Advanced validation can be added for production use.

7. **Complete CRUD**: All CRUD operations are fully implemented with proper state management and immediate UI updates.

## 🎨 Design Decisions

- **Layout**: Two-layout system (AuthLayout for login, AppLayout for authenticated pages)
- **Component Structure**: Atomic design approach with reusable components
- **State Management**: Separate stores for auth and products for better organization
- **Routing**: Centralized route guards for consistent authentication checks
- **API Layer**: Abstracted API calls into utility functions for maintainability
- **Error Handling**: Consistent error display across all pages

## 🔮 Future Enhancements

- Category filter dropdown
- Pagination for large product lists
- Advanced form validation with real-time feedback
- Product image upload (file upload instead of URL)
- Dark mode toggle
- Mobile responsive design optimization
- Unit and E2E tests
- Bulk operations (delete/update multiple products)
- Product sorting by price, stock, rating

## 📄 License

This project was created for the AlienSoft Frontend Technical Test.

---

**Built with ❤️ using Vue 3 + Vite + Tailwind CSS**
