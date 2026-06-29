import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../../../redux/features/authSlice';
import { useDispatch } from 'react-redux';

const OAuthSuccess = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        // Extract the token from the URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const id = params.get("id");
        const name = params.get("name");
        const email = params.get("email");
        const isBlocked = params.get("isBlocked");


        const user = {
            id,
            fullName: name,
            email,
            isBlocked
        };

        if (user && token) {
            dispatch(loginSuccess({
                user,
                token
            }))
            navigate("/" , { replace: true });
        }
    }, []);


    return <div>Signing you in...</div>
}

export default OAuthSuccess