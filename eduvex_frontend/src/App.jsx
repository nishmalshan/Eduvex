import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/student/public/LandingPage'
import LoginPage from './pages/student/auth/LoginPage'
import SignupPage from './pages/student/auth/SignupPage'
import HomePage from './pages/student/home/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from './redux/features/authSlice'
// import PublicRoute from './components/common/routes/PublicRoute'
// import ProtectedRoute from './components/common/routes/ProtectedRoute'
import API_URL from './api/axios'
import GoogleSuccess from './pages/student/auth/GoogleSuccess'
import TutorApplicationForm from './components/tutor/TutorApplicationForm'
import AdminLogin from './components/admin/auth/AdminLogin'
import AdminDashboard from './components/admin/dashboard/AdminDashboard'
import { adminAuthSuccess } from './redux/features/adminAuthSlice'

function App() {
  const dispatch = useDispatch()
  const isUserAuth = useSelector((state) => state.auth.isAuthenticated)
  const isAdminAuth = useSelector((state) => state.adminAuth.isAuthenticated)
  const [loading, setLoading] = useState(true)
  // console.log(isUserAuth, 'isUserAuth')
  console.log(isAdminAuth, 'isAdminAuth')

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const response = await API_URL.get("/check-auth");
        console.log(response, 'user check-auth response')
        if (response.status === 200) {
          dispatch(loginSuccess({
            user: response.data.user
          }))
        }

      } catch (error) {
        console.log("User not authenticated")
      }
    };
    
    const checkAdminAuth = async () => {
      try {
        console.log('check admin 111111111111')
        const response = await API_URL.get("/admin/check-auth");
        console.log(response, 'admin check-auth response')
        if (response.status === 200) {
          dispatch(adminAuthSuccess({
            admin: response.data.admin
          }))
        }
      } catch (error) {
        console.log("Admin not authenticated")
      }
    }

    const verifyAuth = async () => {
      try {
        await checkAuth();
        await checkAdminAuth();
      } finally {
        setLoading(false)
      }
    }

    verifyAuth();
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={isUserAuth ? <HomePage /> : <LandingPage />} />

        <Route path='/login' element={ isUserAuth ? <Navigate to="/"/> : <LoginPage /> } />
        <Route path='/signup' element={ isUserAuth ? <Navigate to="/"/> : <SignupPage /> } />
        <Route path='/google-success' element={<GoogleSuccess />} />

        {/* Become a tutor form */}
        <Route path='/tutor/application' element={ isUserAuth ? <TutorApplicationForm/> : <Navigate to="/login" replace /> }/>


        {/* Admin login route */}
        <Route path='/admin/login' element={ isAdminAuth ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin/> } />
        <Route path='/admin/dashboard' element={ isAdminAuth ? <AdminDashboard/> : <Navigate to="/admin/login" replace /> } />
      </Routes>
    </Router>
  )
}

export default App
