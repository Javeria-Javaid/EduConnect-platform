# EduConnect - Project Overview

## Project Identity

**EduConnect** is a comprehensive educational platform that serves as a unified hub connecting schools, parents, teachers, and vendors. It simplifies the educational ecosystem by providing:

- **School Discovery & Admissions:** Parents and students can find schools, view detailed information, and apply for admissions.
- **Teacher Job Portal:** Educators can explore teaching positions and apply for jobs.
- **Vendor Services:** Educational vendors can offer products and services to schools.
- **Multi-Dashboard System:** Role-based dashboards for admins, school administrators, teachers, parents, and vendors to manage their respective operations.

### Core Purpose

To create a simpler, more connected educational experience by consolidating school management, parent engagement, teacher resources, and vendor services into one unified platform.

---

## Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.2
- **Routing:** React Router DOM 7.9.6
- **Styling:** 
  - Tailwind CSS 4.1.17
  - Vanilla CSS (custom styles)
- **UI Components:** 
  - Radix UI (comprehensive component library)
  - Shadcn/ui components
  - Lucide React (icons)
- **Animations:**
  - Framer Motion 12.23.24
  - GSAP 3.13.0
- **State Management:**
  - React Context API (AuthContext)
  - React Hook Form 7.66.1
- **Additional Libraries:**
  - Sonner (toast notifications)
  - Recharts 3.4.1 (data visualization)
  - Embla Carousel React 8.6.0
  - Class Variance Authority (CVA)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB (via Mongoose 9.0.1)
- **Authentication:**
  - Passport.js 0.7.0
  - JWT (JSON Web Tokens) 9.0.3
  - bcryptjs 3.0.3 (password hashing)
  - OAuth 2.0 (Google & GitHub)
- **Session Management:** Express Session 1.18.2
- **Security:** CORS 2.8.5
- **Environment:** dotenv 17.2.3

### Deployment & Hosting
- **Hosting:** Firebase (configured)
- **Development Server:** Vite Dev Server (port 5173)
- **Backend Server:** Express (port 5000)

---

## Architecture

### High-Level Folder Structure

```
edu-connect-c-master/
├── public/                     # Static assets
├── server/                     # Backend (Express + MongoDB)
│   ├── config/                 # Database & Passport configuration
│   │   ├── db.js              # MongoDB connection
│   │   └── passport.js        # OAuth strategies
│   ├── controllers/            # Business logic handlers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   ├── schoolController.js
│   │   └── teacherController.js
│   ├── middleware/             # Authentication & authorization middleware
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js            # User model (admin, school_admin, teacher, parent, vendor)
│   │   ├── School.js          # School listings
│   │   ├── TeacherProfile.js  # Teacher job profiles
│   │   ├── Application.js     # Job applications
│   │   └── Contact.js         # Contact form submissions
│   ├── routes/                 # API route definitions
│   │   ├── authRoutes.js      # Authentication endpoints
│   │   ├── schoolRoutes.js    # School CRUD operations
│   │   ├── teacherRoutes.js   # Teacher profile & job management
│   │   ├── adminRoutes.js     # Admin operations
│   │   └── contactRoutes.js   # Contact form handling
│   └── index.js               # Express server entry point
│
├── src/                        # Frontend (React + Vite)
│   ├── assets/                 # Images, icons, media
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Shadcn UI components (52 components)
│   │   ├── layout/             # Header, Sidebar, Footer
│   │   ├── dashboard/          # Admin dashboard components
│   │   ├── school-dashboard/   # School admin components (65 files)
│   │   ├── teacher-dashboard/  # Teacher dashboard components (12 files)
│   │   ├── parent-dashboard/   # Parent dashboard components (11 files)
│   │   ├── vendor-dashboard/   # Vendor dashboard components (10 files)
│   │   ├── schools/            # School management
│   │   ├── teachers/           # Teacher management
│   │   ├── vendors/            # Vendor management
│   │   ├── users/              # User management
│   │   ├── analytics/          # Analytics & reporting
│   │   ├── settings/           # Settings management
│   │   ├── admissions/         # Admissions processing
│   │   ├── jobs/               # Job postings
│   │   ├── reports/            # Report generation
│   │   ├── support/            # Support & help
│   │   ├── Hero/               # Landing page hero section
│   │   ├── AboutSection/       # About section
│   │   ├── FeatureSection/     # Features showcase
│   │   ├── RoleSection/        # Role-specific information
│   │   ├── ContactSection/     # Contact form
│   │   ├── Footer/             # Site footer
│   │   ├── CardNav/            # Navigation cards
│   │   ├── Communication.jsx   # Communication center
│   │   ├── ProtectedRoute.jsx  # Route protection HOC
│   │   └── Sidebar.jsx         # Generic sidebar
│   ├── context/                # React Context providers
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── dashboard/              # Dashboard layout components
│   │   ├── DashboardLayout.jsx        # Admin dashboard layout
│   │   ├── DashboardSidebar.jsx       # Admin sidebar
│   │   ├── DashboardHeader.jsx        # Admin header
│   │   ├── SchoolDashboardLayout.jsx  # School admin layout
│   │   ├── SchoolDashboardSidebar.jsx
│   │   ├── TeacherDashboardLayout.jsx # Teacher layout
│   │   ├── TeacherDashboardSidebar.jsx
│   │   ├── ParentDashboardLayout.jsx  # Parent layout
│   │   ├── ParentDashboardSidebar.jsx
│   │   ├── VendorDashboardLayout.jsx  # Vendor layout
│   │   └── VendorDashboardSidebar.jsx
│   ├── lib/                    # Utility libraries
│   ├── Styles/                 # Global CSS styles
│   ├── App.jsx                 # Main routing & app structure
│   ├── AuthPage.jsx            # Login/Signup pages
│   ├── OAuthSuccess.jsx        # OAuth callback handler
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
│
├── .env                        # Environment variables
├── .firebase/                  # Firebase deployment config
├── .firebaserc                 # Firebase project configuration
├── firebase.json               # Firebase hosting settings
├── package.json                # NPM dependencies & scripts
├── vite.config.js              # Vite configuration
├── index.html                  # HTML entry point
├── INTEGRATION_SUMMARY.md      # Authentication integration documentation
├── PROJECT_STRUCTURE_REPORT.md # Code cleanup & structure analysis
└── README.md                   # Basic setup instructions
```

