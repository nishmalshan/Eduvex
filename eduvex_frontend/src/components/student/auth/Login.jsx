import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../redux/features/authSlice';

const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    if (!form.email.includes("@")) {
      return "Invalid email format"
    }

    if (!form.password) {
      return "Password is required"
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)

      const resultAction = await dispatch(loginUser(form))
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/")
      } else {
        setError(resultAction.payload || "Login failed")
      }
    } catch (error) {
      // Network error
      setError("Network error. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  // For demonstration, this just redirects to the backend Google auth route. In a real app, you'd want to handle the OAuth flow more robustly.
  const handleGoogleLogin = () => {
    try {
      window.location.href = "http://localhost:5000/auth/google";
    } catch (error) {
      setError("Google login failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">

        {/* ── Left: Image Panel ── */}
        <div className="hidden md:block md:w-1/2 relative min-h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80"
            alt="Students in classroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/25 to-transparent" />
        </div>

        {/* Mobile image banner */}
        <div className="block md:hidden h-48 w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80"
            alt="Students in classroom"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-10 sm:px-12">

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
            Welcome! Sign in with email
          </h2>
          <p className="text-sm text-slate-500 text-center mb-7">
            Enter your credentials to access your account
          </p>

          {/* Login / Register toggle */}
          {/* <div className="flex justify-center mb-8">
            <div className="inline-flex bg-blue-100 rounded-full p-1">
              <button className="px-8 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow">
                Login
              </button>
              <a
                href="/register"
                className="px-8 py-2 rounded-full text-sm font-semibold text-blue-600 hover:bg-blue-200 transition-colors duration-200"
              >
                Register
              </a>
            </div>
          </div> */}

          {error && (
            <p className="text-red-500 text-xs text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="w-full px-4 py-3 rounded-full border border-blue-300 outline-none focus:ring-2 focus:ring-blue-400 text-sm transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 mb-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                className="w-full px-4 py-3 rounded-full border border-blue-300 outline-none focus:ring-2 focus:ring-blue-400 text-sm pr-12 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-5">
            <a href="/forgot-password" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
            <button
              type='submit'
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 rounded-full shadow-md shadow-blue-200 transition-all duration-200">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Google */}
            <button 
              className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-sm font-semibold shadow-sm transition-all duration-150"
              onClick={handleGoogleLogin}
            >
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

          {/* Sign up redirect */}
          <p className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to='/signup' className='text-blue-600 font-semibold hover:underline'>Sign up here</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login