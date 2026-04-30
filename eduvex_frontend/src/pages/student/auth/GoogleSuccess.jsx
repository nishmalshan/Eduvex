import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../../../redux/features/authSlice';
import { useDispatch } from 'react-redux';

const GoogleSuccess = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Extract the token from the URL
        const params = new URLSearchParams(window.location.search);
        console.log(params,'params')
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
        console.log(user,'google auth user')

        if (user && token) {
            console.log('gggg11111111')
            dispatch(loginSuccess({
                user,
                token
            }))
            navigate("/");
        }
    }, []);


    return <div>Signing you in...</div>
}

export default GoogleSuccess