import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { logoutRequest } from "../Utils/APICalls";
import Navbar from "../Navigation/Navbar";
const Logout=()=>{
    const navigate=useNavigate();
    useEffect(()=>{
        const logout=async()=>{
            const logoutStatus=await logoutRequest();
            if(logoutStatus==="sessionDestroyed"){
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        }
        logout();
    },[navigate])
    return(
        <div id="logoutContainer">
            <Navbar loggedIn={false} username={""} onHomePage={false}/>
            <div style={{textAlign: 'center', marginTop: '100px'}}>
                <p>Logging you out! Returning you to home</p>
                <a href="/" style={{textDecoration: 'none', color: '#0077FF'}}>Click here to return to home</a>
            </div>
        </div>
    )
}

export default Logout;