### Data Flow Architecture

```
User Request
     ↓
React Router (App.jsx)
     ↓
ProtectedRoute (Role-based access control)
     ↓
Dashboard Layout (Sidebar + Header + Content)
     ↓
Component (Dashboard, Schools, Users, etc.)
     ↓
API Call (fetch to Express backend)
     ↓
Express Route Handler (server/routes/)
     ↓
Controller (server/controllers/)
     ↓
Middleware (Authentication/Authorization)
     ↓
Database (MongoDB via Mongoose)
     ↓
Response (JSON)
     ↓
React Component (State Update)
     ↓
UI Re-render
```

### Authentication Flow

1. **User visits protected route** → Redirected to `/login` if not authenticated
2. **User logs in** → Credentials validated via `/api/auth/login`
3. **Backend validates** → Hashes password, checks database, generates JWT
4. **JWT returned** → Stored in client-side context (AuthContext)
5. **Subsequent requests** → JWT sent in Authorization header
6. **Middleware validates JWT** → Grants/denies access based on role
7. **Role-based routing** → User redirected to appropriate dashboard

**Supported Roles:**
- `admin` → Full platform management
- `school_admin` → School-specific operations
- `teacher` → Class management, assignments, grading
- `parent` → Child monitoring, fees, communication
- `vendor` → Product/service management

---

## Current Functionalities

### 1. **Landing Page**
- Modern, animated hero section with call-to-action
- About section explaining platform purpose
- Feature showcase highlighting key capabilities
- Role-specific information sections
- Contact form for inquiries
- Responsive navigation with card-based menu

### 2. **Authentication System**
- **Email/Password Login:** Traditional authentication with encrypted passwords
- **OAuth 2.0 Integration:** 
  - Google OAuth (Sign in with Google)
  - GitHub OAuth (Sign in with GitHub)
- **Role-based Registration:** Users register with specific roles
- **Session Management:** JWT-based stateless authentication
- **Protected Routes:** Automatic redirection based on authentication status
- **Password Security:** bcrypt hashing with salt rounds

### 3. **Admin Dashboard** (`/dashboard`)
Role: `admin`

**Features:**
- **Dashboard Overview:** Platform statistics, recent activity, analytics
- **School Management:** CRUD operations for school listings
- **Vendor Management:** Approve/manage vendor registrations
- **User Management:** Create, edit, delete users across all roles
- **Teacher Management:** Oversee teacher profiles and applications
- **Admissions:** Monitor admission requests and approvals
- **Job Posts:** Manage teaching job postings
- **Reports:** Generate platform-wide analytics and reports
- **Support:** Handle user support tickets
- **Communication Center:** Internal messaging system
- **Settings:** Platform configuration and preferences

### 4. **School Dashboard** (`/school/dashboard`)
Role: `school_admin`

