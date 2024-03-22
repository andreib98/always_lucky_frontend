import React, { useEffect,useState } from "react"
import { FaBars, FaTimes } from "react-icons/fa";
import { useRef } from "react";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import Cookies from "js-cookie";

export default function Navbar() {


    const navRef = useRef();
    const path = window.location.pathname

    const [email, setEmail] = useState('');
    const [loginStatus, setLoginStatus] = useState(false);

    useEffect( () => {
        const recipeUrl = 'http://localhost:8081/verify_password';
        const requestData = {
            method: 'GET',
            credentials: "include",
        };
        fetch(recipeUrl, requestData)
            .then( res => res.json() )
            .then( json => {
                if ( json.loggedIn == true ){
                    setEmail(json.user[0].email);
                    setLoginStatus(true);
                }
            });
    })

    const logOut = (e) => {

        e.preventDefault();
        

        const recipeUrl = 'http://localhost:8081/logout';
       
        const requestMetadata = {
            method: 'GET',
            credentials: "include"
        };
    
        fetch(recipeUrl, requestMetadata)
            .then( res => res.json() )
            .then( json => {
                if ( json.loggedIn == false ) {
                    window.localStorage.clear();
                    window.location.reload(false);
                } else {
                    alert("INCA E LOGAT");
                }
            });

    }

    const showNavBar = () =>{
        navRef.current.classList.toggle("responsive_nav");
    }

    return (
        <header>
            <nav ref={navRef}>
                
                <NavLink to="/home">Home</NavLink>
                {loginStatus ? <NavLink to="/play">Play</NavLink> : <NavLink to="/main">Play</NavLink>}
                
                <NavLink to="/shop">Shop</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                {loginStatus ? <button className="logOut" onClick={logOut}>Logout</button> : <NavLink to="/main">Login</NavLink>}
                {/* {loginStatus ? null : <NavLink to="/main">Login</NavLink>} */}

                

                <button className="nav-btn nav-close-btn" onClick={showNavBar}>
                    <FaTimes />
                </button>
            </nav>
            <button className="nav-btn" onClick={showNavBar}>
                <FaBars />
            </button>
        </header>
    )
}