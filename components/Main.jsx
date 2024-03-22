import React, { useEffect,useState } from "react"
import { Login } from "./Login"
import { Register } from "./Register"

export default function Main() {

    const [currentForm, setCurrentForm] = useState('login');
    const [loginStatus, setLoginStatus] = useState(false);

    useEffect( () => {
        const recipeUrl = 'http://localhost:3001/verify_password';
        const requestData = {
            method: 'GET',
            credentials: "include",
        };
        fetch(recipeUrl, requestData)
            .then( res => res.json() )
            .then( json => {
                if ( json.loggedIn == true ){
                    setLoginStatus(true);
                }
            });
    })

    const toggleForm = ( formName ) =>{
        setCurrentForm(formName);
    }

    return(

        <main>

            {loginStatus ? <div className="random--text">You sucessfully logged in. Now you can play!</div> :
            <div className="login-container">
                
                {
                currentForm === "login" ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
                }
            </div>
            }

        </main>

    )

}