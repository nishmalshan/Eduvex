import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import HomePage from './pages/home/HomePage'
import API_URL from './api/axios'
import ProtectedRoute from './components/public/ProtectedRoute';
import PublicRoute from './components/public/PublicRoute';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './redux/features/authSlice'



function App() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API_URL.get("/check-auth");

        dispatch(loginSuccess(response.data.user));
      } catch (error) {
        dispatch(logout())
        console.log("Not authenticated")
      } finally {
        setLoading(false)
      }
    };

    checkAuth();

  },[dispatch])

  useEffect(() => {
  console.log("Auth state changed:", isAuth);
}, [isAuth]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={
            <PublicRoute isAuth={isAuth}>
              <LandingPage/>
            </PublicRoute>
            }/>
          <Route path='/login' element={
            <PublicRoute isAuth={isAuth}>
                <LoginPage/>
            </PublicRoute>
            }/>
          <Route path='/signup' element={
            <PublicRoute isAuth={isAuth}>
              <SignupPage/>
            </PublicRoute>
            }/>
          <Route path='/home' element={
            <ProtectedRoute isAuth={isAuth}>
              <HomePage/>
            </ProtectedRoute>
            }>
            </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
