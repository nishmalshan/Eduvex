import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/student/public/LandingPage'
import LoginPage from './pages/student/auth/LoginPage'
import SignupPage from './pages/student/auth/SignupPage'
import HomePage from './pages/student/home/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from './redux/features/authSlice'
import API_URL from './api/axios'
import GoogleSuccess from './pages/student/auth/GoogleSuccess'
import TutorApplicationForm from './components/tutor/TutorApplicationForm'
import AdminLogin from './components/admin/auth/AdminLogin'
import AdminDashboard from './components/admin/dashboard/AdminDashboard'
import { adminAuthSuccess } from './redux/features/adminLoginSlice'
import AdminProtectedRoute from './components/common/routes/AdminProtectedRoute '

function App() {
  const dispatch = useDispatch()
  const isUserAuth = useSelector((state) => state.auth.isAuthenticated)
  const isAdminAuth = useSelector((state) => state.adminAuth.isAuthenticated)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const response = await API_URL.get("/check-auth");
        console.log(response, 'check-auth response111')
        if (response.status === 200) {
          dispatch(loginSuccess({
            user: response.data.user
          }))
        }

      } catch (error) {
        console.log("User not authenticated")

      } finally {
        setLoading(false)
      }
    };
  
       checkAuth();

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

        <Route path='/login' element={ isUserAuth ? <HomePage /> : <LoginPage /> } />
        <Route path='/signup' element={ isUserAuth ? <HomePage /> : <SignupPage /> } />
        <Route path='/google-success' element={<GoogleSuccess />} />

        {/* Become a tutor form */}
        <Route path='/tutor/application' element={ isUserAuth ? <TutorApplicationForm/> : <LoginPage /> }/>


        {/* Admin login route */}
        <Route path='/admin/login' element={ isAdminAuth ? <AdminDashboard/> : <AdminLogin/> } />
        
        <Route path='/admin/dashboard' element={
          <AdminProtectedRoute>
            <AdminDashboard/>
          </AdminProtectedRoute>
         } />
      </Routes>
    </Router>
  )
}

export default App
