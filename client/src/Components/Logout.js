import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { logoutRequest } from "../Utils/APICalls";
const Logout=()=>{
    const navigate=useNavigate();
    useEffect(()=>{
        const logout=async()=>{
            const logoutStatus=await logoutRequest();
            if(logoutStatus==="sessionDestroyed"){
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }else{
                console.log(logoutStatus);
            }
        }
        logout();
    },[navigate])
    return(
        <div id="logoutContainer">
            Logging you out! Returning you to home<a href="/">Click here to return to home</a>
        </div>
    )
}

export default Logout;