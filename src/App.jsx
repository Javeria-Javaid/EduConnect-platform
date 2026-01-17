import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './dashboard/DashboardLayout.jsx';
import DashboardOverview from './components/dashboard/Dashboard.jsx';
import SchoolManagement from './components/schools/SchoolManagement.jsx';
import VendorManagement from './components/vendors/VendorManagement.jsx';
import UserManagement from './components/users/UserManagement.jsx';
import TeacherManagement from './components/teachers/TeacherManagement.jsx';
import Admissions from './components/admissions/Admissions.jsx';
import JobPosts from './components/jobs/JobPosts.jsx';
import Reports from './components/reports/Reports.jsx';
import Support from './components/support/Support.jsx';
import { Communication as CommunicationCenter } from './components/Communication.jsx';
import Settings from './components/settings/Settings.jsx';
import { useAuth } from './context/AuthContext.jsx';

// School Dashboard Imports
import SchoolDashboardLayout from './dashboard/SchoolDashboardLayout.jsx';
import SchoolDashboardOverview from './components/school-dashboard/SchoolDashboardOverview.jsx';
import SchoolStudentsView from './components/school-dashboard/SchoolStudentsView.jsx';
import SchoolTeachersView from './components/school-dashboard/SchoolTeachersView.jsx';
import SchoolParentsView from './components/school-dashboard/SchoolParentsView.jsx';
import SchoolClassesView from './components/school-dashboard/SchoolClassesView.jsx';
import SchoolExamsView from './components/school-dashboard/SchoolExamsView.jsx';
import SchoolTimetableView from './components/school-dashboard/SchoolTimetableView.jsx';
import SchoolAttendanceView from './components/school-dashboard/SchoolAttendanceView.jsx';
import SchoolAdmissionsView from './components/school-dashboard/SchoolAdmissionsView.jsx';
import SchoolFinanceView from './components/school-dashboard/SchoolFinanceView.jsx';
import SchoolTransportView from './components/school-dashboard/SchoolTransportView.jsx';
import SchoolReportsView from './components/school-dashboard/SchoolReportsView.jsx';
import SchoolSettingsView from './components/school-dashboard/SchoolSettingsView.jsx';

// Teacher Dashboard Imports
import TeacherDashboardLayout from './dashboard/TeacherDashboardLayout.jsx';
import TeacherDashboardOverview from './components/teacher-dashboard/TeacherDashboardOverview.jsx';
import TeacherClassesView from './components/teacher-dashboard/TeacherClassesView.jsx';
import TeacherAttendanceView from './components/teacher-dashboard/TeacherAttendanceView.jsx';
import TeacherHomeworkView from './components/teacher-dashboard/TeacherHomeworkView.jsx';
import TeacherExamsView from './components/teacher-dashboard/TeacherExamsView.jsx';
import TeacherStudentsView from './components/teacher-dashboard/TeacherStudentsView.jsx';
import TeacherCommunicationView from './components/teacher-dashboard/TeacherCommunicationView.jsx';
import TeacherResourcesView from './components/teacher-dashboard/TeacherResourcesView.jsx';
import TeacherReportsView from './components/teacher-dashboard/TeacherReportsView.jsx';
import TeacherSettingsView from './components/teacher-dashboard/TeacherSettingsView.jsx';

// Parent Dashboard Imports
import ParentDashboardLayout from './dashboard/ParentDashboardLayout.jsx';
import ParentDashboardOverview from './components/parent-dashboard/ParentDashboardOverview.jsx';
import ParentAcademicView from './components/parent-dashboard/ParentAcademicView.jsx';
import ParentAttendanceView from './components/parent-dashboard/ParentAttendanceView.jsx';
import ParentHomeworkView from './components/parent-dashboard/ParentHomeworkView.jsx';
import ParentExamsView from './components/parent-dashboard/ParentExamsView.jsx';
import ParentFeesView from './components/parent-dashboard/ParentFeesView.jsx';
import ParentTransportView from './components/parent-dashboard/ParentTransportView.jsx';
import ParentCommunicationView from './components/parent-dashboard/ParentCommunicationView.jsx';
import ParentSettingsView from './components/parent-dashboard/ParentSettingsView.jsx';

// Vendor Dashboard Imports
import VendorDashboardLayout from './dashboard/VendorDashboardLayout.jsx';
import VendorDashboardOverview from './components/vendor-dashboard/VendorDashboardOverview.jsx';
import VendorProfileView from './components/vendor-dashboard/VendorProfileView.jsx';
import VendorOrdersView from './components/vendor-dashboard/VendorOrdersView.jsx';
import VendorInventoryView from './components/vendor-dashboard/VendorInventoryView.jsx';
import VendorBillingView from './components/vendor-dashboard/VendorBillingView.jsx';
import VendorCommunicationView from './components/vendor-dashboard/VendorCommunicationView.jsx';
import VendorReportsView from './components/vendor-dashboard/VendorReportsView.jsx';
import VendorSettingsView from './components/vendor-dashboard/VendorSettingsView.jsx';


