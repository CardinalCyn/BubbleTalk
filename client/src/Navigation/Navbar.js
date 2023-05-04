import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router";
import logo from '../logo/croppedlogo.png';
import { loginRequest } from "../Utils/APICalls";
import NavigationLinks from "./NavigationLinks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar=({username,loggedIn,onHomePage})=>{
    const navigate=useNavigate();
    
    const [screenWidth,setScreenWidth]=useState(window.innerWidth);
    const [showMobileSidebar,setShowMobileSideBar]=useState(false);
    const [demoFail,setDemoFail]=useState(false);
    useEffect(()=>{
        const handleResize=()=>{
            setScreenWidth(window.innerWidth);
        }
        handleResize();
        window.addEventListener("resize",handleResize);
        return ()=>{
            window.removeEventListener("resize", handleResize);
        }
    },[loggedIn,username])

    const demoAccount=async()=>{
        if(!loggedIn){
            try{
                const loginStatus=await loginRequest("12","123123");
                if(loginStatus["status"]==="userValid"){
                    navigate("/12/profile");
                }else{
                    demoFailed();
                }
            }catch(err){
                demoFailed();
            }
        }
    }

    const demoFailed=()=>{
        setDemoFail(true);
        setShowMobileSideBar(false);
    }

    const toggleMobileSideBarVisibility=()=>{
        setShowMobileSideBar(!showMobileSidebar);
        const mobileSidebar = document.querySelector('.mobileSidebar');
        mobileSidebar.style.maxHeight=showMobileSidebar?'0':'500px';
    }

    return(
        <div>
            {screenWidth>=768?
                <nav className="sticky-nav">
                    <NavigationLinks mobile={false} loggedIn={loggedIn} logo={logo} demoAccount={demoAccount} onHomePage={onHomePage} username={username}/>
                </nav>
                :
                <nav className="bg-blue-500 sticky-nav">
                    <div className="flex justify-between">
                        <a href="/" className="ml-10"><img src={logo} className="h-20 mx-auto my-auto" alt="Website Logo"/></a>
                        <button onClick={toggleMobileSideBarVisibility}>
                            <FontAwesomeIcon icon={faBars} size="3x" className="text-white ml-4 px-2 py-2 my-auto" />
                        </button>
                    </div>
                    <div className="mobileSidebar">
                        <NavigationLinks mobile={true} loggedIn={loggedIn} logo={logo} demoAccount={demoAccount} username={username}/>
                    </div>
                </nav>
            }
            {demoFail&&<div className="bg-red-500 px-3 py-2 rounded text-gray-100 mt-24">Your attempt to access the demo account failed, try again later</div>}
        </div>
    )
}

export default Navbar;