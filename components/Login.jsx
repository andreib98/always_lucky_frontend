import React, { useEffect, useReducer, useState } from "react";
import Cookies from "js-cookie";
import AuthApi from "./AuthApi";





export const Login = (props) => {


    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const [loginStatus, setLoginStatus] = useState(false);

    // const Auth = React.useContext(AuthApi);

    const handleSubmit = (e) => {

        e.preventDefault();
        
        const recipeUrl = import.meta.env.VITE_BACKENDIP+'/verify_password';
        const postBody = {
            email: email,
            password: pass
        };
        const requestMetadata = {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                "x-access-token" : localStorage.getItem("token")
            },
            body: JSON.stringify(postBody)
        };
    
        fetch(recipeUrl, requestMetadata)
            .then( res => res.json() )
            .then( json => {
                if ( json.logat ) {
                    localStorage.setItem("session",json.token);
                    window.location.reload(false);
                } else {
                    alert(json.message);
                }
            });

    }

    useEffect( () => {
        const recipeUrl = import.meta.env.VITE_BACKENDIP+'/verify_password';
        const requestData = {
            method: 'GET',
            credentials: "include",
            headers: {
                "x-access-token" : localStorage.getItem("token")
            },
        };
        fetch(recipeUrl, requestData)
            .then( res => res.json() )
            .then( json => {
                if ( json.loggedIn == true ){
                    setLoginStatus(true);
                    // Auth.setAuth(true);
                    // Cookies.set(json.user[0].full_name,"loginTrue");
                }
            });
    })

    return(

        <div className="form-container">
            <form className="login-form" onSubmit={handleSubmit}>

                <label htmlFor="email">Email</label>
                <input type="email" placeholder="email@gmail.com" id="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email}></input>

                <label htmlFor="password">Password</label>
                <input type="password" placeholder="password" id="password" name="password" onChange={(e) => setPass(e.target.value)} value={pass}></input>

                <button type="submit" name="submit_button" >Log in</button>

                <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>

            </form>
            
        </div>

    )
}