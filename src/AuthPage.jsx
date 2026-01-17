import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import './AuthPage.css';
import { FaGoogle, FaGithub, FaSignInAlt, FaUserPlus, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from './context/AuthContext.jsx';

// --- MOCK CREDENTIALS FOR DEVELOPMENT ---
// COMPREHENSIVE TEST CREDENTIALS WITH ROLE-BASED DATA
const TEST_CREDENTIALS = [
    {
        email: "superadmin@educonnect.com",
        password: "Admin@123",
        role: "admin",
        name: "System Administrator",
        dashboard: "/dashboard"
    },
    {
        email: "school@educonnect.edu",
        password: "School@456",
        role: "school_admin",
        name: "School Administrator",
        schoolId: "SCH001",
        schoolName: "Greenwood High School",
        dashboard: "/school/dashboard"
    },
    {
        email: "teacher@educonnect.edu",
        password: "Teacher@789",
        role: "teacher",
        name: "Demo Teacher",
        teacherId: "TCH001",
        subjects: ["Mathematics", "Physics"],
        dashboard: "/teacher/dashboard"
    },
    {
        email: "parent@educonnect.com",
        password: "Parent@101",
        role: "parent",
        name: "Parent User",
        parentId: "PAR001",
        studentIds: ["STU001", "STU002"],
        students: ["Ahmed Ali", "Sara Ali"],
        dashboard: "/parent/dashboard"
    },
    {
        email: "vendor@educonnect.com",
        password: "Vendor@112",
        role: "vendor",
        name: "Vendor Supplier",
        vendorId: "VEN001",
        companyName: "Quick Supply Co.",
        services: ["Transport", "Catering", "Stationery"],
        dashboard: "/vendor/dashboard"
    }
];

// Legacy format for backward compatibility
const CREDENTIALS = {
    'superadmin@educonnect.com': { password: 'Admin@123', role: 'admin' },
    'school@educonnect.edu': { password: 'School@456', role: 'school_admin' },
    'teacher@educonnect.edu': { password: 'Teacher@789', role: 'teacher' },
    'parent@educonnect.com': { password: 'Parent@101', role: 'parent' },
    'vendor@educonnect.com': { password: 'Vendor@112', role: 'vendor' }
};
// ----------------------------------------

const AuthPage = ({ defaultView = 'login' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, role: userRole } = useAuth();
    const [isLoginView, setIsLoginView] = useState(defaultView !== 'signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [currentStep] = useState(1);
    const [role, setRole] = useState('admin'); // Default role
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsLoginView(defaultView !== 'signup');
        setLoginError('');
    }, [defaultView]);

    const toggleView = (isLogin) => {
        setIsLoginView(isLogin);
        setLoginError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsSubmitting(true);

        // Trim whitespace from inputs
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword })
            });

            const data = await res.json();

            if (res.ok) {
                // Check if the selected role matches the user's actual role
                if (data.role !== role && data.role !== 'admin') { 
                    setLoginError(`Login successful but you are not a ${role}. You are a ${data.role}.`);
                    setIsSubmitting(false);
                    return; 
                }

                console.log("✅ Login Successful!", data);

                // Pass full user data to auth context
                login(data);

                // Redirect based on role
                const from = location.state?.from?.pathname;
                if (from) {
                    navigate(from, { replace: true });
                } else {
                    // Determine dashboard path based on role
                    let dashboardPath = '/dashboard';
                    switch (data.role) {
                        case 'school_admin': dashboardPath = '/school/dashboard'; break;
                        case 'teacher': dashboardPath = '/teacher/dashboard'; break;
                        case 'parent': dashboardPath = '/parent/dashboard'; break;
                        case 'vendor': dashboardPath = '/vendor/dashboard'; break;
                        case 'admin': dashboardPath = '/dashboard'; break;
                        default: dashboardPath = '/dashboard';
                    }
                    navigate(dashboardPath, { replace: true });
                }
            } else {
                setLoginError(data.message || 'Invalid email or password. Please check your credentials.');
                console.log("❌ Login Failed", data);
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [signupFirstName, setSignupFirstName] = useState('');
    const [signupLastName, setSignupLastName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupMessage, setSignupMessage] = useState('');

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setSignupMessage('');
        setIsSubmitting(true);
        const payload = {
            firstName: signupFirstName.trim(),
            lastName: signupLastName.trim(),
            email: signupEmail.trim(),
            password: signupPassword,
            role,
        };
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (res.ok) {
                setSignupMessage('Account created successfully! Logging you in...');
                
                // Auto-login after signup
                login(data);

                // Redirect based on role
                let dashboardPath = '/dashboard';
                switch (data.role) {
                    case 'school_admin': dashboardPath = '/school/dashboard'; break;
                    case 'teacher': dashboardPath = '/teacher/dashboard'; break;
                    case 'parent': dashboardPath = '/parent/dashboard'; break;
                    case 'vendor': dashboardPath = '/vendor/dashboard'; break;
                    case 'admin': dashboardPath = '/dashboard'; break;
                    default: dashboardPath = '/dashboard';
                }
                setTimeout(() => {
                    navigate(dashboardPath, { replace: true });
                }, 1000);

                setSignupFirstName('');
                setSignupLastName('');
                setSignupEmail('');
                setSignupPassword('');
            } else {
                setSignupMessage(data.message || 'Signup failed.');
            }
        } catch (error) {
            console.error("Signup error:", error);
            setSignupMessage('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialLogin = (provider) => {
        window.location.href = `/api/auth/${provider}?role=${role}`;
    };

    const renderLoginForm = () => (
        <div className="form-container login-form-container">
            <form className="login-form" onSubmit={handleLoginSubmit}>
                <h2>Welcome Back!</h2>
                <p className="form-subtitle">Log in to continue your journey with EduConnect.</p>

                <div className="social-login-container">
                    <button type="button" className="social-login-btn google" onClick={() => handleSocialLogin('google')}>
                        <FaGoogle className="social-icon" /> Google
                    </button>
                    <button type="button" className="social-login-btn github" onClick={() => handleSocialLogin('github')}>
                        <FaGithub className="social-icon" /> Github
                    </button>
                </div>

                <div className="or-divider">Or</div>

                {/* Role Selection */}
                <div className="role-selection-container" style={{ marginBottom: '15px', width: '100%' }}>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="role-select"
                    >
                        <option value="admin">Super Admin</option>
                        <option value="school_admin">School Administrator</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="vendor">Vendor</option>
                    </select>
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#999'
                        }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {loginError && <p className="login-error-message">{loginError}</p>}

                <div className="forgot-password-link">
                    <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                </div>

                <button type="submit" className="login-submit-btn">
                    <FaSignInAlt className="submit-icon" /> Log In
                </button>

                <p className="signup-link-text">
                    Don't have an account?
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleView(false); }}> Sign Up</a>
                </p>
            </form>
        </div>
    );

    const renderSignupForm = () => (
        <div className="form-container signup-form-container">
            <form className="signup-form" onSubmit={handleSignupSubmit}>
                <h2>Create Account</h2>
                <p className="form-subtitle"></p>

                <div className="social-login-container">
                    <button type="button" className="social-login-btn google" onClick={() => handleSocialLogin('google')}>
                        <FaGoogle className="social-icon" /> Google
                    </button>
                    <button type="button" className="social-login-btn github" onClick={() => handleSocialLogin('github')}>
                        <FaGithub className="social-icon" /> Github
                    </button>
                </div>

                <div className="or-divider">Or</div>

                {/* Role Selection for Signup */}
                <div className="role-selection-container" style={{ marginBottom: '15px', width: '100%' }}>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="role-select"
                    >
                        <option value="admin">Super Admin</option>
                        <option value="school_admin">School Administrator</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="vendor">Vendor</option>
                    </select>
                </div>

                <div className="name-fields">
                    <input type="text" placeholder="First Name" required value={signupFirstName} onChange={(e) => setSignupFirstName(e.target.value)} />
                    <input type="text" placeholder="Last Name" required value={signupLastName} onChange={(e) => setSignupLastName(e.target.value)} />
                </div>
                <input type="email" placeholder="Email" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />

                <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        style={{ width: '100%' }}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#999'
                        }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <small>Must be at least 8 characters.</small>
                {signupMessage && <p className="login-error-message">{signupMessage}</p>}

                <button type="submit" className="signup-submit-btn">
                    <FaUserPlus className="submit-icon" /> Sign Up
                </button>

                <p className="login-link-text">
                    Already have an account?
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleView(true); }}> Log In</a>
                </p>
            </form>
        </div>
    );

    // 2. Left Panel Content (Steps/Text)
    const renderLeftPanelContent = () => {
        if (isLoginView) {
            return (
                <div className="panel-content login-panel-content">
                    <h1>Join Our Community</h1>
                    <p>Don't have an account yet? Sign up to access all the features of the EduConnect platform.</p>
                    <button className="auth-left-cta" onClick={() => toggleView(false)}>
                        Sign Up <FaUserPlus />
                    </button>
                </div>
            );
        } else {
            return (
                <div className="panel-content signup-panel-content">
                    <h1>Get Started with Us</h1>
                    <p>Complete these easy steps to register your account.</p>

                    <div className="auth-steps-container">
                        <div className={`auth-step-item ${currentStep === 1 ? 'active' : ''}`}>
                            <div className="auth-step-number">1</div>
                            <div className="auth-step-text">Sign up your account</div>
                        </div>
                        <div className={`auth-step-item ${currentStep === 2 ? 'active' : ''}`}>
                            <div className="auth-step-number">2</div>
                            <div className="auth-step-text">Set up your workspace</div>
                        </div>
                        <div className={`auth-step-item ${currentStep === 3 ? 'active' : ''}`}>
                            <div className="auth-step-number">3</div>
                            <div className="auth-step-text">Set up your profile</div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    // If already authenticated, redirect to role-specific dashboard
    if (isAuthenticated) {
        const from = location.state?.from?.pathname;
        // If we have a specific destination, go there
        if (from) {
            return <Navigate to={from} replace />;
        }
        // Otherwise, redirect based on role
        switch (userRole) {
            case 'admin':
                return <Navigate to="/dashboard" replace />;
            case 'school_admin':
                return <Navigate to="/school/dashboard" replace />;
            case 'teacher':
                return <Navigate to="/teacher/dashboard" replace />;
            case 'parent':
                return <Navigate to="/parent/dashboard" replace />;
            case 'vendor':
                return <Navigate to="/vendor/dashboard" replace />;
            default:
                return <Navigate to="/dashboard" replace />;
        }
    }

    return (
        <div className="auth-page-wrapper dark-theme">
            <button
                className="back-to-home-btn"
                onClick={() => navigate('/')}
                title="Back to Landing Page"
            >
                <FaArrowLeft size={20} />
            </button>

            <div className={`auth-card-container ${!isLoginView ? 'right-panel-active' : ''}`}>
                {/* Sign Up Form */}
                <div className={`form-section signup-active`}>
                    {renderSignupForm()}
                </div>

                {/* Login Form */}
                <div className={`form-section login-active`}>
                    {renderLoginForm()}
                </div>

                {/* Overlay Container */}
                <div className={`overlay-container ${!isLoginView ? 'overlay-active' : ''}`}>
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            {renderLeftPanelContent()}
                        </div>
                        <div className="overlay-panel overlay-right">
                            {renderLeftPanelContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
