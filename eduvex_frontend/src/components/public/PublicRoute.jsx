import { Navigate } from "react-router-dom";

const PublicRoute = ({ isAuth, children}) => {
    if (isAuth) {
        console.log(isAuth,'isAuth public')
        return <Navigate to="/home" replace/>
    }

    return children
}

export default PublicRoute