**Features:**
- **Students Management:** Enrollment, profiles, academic records
- **Teachers Management:** Hire, assign, track performance
- **Parents Management:** Parent accounts and communication
- **Classes Management:** Create classes, assign teachers
- **Exams Management:** Schedule exams, manage results
- **Timetable Management:** Create and publish class schedules
- **Attendance Tracking:** Monitor student and teacher attendance
- **Admissions Processing:** Review and approve applications
- **Finance Management:** Fee collection, expense tracking
- **Transport Management:** Bus routes, schedules, safety
- **Reports & Analytics:** School-specific performance reports
- **Settings:** School profile, preferences

### 5. **Teacher Dashboard** (`/teacher/dashboard`)
Role: `teacher`

**Features:**
- **Classes Overview:** View assigned classes and schedules
- **Attendance Management:** Mark daily attendance
- **Homework Assignment:** Create, assign, and grade homework
- **Exam Management:** Create exams, enter grades
- **Student Profiles:** View student academic history
- **Communication:** Message parents and school administration
- **Resources Library:** Access teaching materials and resources
- **Reports:** Generate student performance reports
- **Settings:** Personal profile and preferences

### 6. **Parent Dashboard** (`/parent/dashboard`)
Role: `parent`

**Features:**
- **Academic Progress:** View child's grades, assignments, performance
- **Attendance Monitoring:** Check attendance records
- **Homework Tracking:** See assigned homework and completion status
- **Exam Results:** View exam schedules and results
- **Fee Payment:** Pay school fees online
- **Transport Tracking:** Monitor bus routes and timings
- **Communication:** Message teachers and school staff
- **Settings:** Update contact information, notification preferences

### 7. **Vendor Dashboard** (`/vendor/dashboard`)
Role: `vendor`

**Features:**
- **Profile Management:** Update company information and services
- **Orders Management:** Track orders from schools
- **Inventory Management:** Manage product/service listings
- **Billing & Invoicing:** Generate invoices, payment tracking
- **Communication:** Contact schools and administration
- **Reports:** Sales analytics and performance metrics
- **Settings:** Business profile, payment methods

### 8. **School Discovery & Listings**
- Browse schools by location (city filtering)
- View detailed school profiles (facilities, fees, contact info)
- Check admission status (open/closed)
- Access school contact information and website
- Filter and search capabilities

### 9. **Teacher Job Portal**
- Post teaching positions
- Browse available jobs
- Apply for positions with profile
- Track application status
- View job requirements and details

### 10. **Communication System**
- Internal messaging between users
- Role-based communication channels
- Notification system
- Real-time updates

### 11. **Analytics & Reporting**
- Platform-wide statistics (admin)
- School-specific analytics
- Student performance reports
- Financial reports
- Attendance reports
- Custom report generation

---

## Core Components

### Frontend Components

#### **1. Authentication Components**
- **`AuthPage.jsx`:** Unified login/signup interface with form validation
- **`AuthContext.jsx`:** Global authentication state provider
- **`ProtectedRoute.jsx`:** HOC for route protection with role-based access
- **`OAuthSuccess.jsx`:** Handles OAuth callback and token exchange

#### **2. Layout Components**
- **`CardNav`:** Modern card-based navigation menu
- **`Header.jsx`:** Site-wide header with branding
- **`Footer.jsx`:** Footer with links and information
- **Dashboard Layouts:** Specialized layouts for each user role
  - `DashboardLayout.jsx` (Admin)
  - `SchoolDashboardLayout.jsx`
  - `TeacherDashboardLayout.jsx`
  - `ParentDashboardLayout.jsx`
  - `VendorDashboardLayout.jsx`
- **Sidebars:** Role-specific navigation sidebars for each dashboard

#### **3. Landing Page Components**
- **`Hero`:** Animated hero section with CTA buttons
- **`AboutSection`:** Platform introduction
- **`FeatureSection`:** Key features showcase
- **`RoleSection`:** Role-specific benefits
- **`ContactSection`:** Contact form with validation

#### **4. Dashboard Components**
- **`Dashboard.jsx`:** Admin overview with statistics
- **`SchoolManagement.jsx`:** School CRUD operations
- **`VendorManagement.jsx`:** Vendor approval and management
- **`UserManagement.jsx`:** User administration
- **`TeacherManagement.jsx`:** Teacher profile oversight
- **`Analytics.jsx`:** Data visualization and reports
- **`Settings.jsx`:** Configuration management
- **`Communication.jsx`:** Messaging center

#### **5. School-Specific Components** (65+ components)
- Student management views
- Teacher assignment interfaces
- Parent communication tools
- Class scheduling components
- Exam and grading modules
- Finance tracking dashboards
- Transport management interfaces
- Attendance tracking systems

#### **6. UI Component Library** (52 Shadcn components)
- Buttons, Forms, Inputs, Selects
- Dialogs, Modals, Alerts
- Cards, Tabs, Accordions
- Tables, Charts, Progress bars
- Tooltips, Popovers, Dropdowns
- Navigation menus, Breadcrumbs
- And more...

