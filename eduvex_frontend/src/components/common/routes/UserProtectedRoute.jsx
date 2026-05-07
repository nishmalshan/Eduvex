import { useEffect, useState } from "react";
import API_URL from "../../../api/axios";
import { loginSuccess } from "../../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";




const UserProtectedRoute = () => {

    const isUserAuth = useSelector((state) => state.auth.isAuthenticated)

    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();

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

      } finally {
        setLoading(false)
      }
    };

    if (!isUserAuth) {
        checkAuth();
    }
  

  }, [dispatch, isUserAuth])
  
  if (!isUserAuth) {
        return <Navigate to="/login" replace />
    }
}

export default UserProtectedRoute