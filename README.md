# Smart Leads Dashboard

A full-fledged, premium full-stack Lead Management Dashboard built using the MERN stack with **TypeScript**, **React**, **Tailwind CSS**, and **Docker**.

---

## 🚀 Features

### 1. Authentication & Security
- **JWT-based Authentication** with robust route protection.
- Password hashing using **bcrypt** during registration.
- Role-Based Access Control (**RBAC**) support:
  - **Admin**: Full access (Read, Create, Update, Delete leads, and Export CSV).
  - **Sales User**: Restrained access (Read, Create, Update leads, and Export CSV; Delete restricted).

### 2. Leads Management (CRUD)
- Complete lead creation, update, and deletion lifecycle.
- **Fields**: Name, Email, Status (`New`, `Contacted`, `Qualified`, `Lost`), Source (`Website`, `Instagram`, `Referral`), and timestamps.
- Custom status badges and elegant table views.

### 3. Advanced Filtering, Search & Sorting
- **Debounced Search**: Restricts API calls by delaying input parsing.
- Filter by status and source parameters simultaneously.
- Sort by Creation Date (`Latest` or `Oldest`).

### 4. Pagination
- Backend-driven pagination utilizing `skip` and `limit` to ensure scalability.
- Standard limits of **10 records per page** with metadata support.

### 5. CSV Export
- Admin/Sales role-controlled CSV export mechanism returning clean format output.

### 6. Premium Responsive UI & Aesthetics
- Fluid transition states, loaders, and responsive layouts.
- Built-in **Dark Mode Support** with localStorage persistence.

---

## 🛠 Tech Stack

- **Frontend**: React (v19), TypeScript, Vite, Tailwind CSS (v4), Lucide Icons, Axios.
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **Database**: MongoDB.
- **Deployment**: Docker, Docker Compose.

---

## ⚙️ Project Structure

```bash
Assignment/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/       # Database connections
│   │   ├── controllers/  # API request controllers
│   │   ├── middlewares/  # Authentication & RBAC middleware
│   │   ├── models/       # Mongoose Schemas (User, Lead)
│   │   ├── routes/       # Express Router endpoints
│   │   └── server.ts     # Main Express entry point
│   ├── Dockerfile
│   └── tsconfig.json
├── frontend/             # React + Vite Single Page Application
│   ├── src/
│   │   ├── components/   # UI components (Layouts, Modals, Tables)
│   │   ├── context/      # Auth Global States
│   │   ├── pages/        # Login, Register, Leads Directory
│   │   ├── services/     # Axios base instance
│   │   └── index.css     # Tailwind v4 directives and variables
│   ├── Dockerfile
│   └── tsconfig.json
├── docker-compose.yml    # Orchestrates mongo, backend & frontend
└── README.md
```

---

## 🚀 How to Run

### Method 1: Using Docker Compose (Recommended)

1. Make sure you have Docker installed.
2. Build and start the services:
   ```bash
   docker-compose up --build
   ```
3. Access the applications:
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5001/api`

### Method 2: Running Locally

#### 1. Setup Backend
1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup env configurations in a `.env` file (see root `.env.example`).
4. Start the dev server:
   ```bash
   npm run dev
   ```

#### 2. Setup Frontend
1. Go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```

---

## 📑 API Endpoints Documentation

### Authentication Routes (`/api/auth`)

#### 1. Register a User
- **URL**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword",
    "role": "sales"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "sales"
    }
  }
  ```

#### 2. Login
- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Logged in successfully",
    "token": "JWT_TOKEN_HERE",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "sales"
    }
  }
  ```

---

### Lead Routes (`/api/leads`)
*Note: All routes below require a `Authorization: Bearer <token>` header.*

#### 1. Fetch leads (with search, filter, sort, and pagination)
- **URL**: `GET /api/leads`
- **Query Params (Optional)**:
  - `page` (default: `1`)
  - `limit` (default: `10`)
  - `search` (Search name or email)
  - `status` (`New`, `Contacted`, `Qualified`, `Lost`)
  - `source` (`Website`, `Instagram`, `Referral`)
  - `sort` (`latest`, `oldest`)
- **Response (200 OK)**:
  ```json
  {
    "leads": [
      {
        "_id": "60d0fe4f5311236168a109cb",
        "name": "Alice Smith",
        "email": "alice@gmail.com",
        "status": "Qualified",
        "source": "Website",
        "createdAt": "2026-05-19T14:35:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

#### 2. Create Lead
- **URL**: `POST /api/leads`
- **Body**:
  ```json
  {
    "name": "John Miller",
    "email": "john@example.com",
    "status": "New",
    "source": "Referral"
  }
  ```

#### 3. Update Lead
- **URL**: `PUT /api/leads/:id`
- **Body**:
  ```json
  {
    "status": "Contacted"
  }
  ```

#### 4. Delete Lead (Admin Only)
- **URL**: `DELETE /api/leads/:id`

#### 5. Export Leads to CSV
- **URL**: `GET /api/leads/export`
- **Response**: Streams a CSV download file of all leads.
