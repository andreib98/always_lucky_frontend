import React, { useState } from "react";



export const Register = (props) => {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    
    
    const handleSubmit = (e) => {

        e.preventDefault();
        console.log(email);

        const recipeUrl = 'http://localhost:3001/add_user';
        const postBody = {
            email: email,
            name: name,
            password: pass
        };
        const requestMetadata = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        };
    
        fetch(recipeUrl, requestMetadata)
            .then( res => res.json() )
            .then( json => {
                alert(json)
            });


    }


    return(

        <div className="form-container">

            <form className="register-form" onSubmit={handleSubmit}>

                <label htmlFor="name">Name</label>
                <input type="text" placeholder="Name" id="name" name="name" onChange={(e) => setName(e.target.value)} value={name}></input>

                <label htmlFor="email">Email</label>
                <input type="email" placeholder="email@gmail.com" id="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email}></input>

                <label htmlFor="password">Password</label>
                <input type="password" placeholder="password" id="password" name="password" onChange={(e) => setPass(e.target.value)} value={pass}></input>

                <button type="submit" name="submit_button" value="add">Register</button>

                <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>

            </form>
            
        </div>
        

    )
}