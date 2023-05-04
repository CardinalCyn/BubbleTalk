import React,{useEffect} from "react";
import { useNavigate } from "react-router";
import Navbar from "../Navigation/Navbar";
const RedirectHome=()=>{
    const navigate=useNavigate();
    useEffect(()=>{
        setTimeout(() => {
            navigate("/");
        }, 2000);
    })
    return(
        <div id="redirectHomeContainer">
            <Navbar loggedIn={false} username={""} onHomePage={false}/>
            <div style={{textAlign: 'center', marginTop: '100px'}}>
                <p>Logging you out! Returning you to home</p>
                <a href="/" style={{textDecoration: 'none', color: '#0077FF'}}>Click here to return to home</a>
            </div>
        </div>
    )
}

export default RedirectHome;