// Import your existing landing page components
import CardNav from './components/CardNav/CardNav';
import Hero from './components/Hero/Hero';
import AboutSection from './components/AboutSection/AboutSection';
import FeatureSection from './components/FeatureSection/FeatureSection';
import RoleSection from './components/RoleSection/RoleSection';
import ContactSection from './components/ContactSection/ContactSection';
import Footer from './components/Footer/Footer';
import './index.css';

// Import new specialized pages
import DiscoverSchools from './pages/DiscoverSchools';
import ManageEnrollment from './pages/ManageEnrollment';
import CareerOpportunities from './pages/CareerOpportunities';

// Import AuthPage
import AuthPage from './AuthPage';


// --- COMPONENT 1: The Landing Page (Your original content) ---
const LandingPage = () => {
    const navigate = useNavigate();

    // Nav Items Data - Updated to match actual sections
    const navItems = [
        {
            label: "Home",
            bgColor: "#f0f9ff",
            textColor: "#0369a1",
            links: [
                { label: "Welcome", href: "#home", ariaLabel: "Welcome to EduConnect" },
                {
                    label: "Get Started",
                    href: "/login",
                    onClick: (e) => { e.preventDefault(); navigate('/login'); },
                    ariaLabel: "Get started with EduConnect"
                },
                { label: "Platform Tour", href: "#features", ariaLabel: "Take a platform tour" }
            ]
        },
        {
            label: "About",
            bgColor: "#fef7cd",
            textColor: "#854d0e",
            links: [
                { label: "Our Story", href: "#about", ariaLabel: "Learn our story" },
                { label: "Mission & Vision", href: "#about", ariaLabel: "Our mission and vision" },
                { label: "Our Team", href: "#about", ariaLabel: "Meet our team" }
            ]
        },
        {
            label: "Features",
            bgColor: "#f3e8ff",
            textColor: "#7e22ce",
            links: [
                { label: "Learning Tools", href: "#features", ariaLabel: "Learning tools and features" },
                { label: "Interactive Content", href: "#features", ariaLabel: "Interactive learning content" },
                { label: "Progress Tracking", href: "#features", ariaLabel: "Progress tracking features" }
            ]
        },
        {
            label: "Roles",
            bgColor: "#dcfce7",
            textColor: "#166534",
            links: [
                { label: "For Students", href: "#roles", ariaLabel: "Features for students" },
                { label: "For Educators", href: "#roles", ariaLabel: "Features for educators" },
                { label: "For Institutions", href: "#roles", ariaLabel: "Features for institutions" }
            ]
        },
        {
            label: "Contact",
            bgColor: "#ffe4e6",
            textColor: "#be123c",
            links: [
                { label: "Get in Touch", href: "#contact", ariaLabel: "Contact us" },
                { label: "Support", href: "#contact", ariaLabel: "Get support" },
                { label: "Partnership", href: "#contact", ariaLabel: "Partnership inquiries" }
            ]
        }
    ];

    const heroProps = {
        title: "Connecting Schools, Parents, Teachers & Vendors — All in One Place.",
        subtitle: "A simpler way to find schools, apply for admissions, explore teaching jobs, and access trusted educational services — all through one unified platform.",
        primaryButton: {
            text: "Get Started",
            onClick: () => navigate('/login')
        },
        secondaryButton: {
            text: "Platform tour",
            onClick: () => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }
        },
        background: "solid",
        backgroundProps: {
            gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
            color: "#ffffff"
        },
        className: "fade-in",
    };

    return (
        <div className="LandingPage">
            <CardNav
                logo="/educonnect_logo.png"
                logoAlt="EduConnect"
                items={navItems}
                baseColor="#1e293b"
                buttonBgColor="#66a1be"
                buttonTextColor="#ffffff"
            />
            <Hero {...heroProps} />
            <AboutSection />
            <FeatureSection />
            <RoleSection />
            <ContactSection />
            <Footer />
        </div>
    );
};

const UnauthorizedPage = () => {
    const { user, role } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h1 className="text-3xl font-semibold text-[#2563EB]">Access Restricted</h1>
            <p className="text-gray-600 max-w-md">
                You do not have the required permissions to view this area.
            </p>

            {/* DEBUG INFO */}
            <div className="bg-gray-100 p-4 rounded-lg text-left max-w-md w-full">
                <p className="font-bold mb-2">🔍 Debug Information:</p>
                <p><strong>Your Role:</strong> {role || 'Not set'}</p>
                <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
                <p><strong>User Data:</strong> {JSON.stringify(user, null, 2)}</p>
            </div>

            <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Return to Login
            </button>
        </div>
    );
};

