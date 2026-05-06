import { useState } from "react";
import { useDispatch } from "react-redux";
import "./AdminLogin.css";
import { submintAdminLogin } from "../../../redux/features/adminLoginSlice";
import { useNavigate } from "react-router-dom";

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
);

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Enter a valid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const resultAction = await dispatch(submintAdminLogin({ email, password }));
      if (submintAdminLogin.fulfilled.match(resultAction)) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-page">
      <div className="al-blob-top-right" />
      <div className="al-blob-bottom-left" />

      <div className="al-card">
        {/* Left panel */}
        <div className="al-left-panel">
          <div className="al-brand-row">
            <div className="al-logo-mark">
              <GraduationCapIcon />
            </div>
            <span className="al-brand-name">eduvex</span>
          </div>

          <div className="al-left-content">
            <p className="al-tagline">Admin Control Center</p>
            <p className="al-sub-tagline">
              Manage courses, learners, and analytics from one place.
            </p>
            <div className="al-feature-list">
              {[
                "Course & content management",
                "User enrollment & progress",
                "Reports & analytics",
                "Role-based access control",
              ].map((f) => (
                <div key={f} className="al-feature-item">
                  <span className="al-feature-dot" />
                  <span className="al-feature-text">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="al-left-footer">
            © {new Date().getFullYear()} Eduvex. All rights reserved.
          </p>
        </div>

        {/* Right panel */}
        <div className="al-right-panel">
          <div className="al-form-header">
            <div className="al-shield-badge">
              <ShieldIcon />
            </div>
            <h1 className="al-title">Admin Sign In</h1>
            <p className="al-subtitle">Restricted access — authorized personnel only</p>
          </div>

          {error && (
            <div className="al-error-banner">
              <span className="al-error-icon">✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="al-form">
            {/* Email */}
            <div className="al-field-group">
              <label className="al-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((p) => ({ ...p, email: "" }));
                }}
                placeholder="Enter your email"
                className={`al-input${fieldErrors.email ? " al-input--error" : ""}`}
              />
              {fieldErrors.email && (
                <span className="al-field-error">{fieldErrors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="al-field-group">
              <div className="al-label-row">
                <label className="al-label" htmlFor="password">Password</label>
                <a href="/admin/forgot-password" className="al-forgot-link">
                  Forgot password?
                </a>
              </div>
              <div className="al-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((p) => ({ ...p, password: "" }));
                  }}
                  placeholder="Enter your password"
                  className={`al-input${fieldErrors.password ? " al-input--error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="al-eye-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {fieldErrors.password && (
                <span className="al-field-error">{fieldErrors.password}</span>
              )}
            </div>

            {/* Remember me */}
            {/* <label className="al-checkbox-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="al-checkbox"
              />
              <span className="al-checkbox-label">Keep me signed in for 30 days</span>
            </label> */}

            {/* Submit */}
            <button type="submit" disabled={loading} className="al-submit-btn">
              {loading ? (
                <span className="al-spinner-row">
                  <span className="al-spinner" />
                  Signing in…
                </span>
              ) : (
                "Sign in to dashboard"
              )}
            </button>
          </form>

          <p className="al-help-text">
            Need access?{" "}
            <a href="mailto:it@eduvex.com" className="al-help-link">
              Contact IT support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin

  
