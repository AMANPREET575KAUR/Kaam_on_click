
# 🚀 KaamOnClick - Hyperlocal Service Marketplace

> **One Tap. Problem Gone.** — A revolutionary platform connecting customers with nearby service professionals in real-time.

<p align="center">
  <img src="frontend/vite-project/src/assets/LOGO.png" width="220" alt="KaamOnClick Logo"/>
</p>

<p align="center">
  <strong>A modern, scalable marketplace for local services</strong><br/>
  <em>Connecting service seekers with vetted professionals instantly</em>
</p>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack-detailed)
- [System Architecture](#-system-architecture--flowchart)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [GraphQL API Schema](#-graphql-api-schema)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Environment Variables](#-environment-variables)
- [Key Modules & Files](#-key-modules--files)
- [API Endpoints & Queries](#-api-endpoints--queries)
- [User Flows](#-user-flows)
- [Contributing](#-contributing)
- [Team](#-team)

---

## 🎯 Project Overview

**KaamOnClick** is a hyperlocal service marketplace platform that revolutionizes how customers find and hire local service professionals. Instead of tedious searching and individual contact, customers simply post their service request and receive competitive bids from qualified professionals in their area.

### Problem Statement
- ❌ Difficult to find reliable local service providers
- ❌ No transparency in pricing
- ❌ Time-consuming comparison process
- ❌ Limited information about provider credentials

### Our Solution
- ✅ One-click service requests
- ✅ Transparent bidding system with price visibility
- ✅ Location-based provider matching
- ✅ Provider ratings, reviews, and detailed profiles
- ✅ Real-time bid notifications
- ✅ Secure payment and service tracking

---

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- Secure user registration (Customer & Provider roles)
- JWT-based authentication with token management
- Password hashing using bcrypt
- Role-based access control (RBAC)
- Profile completion enforcement

### 👤 **User Management**
- Separate workflows for Customers and Service Providers
- Comprehensive user profiles with verification badges
- Privacy settings and notification preferences
- Provider expertise and experience tracking
- Customer review history and ratings

### 📢 **Job Management**
- Create detailed service requests with specifications
- Multiple service categories (Plumbing, Electrical, Cleaning, etc.)
- Location-based job discovery
- Real-time job status tracking (OPEN → ASSIGNED → IN_PROGRESS → COMPLETED)
- Job budget specification with minimum/maximum ranges

### 💰 **Bidding System**
- Providers submit competitive price bids
- Bid message system for communication
- Accept/reject bid mechanism for customers
- 24-hour cancellation policy protection
- Bid status tracking (PENDING → ACCEPTED → REJECTED → CANCELLED)

### ⭐ **Rating & Review System**
- 5-star rating system
- Detailed review comments
- Provider reputation building
- Service-specific feedback

### 📍 **Location Intelligence**
- State-level service provider filtering
- Hyperlocal job matching
- Geographic service boundaries
- Location-aware notifications

### 🔔 **Smart Notifications**
- Real-time bid notifications for customers
- Job alert system for providers
- Email notification preferences
- Marketing communication opt-in/out

---

## 🛠 Tech Stack (Detailed)

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI framework |
| Vite | Latest | Build tool & dev server |
| React Router | 7.13.1 | Client-side routing |
| Axios | 1.13.6 | HTTP client |
| Tailwind CSS | Latest | Utility-first styling |
| Framer Motion | 12.35.1 | Animation library |
| Lucide React | 0.577.0 | Icon library |

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 14+ | Runtime environment |
| Express.js | 5.2.1 | Web framework |
| GraphQL | 15.10.1 | Query language & API |
| express-graphql | 0.12.0 | GraphQL middleware |
| JWT | 9.0.3 | Authentication |
| bcrypt | 6.0.0 | Password hashing |

### **Database**
| Technology | Version | Purpose |
|-----------|---------|---------|
| MySQL | 8.0+ | Relational database |
| Sequelize | 6.37.8 | ORM framework |
| mysql2 | 3.19.0 | MySQL driver |

### **Additional Tools**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Nodemon | 3.1.14 | Development auto-reload |
| CORS | 2.8.6 | Cross-origin requests |
| dotenv | 17.3.1 | Environment variables |
| Socket.io | 4.8.3 | Real-time communication |
| Nodemailer | 8.0.1 | Email notifications |

---

## 🧠 System Architecture & Flowchart

### High-Level Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Customer App    │  │  Provider App    │  │  Mobile Browser  │  │
│  │  (React SPA)     │  │  (React SPA)     │  │  (Responsive UI) │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│           │                     │                     │             │
└───────────┼─────────────────────┼─────────────────────┼─────────────┘
            │ HTTPS               │ HTTPS               │ HTTPS
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API/APPLICATION LAYER                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Express.js Server (Port 4000)                  │   │
│  │  ┌────────────────────────────────────────────────────────┐ │   │
│  │  │  Routes → Controllers → Business Logic → Resolvers    │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│           ▲                                         │                │
│           │  GraphQL Queries/Mutations              │                │
│           │                                         ▼                │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │ │
│  │  │   Auth       │  │   Job        │  │   Bidding    │  ...    │ │
│  │  │  Middleware  │  │  Resolvers   │  │  Resolvers   │         │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │ │
│  │                                                                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────┬──────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Sequelize ORM (Model Layer)                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │  │
│  │  │ User Model   │  │ Job Model    │  │ Provider Profile   │ │  │
│  │  └──────────────┘  └──────────────┘  │ Bid Model          │ │  │
│  │  ┌──────────────┐  ┌────────────────────────────────────┐ │  │
│  │  │ Review Model │  │  Review Model, etc.                │ │  │
│  │  └──────────────┘  └────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────┬──────────────────────────────────────────────────────┘
              │ SQL Queries
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │         MySQL Database (Port 3306)                          │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  Tables: Users, Jobs, Bids, Reviews,                │  │   │
│  │  │          ProviderProfiles, etc.                      │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│           ▲                                         │                │
│           │ Persistent Data Storage                │                │
│           │ ACID Transactions                      │                │
│           └─────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
```

### User Journey Flow

```
START
  │
  ├─► New User?
  │    └─► Sign Up (Customer/Provider)
  │         └─► Email Verification
  │         └─► Profile Completion
  │
  ├─► CUSTOMER FLOW
  │    │
  │    ├─► View Dashboard
  │    │    ├─► Create Job Request
  │    │    │    ├─► Specify Service Type
  │    │    │    ├─► Set Budget (Min-Max)
  │    │    │    ├─► Describe Job Details
  │    │    │    └─► Set Location
  │    │    │
  │    │    ├─► View Incoming Bids
  │    │    │    ├─► Compare Bids
  │    │    │    ├─► Review Provider Ratings
  │    │    │    └─► Select Best Bid
  │    │    │
  │    │    ├─► Manage Active Jobs
  │    │    │    ├─► Track Status
  │    │    │    ├─► Chat with Provider
  │    │    │    └─► Rate & Review (After Completion)
  │    │    │
  │    │    └─► View Profile & Settings
  │    │
  │    └─► Logout
  │
  ├─► PROVIDER FLOW
  │    │
  │    ├─► View Dashboard
  │    │    ├─► Browse Available Jobs
  │    │    │    ├─► Filter by Service Type
  │    │    │    ├─► View Job Details
  │    │    │    └─► Check Customer Profile
  │    │    │
  │    │    ├─► Place Bid
  │    │    │    ├─► Set Bid Price
  │    │    │    ├─► Add Message
  │    │    │    └─► Submit
  │    │    │
  │    │    ├─► Manage My Bids
  │    │    │    ├─► View Bid Status
  │    │    │    ├─► Accept Job (if selected)
  │    │    │    ├─► Complete Job
  │    │    │    └─► Receive Payment
  │    │    │
  │    │    ├─► View My Profile
  │    │    │    ├─► Portfolio
  │    │    │    ├─► Ratings & Reviews
  │    │    │    └─► Experience Details
  │    │    │
  │    │    └─► Notifications
  │    │
  │    └─► Logout
  │
  └─► END
```

---

## 📊 Database Schema

### Entity Relationship Diagram (Logical)

```
┌──────────────────────┐
│      USERS           │
├──────────────────────┤
│ id (PK)              │
│ name                 │
│ email (UNIQUE)       │
│ password (hashed)    │
│ phone                │
│ role (enum)          │◄───┐
│ state                 │    │
│ city                  │    │
│ address               │    │
│ profileCompleted      │    │
│ isPublic              │    │
│ createdAt             │    │
└──────────────────────┘    │
        ▲                     │
        │ 1:1                 │
        │                     │
        │         ┌───────────┘
        │         │
        │         │
        │    ┌────────────────────────┐
        │    │  PROVIDER_PROFILES      │
        │    ├────────────────────────┤
        │    │ id (PK)                │
        │    │ UserId (FK)            │
        │    │ services               │
        │    │ experienceYears        │
        │    │ description            │
        │    │ city                   │
        │    │ profilePicture (URL)   │
        │    │ rating (avg)           │
        │    │ totalReviews           │
        │    └────────────────────────┘
        │
        │ 1:M
        │
        ├──────────────┬──────────────┐
        │              │              │
    ┌───▼──────┐  ┌───▼──────┐  ┌──▼──────────┐
    │   JOBS   │  │  BIDS    │  │  REVIEWS    │
    ├──────────┤  ├──────────┤  ├─────────────┤
    │ id (PK)  │  │ id (PK)  │  │ id (PK)     │
    │ UserId   │  │ JobId    │  │ JobId       │
    │ (FK)     │  │ (FK)     │  │ (FK)        │
    │ service  │  │ UserId   │  │ reviewerId  │
    │ Type     │  │ (FK)     │  │ (FK)        │
    │ descrip. │  │ bidPrice │  │ providerId  │
    │ address  │  │ message  │  │ (FK)        │
    │ city     │  │ status   │  │ rating      │
    │ state    │  │ created  │  │ comment     │
    │ budget   │  │ At       │  │ createdAt   │
    │ Min/Max  │  └──────────┘  └─────────────┘
    │ date     │
    │ status   │
    │ assigned │
    │ To       │
    │ createdAt│
    └──────────┘
```

### Table Definitions

#### `users` Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('CUSTOMER', 'PROVIDER') NOT NULL,
  phone VARCHAR(20),
  state VARCHAR(100),
  city VARCHAR(100),
  address VARCHAR(255),
  houseNumber VARCHAR(50),
  profileCompleted BOOLEAN DEFAULT FALSE,
  emailNotifications BOOLEAN DEFAULT TRUE,
  bidNotifications BOOLEAN DEFAULT TRUE,
  marketingEmails BOOLEAN DEFAULT FALSE,
  newJobAlerts BOOLEAN DEFAULT TRUE,
  isPublic BOOLEAN DEFAULT TRUE,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
## Logo 


<p align="center">
  <img src="frontend/vite-project/src/assets/LOGO.png" width="200"/>
</p>


---

## ✨ Core Features

#### `provider_profiles` Table
```sql
CREATE TABLE provider_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  UserId INT NOT NULL UNIQUE,
  services VARCHAR(500),
  experienceYears INT,
  description TEXT,
  city VARCHAR(100),
  profilePicture LONGBLOB,
  rating FLOAT DEFAULT 0,
  totalReviews INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `jobs` Table
```sql
CREATE TABLE jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  UserId INT NOT NULL,
  serviceType VARCHAR(100) NOT NULL,
  description TEXT,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  budgetMin INT,
  budgetMax INT,
  date DATETIME,
  status ENUM('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'OPEN',
  assignedTo INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL
);
```

#### `bids` Table
```sql
CREATE TABLE bids (
  id INT PRIMARY KEY AUTO_INCREMENT,
  JobId INT NOT NULL,
  UserId INT NOT NULL,
  bidPrice INT NOT NULL,
  message TEXT,
  status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (JobId) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (UserId) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `reviews` Table
```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  JobId INT NOT NULL UNIQUE,
  reviewerId INT NOT NULL,
  providerId INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (JobId) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewerId) REFERENCES users(id),
  FOREIGN KEY (providerId) REFERENCES users(id)
);
```

---

## 📁 Project Structure

```
KaamOnClick/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # Database connection setup
│   │
│   ├── controllers/
│   │   └── authController.js        # Authentication logic
│   │
│   ├── graphql/
│   │   ├── schema.js                # GraphQL type definitions
│   │   ├── resolvers.js             # Query & mutation resolvers
│   │   ├── schema_old.js            # Legacy schema (deprecated)
│   │   └── resolvers_old.js         # Legacy resolvers (deprecated)
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   │
│   ├── models/
│   │   ├── index.js                 # Model associations
│   │   ├── User.js                  # User Sequelize model
│   │   ├── Job.js                   # Job Sequelize model
│   │   ├── Bid.js                   # Bid Sequelize model
│   │   ├── ProviderProfile.js       # ProviderProfile model
│   │   └── Review.js                # Review Sequelize model
│   │
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Backend dependencies
│   └── .env                         # Environment variables (not in repo)
│
├── frontend/
│   └── vite-project/
│       ├── src/
│       │   ├── auth/
│       │   │   ├── Login.jsx            # Customer/Provider login
│       │   │   ├── Register.jsx         # Registration page
│       │   │   └── ForgotPassword.jsx   # Password recovery
│       │   │
│       │   ├── components/
│       │   │   ├── Header.jsx           # Navigation header
│       │   │   ├── Sidebar.jsx          # Dashboard sidebar
│       │   │   ├── Modal.jsx            # Reusable modal component
│       │   │   ├── protectedRoutes.jsx  # Route protection HOC
│       │   │   ├── ServiceSelector.jsx  # Service type selector
│       │   │   ├── NotificationToast.jsx # Toast notifications
│       │   │   ├── CameraCapture.jsx    # Camera capture component
│       │   │   ├── UploadOptionsModal.jsx # File upload modal
│       │   │   ├── FloatingInput.jsx    # Animated input field
│       │   │   └── authCard.jsx         # Auth form card
│       │   │
│       │   ├── pages/
│       │   │   ├── Dashboard.jsx        # Main dashboard
│       │   │   ├── CreateJob.jsx        # Create job form
│       │   │   ├── JobFeed.jsx          # Available jobs list
│       │   │   ├── ViewBids.jsx         # Incoming bids view
│       │   │   ├── MyBids.jsx           # Provider's active bids
│       │   │   ├── CustomerProfile.jsx  # Customer profile page
│       │   │   ├── ProviderProfile.jsx  # Provider profile page
│       │   │   ├── Settings.jsx         # User settings page
│       │   │   ├── CompleteCustomerProfile.jsx  # Profile completion
│       │   │   ├── CompleteProviderProfile.jsx  # Provider onboarding
│       │   │   ├── SignupCustomer.jsx   # Customer signup
│       │   │   └── SignupProvider.jsx   # Provider signup
│       │   │
│       │   ├── layout/
│       │   │   ├── DashboardLayout.jsx  # Dashboard wrapper
│       │   │   └── AuthLayout.jsx       # Auth page wrapper
│       │   │
│       │   ├── data/
│       │   │   └── states.js            # India states list
│       │   │
│       │   ├── styles/
│       │   │   ├── auth.css             # Auth pages styling
│       │   │   └── global.css           # Global styles
│       │   │
│       │   ├── App.jsx                  # Main app component
│       │   ├── main.jsx                 # React entry point
│       │   ├── config.js                # API configuration
│       │   ├── App.css                  # App styles
│       │   └── index.css                # Base styles
│       │
│       ├── public/                      # Static assets
│       ├── package.json                 # Frontend dependencies
│       ├── vite.config.js               # Vite configuration
│       ├── tailwind.config.js           # Tailwind CSS config
│       ├── postcss.config.js            # PostCSS configuration
│       └── eslint.config.js             # ESLint rules
│
├── README.md                            # Project documentation
└── .gitignore                           # Git ignore rules
```

---

## 🔌 GraphQL API Schema

### Types

#### User Type
```graphql
type User {
  id: ID
  name: String
  email: String
  role: String                    # CUSTOMER | PROVIDER
  state: String
  phone: String
  address: String
  houseNumber: String
  city: String
  profileCompleted: Boolean
  emailNotifications: Boolean
  bidNotifications: Boolean
  marketingEmails: Boolean
  newJobAlerts: Boolean
  isPublic: Boolean
  language: String
  timezone: String
}
```

#### Job Type
```graphql
type Job {
  id: ID
  serviceType: String             # Plumbing, Electrician, etc.
  description: String
  address: String
  city: String
  state: String
  budgetMin: Int                  # Minimum budget in INR
  budgetMax: Int                  # Maximum budget in INR
  date: String                    # Job date (ISO format)
  status: String                  # OPEN | ASSIGNED | IN_PROGRESS | COMPLETED
  UserId: ID                      # Job creator (customer)
  assignedTo: ID                  # Assigned provider
  assignedProvider: ProviderInfo  # Provider details
  review: ReviewInfo              # Job review
  createdAt: String
}
```

#### ProviderProfile Type
```graphql
type ProviderProfile {
  id: ID
  services: String                # Comma-separated services
  experienceYears: Int            # Years of experience
  description: String             # Professional bio
  city: String
  rating: Float                   # Average rating (0-5)
  totalReviews: Int              # Number of reviews
  profilePicture: String          # Base64 image data
}
```

#### Bid Type
```graphql
type Bid {
  id: ID
  jobId: ID
  bidPrice: Int                   # Bid amount in INR
  message: String                 # Bid message
  status: String                  # PENDING | ACCEPTED | REJECTED | CANCELLED
  UserId: ID
}
```

#### DashboardStats Type
```graphql
type DashboardStats {
  totalJobs: Int                  # Total jobs created/received
  openJobs: Int                   # Open/available jobs
  assignedJobs: Int              # Jobs assigned to provider
  completedJobs: Int             # Completed jobs
  totalBids: Int                 # Total bids placed/received
  pendingBids: Int               # Pending bids
  acceptedBids: Int              # Accepted bids
  recentJobs: [Job]              # Last 5 jobs
  recentBids: [BidWithJob]       # Last 5 bids
}
```

### Key Queries

| Query | Parameters | Returns | Purpose |
|-------|-----------|---------|---------|
| `jobs` | `serviceType?` | `[Job]` | List available jobs (providers) |
| `myJobs` | — | `[Job]` | Fetch user's posted jobs (customers) |
| `bids` | `jobId!` | `[BidWithProvider]` | Get all bids for a job |
| `myBids` | — | `[BidWithJob]` | Fetch provider's placed bids |
| `dashboardStats` | — | `DashboardStats` | Get user dashboard metrics |
| `providerProfile` | `userId!` | `ProviderInfo` | Fetch provider's profile |
| `customerProfile` | `userId!` | `CustomerInfo` | Fetch customer's profile |
| `newJobsForProvider` | — | `[Job]` | Get jobs posted in last 24hrs |

### Key Mutations

| Mutation | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `registerCustomer` | `name, email, password, phone, state` | `User` | Customer signup |
| `registerProvider` | `name, email, password, phone, state, city, services, experienceYears, description` | `User` | Provider signup |
| `login` | `email!, password!, role!` | `AuthPayload` | User login |
| `completeCustomerProfile` | `phone, address, houseNumber, city, state` | `User` | Complete customer profile |
| `completeProviderProfile` | `phone, profilePicture, experienceYears, services, city, state, description` | `User` | Complete provider profile |
| `createJob` | `serviceType, description, address, city, state, budgetMin, budgetMax, date` | `Job` | Create service request |
| `placeBid` | `jobId!, bidPrice!, message?` | `Bid` | Place bid on job |
| `selectBid` | `bidId!` | `Job` | Accept bid & assign job |
| `cancelBid` | `bidId!` | `Bid` | Cancel placed bid |
| `markJobCompleted` | `jobId!, rating!, comment?` | `Job` | Complete job & review |

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MySQL** (v8.0 or higher) server running
- **Git** for version control

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/KaamOnClick.git
cd KaamOnClick
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration (see below)
nano .env

# Start the server
npm run dev
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/vite-project

# Install dependencies
npm install

# Create .env file if needed
# Update config.js with your API URL

# Start development server
npm run dev
```

### Step 4: Database Setup

```bash
# Create MySQL database
mysql -u root -p

# In MySQL shell:
CREATE DATABASE kaam_on_click;
USE kaam_on_click;

# Exit MySQL and run Sequelize migrations (if setup)
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
# GraphQL playground: http://localhost:4000/graphql
```

**Terminal 2 - Frontend Dev Server:**
```bash
cd frontend/vite-project
npm run dev
# Frontend runs on http://localhost:5173
```

### Production Build

**Frontend:**
```bash
cd frontend/vite-project
npm run build
npm run preview
```

---

## 🔑 Environment Variables

### Backend `.env` File

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kaam_on_click
DB_PORT=3306

# Server Configuration
SERVER_PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend `config.js` File

```javascript
const config = {
  API_URL: 'http://localhost:4000/graphql',
  // Add other configs as needed
};

export default config;
```

---

## 📂 Key Modules & Files

### Backend Core Files

| File | Purpose | Key Functions |
|------|---------|---------|
| `server.js` | Express server initialization | Sets up GraphQL, middleware, routes |
| `config/db.js` | Database connection | Sequelize initialization |
| `middleware/auth.js` | JWT verification | Token validation, user extraction |
| `controllers/authController.js` | Authentication logic | Registration, login, password hashing |
| `graphql/schema.js` | GraphQL type definitions | All types, queries, mutations |
| `graphql/resolvers.js` | GraphQL resolvers | Business logic for all operations |
| `models/User.js` | User Sequelize model | User table schema & methods |
| `models/Job.js` | Job Sequelize model | Job table schema & relationships |
| `models/Bid.js` | Bid Sequelize model | Bid table schema & validations |

### Frontend Key Pages

| Component | Purpose | Features |
|-----------|---------|----------|
| `Dashboard.jsx` | Main user hub | Quick stats, navigation |
| `CreateJob.jsx` | Job posting form | Service type, budget, location |
| `JobFeed.jsx` | Available jobs (providers) | Browse, filter, view details |
| `ViewBids.jsx` | Incoming bids (customers) | Compare providers, select bid |
| `MyBids.jsx` | Provider's active bids | Track status, manage bids |
| `CompleteProviderProfile.jsx` | Provider onboarding | Photo, experience, services |
| `ProviderProfile.jsx` | Provider public profile | Portfolio, ratings, reviews |

---

## 🔗 API Endpoints & Usage Examples

### Authentication Mutations

#### Register Customer
```graphql
mutation {
  registerCustomer(
    name: "John Doe"
    email: "john@example.com"
    password: "securePass123"
    phone: "+919876543210"
    state: "Haryana"
  ) {
    id
    name
    email
    role
  }
}
```

#### Login
```graphql
mutation {
  login(
    email: "john@example.com"
    password: "securePass123"
    role: "CUSTOMER"
  ) {
    token
    user {
      id
      name
      role
      profileCompleted
    }
  }
}
```

### Job Management Mutations

#### Create Job
```graphql
mutation {
  createJob(
    serviceType: "Plumbing"
    description: "Fix kitchen pipe leakage"
    address: "123 Main Street"
    city: "Gurgaon"
    state: "Haryana"
    budgetMin: 500
    budgetMax: 1500
    date: "2026-04-05T10:00:00Z"
  ) {
    id
    serviceType
    status
    createdAt
  }
}
```

#### Browse Jobs (Provider)
```graphql
query {
  jobs(serviceType: "Plumbing") {
    id
    serviceType
    description
    address
    city
    budgetMin
    budgetMax
    date
  }
}
```

### Bidding Mutations

#### Place Bid
```graphql
mutation {
  placeBid(
    jobId: 1
    bidPrice: 1000
    message: "Expert plumber with 5 years experience"
  ) {
    id
    jobId
    bidPrice
    status
    createdAt
  }
}
```

#### Select Bid
```graphql
mutation {
  selectBid(bidId: 5) {
    id
    status
    assignedTo
    assignedProvider {
      id
      name
      phone
    }
  }
}
```

---

## 👥 User Flows

### Customer User Flow

```
1. SIGNUP/LOGIN
   ↓
2. COMPLETE PROFILE
   ├─ Address
   ├─ Phone
   └─ Preferences
   ↓
3. DASHBOARD
   ├─ View Stats
   └─ Navigation
   ↓
4. CREATE JOB
   ├─ Service Type
   ├─ Budget
   ├─ Location
   └─ Description
   ↓
5. VIEW BIDS
   ├─ Compare Providers
   ├─ Check Ratings
   └─ SELECT BID
   ↓
6. TRACK JOB
   ├─ Monitor Status
   ├─ Communicate
   └─ Receive Updates
   ↓
7. COMPLETE & REVIEW
   ├─ Mark Complete
   ├─ Rate Provider
   └─ Write Review
```

### Provider User Flow

```
1. SIGNUP/LOGIN
   ↓
2. COMPLETE PROFILE
   ├─ Photo
   ├─ Experience
   ├─ Services
   └─ Description
   ↓
3. DASHBOARD
   ├─ View Stats
   └─ Bid Performance
   ↓
4. BROWSE JOBS
   ├─ Filter by Service
   ├─ View Details
   └─ Check Budget
   ↓
5. PLACE BID
   ├─ Set Price
   ├─ Add Message
   └─ Submit
   ↓
6. MANAGE BIDS
   ├─ View Status
   ├─ Track Active
   └─ Handle Rejections
   ↓
7. COMPLETE JOB
   ├─ Update Status
   └─ Receive Payment
   ↓
8. BUILD REPUTATION
   ├─ Collect Reviews
   └─ Increase Ratings
```

---

## 📋 Service Categories

The platform supports the following service types:

| Category | Icon | Examples |
|----------|------|----------|
| **Plumbing** | 🔧 | Pipe fixing, leakage repair, installation |
| **Electrical** | ⚡ | Wiring, repairs, troubleshooting |
| **Cleaning** | 🧹 | Home cleaning, maintenance |
| **Carpentry** | 🪜 | Furniture, repairs, installations |
| **Painting** | 🎨 | Interior, exterior, touch-ups |
| **AC Repair** | ❄️ | Servicing, repairs, maintenance |
| **Appliance Repair** | 🔌 | Fridge, washing machine, microwave |

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/KaamOnClick.git
   cd KaamOnClick
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code conventions
   - Add comments for complex logic

4. **Commit with clear messages**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Wait for review

### Code Guidelines

- Use meaningful variable names
- Comment on non-obvious logic
- Keep functions small and focused
- Write GraphQL queries cleanly
- Use Tailwind CSS for styling

---

## 📞 Team & Contributors

### Development Team

| Name | Role | 
|------|------|
| **Apoorva Verma** | Backend Developer | 
| **Arjit Pandey** | Backend Developer | 
| **Diya Khattar** | Frontend Developer | 
| **Amanpreet Kaur** | Frontend Developer |

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## ⭐ Support

If you found this project helpful, please consider:
- ⭐ Giving it a star on GitHub
- 🐛 Reporting bugs via Issues
- 💡 Suggesting features via Discussions
- 📢 Sharing it with the community

---

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Ensure MySQL is running
```bash
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
net start MySQL
```

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution:** Kill the process using the port
```bash
# Find process
lsof -i :4000

# Kill it
kill -9 <PID>
```

#### Frontend API Connection Issues
**Solution:** Update `config.js` with correct backend URL
```javascript
// Check if backend is running on correct port
const config = {
  API_URL: 'http://localhost:4000/graphql',
};
```

---

## 📚 Additional Resources

- [GraphQL Documentation](https://graphql.org/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<p align="center">
  <strong>Made with ❤️ by the KaamOnClick Team</strong><br/>
  <em>Simplifying service discovery, one tap at a time</em>
</p>
