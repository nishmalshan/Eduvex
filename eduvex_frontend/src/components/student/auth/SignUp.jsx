import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../redux/features/authSlice';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

 const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Full name is required"
    }

    if (!form.email.includes("@")) {
      return "Invalid email format"
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters"
    }

    if (!/[A-Z]/.test(form.password)) {
      return "Password must contain at least one uppercase letter"
    }

    if (!/[0-9]/.test(form.password)) {
      return "Password must contain at least one special character"
    }
    
    return null
  }

  const handleChange = (e) => 
    setForm({ ...form, [e.target.name]: e.target.value });

  // Connection to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {

      setLoading(true);

      const resultAction = await dispatch(registerUser(form));

      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/")
      } else {
        setError(resultAction.payload || "Signup failed")
      }

    } catch (error) {
      // Network error
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* ── Left: Image Panel ── */}
        <div className="relative md:w-1/2 h-64 md:h-auto flex-shrink-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80"
            alt="Students in classroom"
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-600/20 to-transparent" />
          {/* Branding badge */}
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-white text-3xl font-extrabold leading-tight tracking-tight drop-shadow-md">
              Start your <br className="hidden md:block" />learning journey.
            </p>
            <p className="text-blue-100 text-sm mt-2 drop-shadow">
              Join thousands of students achieving their goals.
            </p>
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="md:w-1/2 flex flex-col justify-center px-8 py-10 md:px-12">
          {/* Header */}
          <h1 className="text-2xl font-bold text-grey-800 tracking-tight text-center mb-1">
            Create an account
          </h1>
          <p className="text-slate-500 text-sm text-center mb-8">
            Sign up to get started today.
          </p>

          <div>
            <p className='text-xs text-red-500 text-center'>{error}</p>
          </div>
          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your Name"
                className="w-full px-4 py-3 rounded-full border border-blue-300 outline-none focus:ring-2 focus:ring-blue-400 text-sm transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                className="w-full px-4 py-3 rounded-full border border-blue-300 outline-none focus:ring-2 focus:ring-blue-400 text-sm transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your Password"
                  className="w-full px-4 py-3 rounded-full border border-blue-300 outline-none focus:ring-2 focus:ring-blue-400 text-sm pr-12 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.97 9.97 0 016.03 2.03M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-3.364l-14.728 14.728" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-200 transition-all duration-150"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Google */}
            <button className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-sm font-semibold shadow-sm transition-all duration-150">
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.5 3.1 29.6 1 24 1 14.6 1 6.7 6.7 3.2 14.8l7 5.4C12 14.3 17.5 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.8c4.3-4 6.8-10 6.8-17z"/>
                <path fill="#FBBC05" d="M10.2 28.7A14.9 14.9 0 019.5 24c0-1.6.3-3.2.7-4.7l-7-5.4A23.8 23.8 0 001 24c0 3.9.9 7.5 2.5 10.8l6.7-6.1z"/>
                <path fill="#34A853" d="M24 47c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.8c-2.1 1.4-4.8 2.3-8.5 2.3-6.5 0-12-4.8-13.8-11.2l-6.7 6.1C6.7 41.3 14.6 47 24 47z"/>
              </svg>
              {/* Continue with Google */}
            </button>

            {/* Facebook */}
            <button className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-sm font-semibold shadow-sm transition-all duration-150">
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="#1877F2">
                <path d="M32 16C32 7.163 24.837 0 16 0S0 7.163 0 16c0 7.986 5.85 14.602 13.5 15.806V20.625H9.438V16H13.5v-3.525c0-4.01 2.389-6.225 6.043-6.225 1.751 0 3.582.313 3.582.313v3.938h-2.018c-1.988 0-2.607 1.234-2.607 2.5V16h4.438l-.709 4.625H18.5v11.181C26.15 30.602 32 23.986 32 16z"/>
              </svg>
              {/* Continue with Facebook */}
            </button>
          </div>

          {/* Login redirect */}
          <p className="text-center text-sm text-slate-500 mt-7">
            Already have an account?{" "}
            <Link to='/login' className='text-blue-600 font-semibold hover:underline hover:text-blue-700 transition'>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp