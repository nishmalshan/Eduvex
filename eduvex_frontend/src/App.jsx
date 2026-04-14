import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import HomePage from './pages/home/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from './redux/features/authSlice'
import PublicRoute from './components/public/PublicRoute'
import ProtectedRoute from './components/public/ProtectedRoute'
import API_URL from './api/axios'

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector((state) => state.auth.isAuthenticated)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser")

    const checkAuth = async () => {
      try {
        const response = await API_URL.get("/check-auth");
        console.log(response, 'check-auth response')
        if (response.status === 200) {
          console.log(storedUser, 'stored user')
          dispatch(loginSuccess({
            user: JSON.parse(storedUser)
          }))
        }

      } catch (error) {
        console.log("Not authenticated")

      } finally {
        setLoading(false)

      }
    };


    checkAuth()
    setLoading(false)
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
        {/* <Route path='/' element={
          <PublicRoute isAuth={isAuth}>
            <LandingPage />
          </PublicRoute>
      } /> */}
      <Route path='/' element={isAuth ? <HomePage /> : <LandingPage />} />
      
        <Route path='/login' element={
          <PublicRoute isAuth={isAuth}>
            <LoginPage />
          </PublicRoute>
        }/>
        <Route path='/signup' element={
          <PublicRoute isAuth={isAuth}>
            <SignupPage />
          </PublicRoute>
        }/>
        {/* <Route path='/home' element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }/> */}
      </Routes>
    </Router>
  )
}

export default App
