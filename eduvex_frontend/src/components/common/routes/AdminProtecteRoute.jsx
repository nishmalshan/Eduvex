// import React from 'react'
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';

// const AdminProtectedRoute = ({ children }) => {

//     const isAuthenticated = useSelector((state) => state.adminAuth.isAuthenticated)
//     if (!isAuthenticated) {
//     return <Navigate to="/admin/login" replace/>;
//   }
//   return children;
// }

// export default AdminProtectedRoute