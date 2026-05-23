import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/user/public/LandingPage'
import LoginPage from './pages/user/auth/LoginPage'
import SignupPage from './pages/user/auth/SignupPage'
import HomePage from './pages/user/home/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from './redux/features/authSlice'
import API_URL from './api/axios'
import GoogleSuccess from './pages/user/auth/GoogleSuccess'
import AdminLogin from './components/admin/auth/AdminLogin'
import { adminAuthSuccess } from './redux/features/adminAuthSlice'
import Loader from './components/common/layout/Loader'
import DashboardPage from './pages/admin/DashboardPage'
import TutorApplicationsPage from './pages/admin/TutorApplicationsPage'
import AdminLayout from './components/common/layout/AdminLayout'
import TutorsList from './components/admin/dashboard/TutorsList'
import UsersPage from './pages/admin/UsersPage'
import CoursesPage from './pages/admin/CoursesPage'
import TutorApplicationPage from './components/tutor/home/TutorApplicationPage'

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
        console.log('check admin')
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
    return <Loader/>
  }

  return (
    <Router>
  <Routes>

    {/* Home */}
    <Route path='/' element={isUserAuth ? <HomePage /> : <LandingPage />} />

    {/* Auth */}
    <Route path='/login' element={isUserAuth ? <Navigate to="/" /> : <LoginPage />} />
    <Route path='/signup' element={isUserAuth ? <Navigate to="/" /> : <SignupPage />} />
    <Route path='/google-success' element={<GoogleSuccess />} />

    {/* Tutor */}
    <Route
      path='/tutor/application'
      element={isUserAuth ? <TutorApplicationPage /> : <Navigate to="/login" replace />}
    />

    {/* Admin Login */}
    <Route
      path='/admin/login'
      element={isAdminAuth ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />}
    />

    {/* Admin Protected Routes */}
    <Route
      path='/admin'
      element={isAdminAuth ? <AdminLayout /> : <Navigate to="/admin/login" replace />}
    >
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='tutors' element={<TutorApplicationsPage />} />
        <Route path='tutorList' element={<TutorsList />} />
        <Route path='users' element={<UsersPage />} />
        <Route path='courses' element={<CoursesPage />} />
    </Route>

  </Routes>
</Router>
  )
}

export default App