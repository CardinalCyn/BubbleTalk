import React,{useEffect} from "react";
import { useNavigate } from "react-router";
const RedirectHome=()=>{
    const navigate=useNavigate();
    useEffect(()=>{
        setTimeout(() => {
            navigate("/");
        }, 2000);
    })
    return(
        <div id="RedirectHomeContainer">
            You need to be logged in to access that! Redirecting you to home.
            <a href="/">Click here</a> if you aren't navigated yet
        </div>
    )
}

export default RedirectHome;