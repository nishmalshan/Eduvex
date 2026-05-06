import { Navigate } from "react-router-dom";

const PublicRoute = ({ isAuth, children}) => {
    if (isAuth) {
        return <Navigate to="/" replace/>
    }

    return children
}

export default PublicRoute