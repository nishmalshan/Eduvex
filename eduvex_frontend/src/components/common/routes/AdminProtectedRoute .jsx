import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import API_URL from '../../../api/axios';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute  = () => {

    const dispatch = useDispatch();
    const isAdminAuth = useSelector((state) => state.adminAuth.isAuthenticated);

    useEffect(() => {

        const checkAdminAuth = async ({ children }) => {
            try {
                const response = await API_URL.get("/admin/check-auth")
                if (response.status === 200) {
                    dispatch(adminAuthSuccess({
                        admin: response.data.admin
                    }))
                }
            } catch (error) {
                console.log("Admin not authenticated")
            }
        }

        if (!isAdminAuth) {
            checkAdminAuth();
        }
    }, [dispatch, isAdminAuth])
  
    if (!isAdminAuth) {
        return <Navigate to="/admin/login" replace />
    }

    return children
}

export default AdminProtectedRoute 