### Backend Components

#### **1. Models (Database Schemas)**
- **`User.js`:** User accounts with role-based access
  - Fields: firstName, lastName, email, passwordHash, role
  - Roles: admin, school_admin, teacher, parent, vendor
- **`School.js`:** School listings and profiles
  - Fields: name, address, city, vendor, description, contactEmail, contactPhone, website, admissionOpen, facilities, fees
- **`TeacherProfile.js`:** Teacher professional profiles
- **`Application.js`:** Job application tracking
- **`Contact.js`:** Contact form submissions

#### **2. Controllers (Business Logic)**
- **`authController.js`:** Registration, login, OAuth handling
- **`schoolController.js`:** School CRUD operations, filtering
- **`teacherController.js`:** Teacher profile and job management
- **`adminController.js`:** Admin-specific operations
- **`contactController.js`:** Contact form processing

#### **3. Middleware**
- **`auth.js`:** JWT verification and authentication
- **`roleCheck.js`:** Role-based authorization

#### **4. Routes (API Endpoints)**
- **`/api/auth`:** Authentication endpoints
  - `POST /register` - User registration
  - `POST /login` - User login
  - `GET /google` - Google OAuth initiation
  - `GET /google/callback` - Google OAuth callback
  - `GET /github` - GitHub OAuth initiation
  - `GET /github/callback` - GitHub OAuth callback
- **`/api/schools`:** School management
  - `GET /` - List schools (with filters)
  - `POST /` - Create school
  - `GET /:id` - Get school details
  - `PUT /:id` - Update school
  - `DELETE /:id` - Delete school
- **`/api/teacher`:** Teacher operations
  - Profile management
  - Job applications
- **`/api/admin`:** Admin operations
  - User management
  - Platform analytics
- **`/api/contact`:** Contact form handling
- **`/api/health`:** Server health check

#### **5. Configuration**
- **`db.js`:** MongoDB connection using Mongoose
- **`passport.js`:** Passport.js strategies for OAuth
  - Google OAuth 2.0 strategy
  - GitHub OAuth 2.0 strategy

---

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd edu-connect-c-master
```

#### 2. Install Dependencies

**Frontend & Backend:**
```bash
npm install
```

#### 3. Configure Environment Variables

Create or edit the `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/educonnect

# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# OAuth Credentials (Optional - Get from Google Cloud Console & GitHub Developer Settings)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

#### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
- Update `MONGODB_URI` in `.env` with your Atlas connection string

#### 5. Run the Application

**Development Mode (Frontend + Backend concurrently):**

In **Terminal 1** (Backend Server):
```bash
npm run server
```
Backend will run on: `http://localhost:5000`

In **Terminal 2** (Frontend Dev Server):
```bash
npm run dev
```
Frontend will run on: `http://localhost:5173`

**Alternative: Single Command**
```bash
npm start
```
This runs the Vite development server only. You'll need to start the backend separately.

#### 6. Access the Application

- **Landing Page:** http://localhost:5173
- **Login Page:** http://localhost:5173/login
- **Admin Dashboard:** http://localhost:5173/dashboard (requires admin login)
- **API Health Check:** http://localhost:5000/api/health

#### 7. Default Admin Credentials

Check `AuthPage.jsx` for hardcoded demo credentials (for development only):
```
Email: admin@educonnect.com
Password: password123
Role: admin
```

> **Note:** In production, remove hardcoded credentials and implement proper user registration.

### Production Build

```bash
# Build frontend for production
npm run build

# Preview production build
npm run preview
```

### Deployment (Firebase)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy
```

---

## Additional Notes

### Project Documentation
- **`INTEGRATION_SUMMARY.md`:** Detailed authentication flow and protected route implementation
- **`PROJECT_STRUCTURE_REPORT.md`:** Code cleanup history and structural improvements
- **`README.md`:** Basic Vite + React template information

### Development Best Practices
- **Code Organization:** Components organized by feature/role
- **Styling:** Combination of Tailwind utility classes and custom CSS
- **State Management:** React Context for global state (authentication)
- **API Communication:** RESTful API with Express.js
- **Security:** JWT-based authentication, bcrypt password hashing, CORS protection

### Known Considerations
- Replace OAuth placeholder credentials with actual Google/GitHub OAuth app credentials
- Implement proper error handling and validation
- Add comprehensive testing (unit, integration, e2e)
- Implement proper logging and monitoring
- Add rate limiting for API endpoints
- Implement file upload capabilities for user profiles and documents
- Add email notification system
- Implement real-time features using WebSockets (Socket.io)

---

**Last Updated:** January 2026  
**Version:** 0.0.0  
**License:** See LICENSE file
