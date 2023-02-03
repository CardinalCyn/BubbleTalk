import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router";
import logo from '../logo/croppedlogo.png';
import { loginRequest } from "../Utils/APICalls";
const Navbar=(props)=>{
    const navigate=useNavigate();

    const [username,setUsername]=useState("");
    const [loggedIn,setLoggedIn]=useState(false);
    const [home,setHome]=useState(false);
    const [showFeatures,setShowFeatures]=useState(false);
    useEffect(()=>{
        if(props.hasOwnProperty("username")) setUsername(props.username);
        if(props.hasOwnProperty("loggedIn")) setLoggedIn(props.loggedIn);
        if(props.hasOwnProperty("onHomePage")) setHome(props.onHomePage);
    },[loggedIn,username,props])

    const demoAccount=async()=>{
        if(!loggedIn){
            const loginStatus=await loginRequest("12","123123");
            if(loginStatus!=="notLoggedIn"){
                navigate("/redirectProfile");
            }
        }
    }

    const toggleShowFeatures=()=>{
        setShowFeatures(!showFeatures);
    }
    return(
        <>
        <div id="navbarContainer" className="bg-logoBlue fixed top-0 left-0 right-0">
            {!loggedIn?
                <nav className="flex justify-center">
                    {home&&!loggedIn&&<button onClick={()=>demoAccount()} className="ht-20 ml-4 text-xl px-2 py-2 my-auto text-white hover:bg-gray-700 rounded font-sans">Demo</button>}
                    {home&&<button className="ml-4 text-xl px-2 py-2 my-auto text-white hover:bg-gray-700 rounded font-sans" onClick={()=>toggleShowFeatures()}>Features</button>}
                    <img src={logo} className="w-22 h-20 mx-auto my-auto" alt="Website Logo"/>
                    <a href="/" className="ml-4 text-xl px-2 py-2 my-auto text-white hover:bg-gray-700 rounded font-sans">Home</a>
                    <a href="/login" className="ml-4 text-xl px-2 py-2 my-auto text-white hover:bg-gray-700 rounded font-sans">Login</a>
                    <a href="/register" className="ml-4 text-xl px-2 py-2 my-auto text-white hover:bg-gray-700 rounded font-sans">Register</a>
                </nav>
                :
                <nav className="flex justify-center">
                    <img src={logo} className="w-22 h-20 mx-auto my-auto" alt="Website Logo"/>
                    <a href="/" className="text-xl px-2 py-2 text-white hover:bg-gray-700 rounded font-sans">Home</a>
                    <a href={"/" + username + "/profile"} className="text-xl px-2 py-2 text-white hover:bg-gray-700 rounded font-sans">Profile</a>
                    <a href="/chat" className="text-xl px-2 py-2 text-white hover:bg-gray-700 rounded font-sans">Chat</a>
                    <a href="/logout" className="text-xl px-2 py-2 text-white hover:bg-gray-700 rounded font-sans">Log out</a>
                </nav>
            }
        </div>
        {showFeatures&&
        <div class="flex flex-col mt-20 pb-10 bg-logoBlue">
            <div class="flex flex-row">
                <div className="w-1/2"><h2 className="text-lg font-medium text-white">Get Started</h2><h4 className="text-white">Register with just a few clicks</h4></div>
                <div className="w-1/2"><h2 className="text-lg font-medium text-white">Customize your profile</h2><h4 className="text-white">Upload your profile picture</h4></div>
                <div className="w-1/2"><h2 className="text-lg font-medium text-white">Connect Easily</h2><h4 className="text-white">Join rooms or message people directly with just a few clicks</h4></div>
                <div className="w-1/2"><h2 className="text-lg font-medium text-white">Never miss a thing</h2><h4 className="text-white">Save message history and access it whenever you need</h4></div>
            </div>
        </div>}
        </>
    )
}

export default Navbar;