// --- COMPONENT 2: The Main App (Handles Routing) ---
function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <div className="App">
                <Toaster position="top-right" />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<AuthPage defaultView="login" />} />
                    <Route path="/signup" element={<AuthPage defaultView="signup" />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* New Specialized Pages */}
                    <Route path="/discover-schools" element={<DiscoverSchools />} />
                    <Route path="/manage-enrollment" element={<ManageEnrollment />} />
                    <Route path="/career-opportunities" element={<CareerOpportunities />} />

                    {/* Protected Admin Routes - Nested structure with ProtectedRoute and DashboardLayout */}
                    <Route
                        path="/dashboard"
                        element={<ProtectedRoute allowedRoles={['admin']} />}
                    >
                        {/* DashboardLayout wraps all dashboard child routes */}
                        <Route element={<DashboardLayout />}>
                            <Route index element={<DashboardOverview />} />
                            <Route path="schools" element={<SchoolManagement />} />
                            <Route path="vendors" element={<VendorManagement />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="teachers" element={<TeacherManagement />} />
                            <Route path="admissions" element={<Admissions />} />
                            <Route path="jobs" element={<JobPosts />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="support" element={<Support />} />
                            <Route path="communication" element={<CommunicationCenter />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Route>

                    {/* Protected School Admin Routes */}
                    <Route
                        path="/school/dashboard"
                        element={<ProtectedRoute allowedRoles={['school_admin']} />}
                    >
                        <Route element={<SchoolDashboardLayout />}>
                            <Route index element={<SchoolDashboardOverview />} />
                            <Route path="students" element={<SchoolStudentsView />} />
                            <Route path="teachers" element={<SchoolTeachersView />} />
                            <Route path="parents" element={<SchoolParentsView />} />
                            <Route path="classes" element={<SchoolClassesView />} />
                            <Route path="exams" element={<SchoolExamsView />} />
                            <Route path="timetable" element={<SchoolTimetableView />} />
                            <Route path="attendance" element={<SchoolAttendanceView />} />
                            <Route path="admissions" element={<SchoolAdmissionsView />} />
                            <Route path="finance" element={<SchoolFinanceView />} />
                            <Route path="transport" element={<SchoolTransportView />} />
                            <Route path="reports" element={<SchoolReportsView />} />
                            <Route path="settings" element={<SchoolSettingsView />} />
                        </Route>
                    </Route>

                    {/* Protected Teacher Routes */}
                    <Route
                        path="/teacher/dashboard"
                        element={<ProtectedRoute allowedRoles={['teacher']} />}
                    >
                        <Route element={<TeacherDashboardLayout />}>
                            <Route index element={<TeacherDashboardOverview />} />
                            <Route path="classes" element={<TeacherClassesView />} />
                            <Route path="attendance" element={<TeacherAttendanceView />} />
                            <Route path="homework" element={<TeacherHomeworkView />} />
                            <Route path="exams" element={<TeacherExamsView />} />
                            <Route path="students" element={<TeacherStudentsView />} />
                            <Route path="communication" element={<TeacherCommunicationView />} />
                            <Route path="resources" element={<TeacherResourcesView />} />
                            <Route path="reports" element={<TeacherReportsView />} />
                            <Route path="settings" element={<TeacherSettingsView />} />
                        </Route>
                    </Route>

                    {/* Protected Parent Routes */}
                    <Route
                        path="/parent/dashboard"
                        element={<ProtectedRoute allowedRoles={['parent']} />}
                    >
                        <Route element={<ParentDashboardLayout />}>
                            <Route index element={<ParentDashboardOverview />} />
                            <Route path="academic" element={<ParentAcademicView />} />
                            <Route path="attendance" element={<ParentAttendanceView />} />
                            <Route path="homework" element={<ParentHomeworkView />} />
                            <Route path="exams" element={<ParentExamsView />} />
                            <Route path="fees" element={<ParentFeesView />} />
                            <Route path="transport" element={<ParentTransportView />} />
                            <Route path="communication" element={<ParentCommunicationView />} />
                            <Route path="settings" element={<ParentSettingsView />} />
                        </Route>
                    </Route>

                    {/* Protected Vendor Routes */}
                    <Route
                        path="/vendor/dashboard"
                        element={<ProtectedRoute allowedRoles={['vendor']} />}
                    >
                        <Route element={<VendorDashboardLayout />}>
                            <Route index element={<VendorDashboardOverview />} />
                            <Route path="profile" element={<VendorProfileView />} />
                            <Route path="orders" element={<VendorOrdersView />} />
                            <Route path="inventory" element={<VendorInventoryView />} />
                            <Route path="billing" element={<VendorBillingView />} />
                            <Route path="communication" element={<VendorCommunicationView />} />
                            <Route path="reports" element={<VendorReportsView />} />
                            <Route path="settings" element={<VendorSettingsView />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route
                        path="*"
                        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;