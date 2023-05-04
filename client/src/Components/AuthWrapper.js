import React,{useState,useEffect} from "react";
import { checkSession } from "../Utils/APICalls";
import { useNavigate } from "react-router";
const AuthWrapper=({children})=>{
    const [sessionChecked,setSessionChecked]=useState(false);

    const [loggedIn,setLoggedIn]=useState(false);
    const [username,setUsername]=useState("");

    const navigate=useNavigate();
    
    useEffect(()=>{
        const checkLoggedIn=async()=>{
            try{
                const loggedInRequest=await checkSession();
                if(loggedInRequest["status"]==="success"){
                  setLoggedIn(loggedInRequest["loggedIn"]);
                  setUsername(loggedInRequest["username"]);
                  setSessionChecked(true);
                }
                else{
                  navigate("/login");
                  setSessionChecked(true);
                }
            }catch(err){
                navigate("/login");
                setSessionChecked(true);
            }
        }
        checkLoggedIn();
    },[navigate])
    const [smallScreen,setSmallScreen]=useState(window.innerWidth<768);
    useEffect(()=>{
      const handleResize=()=>{
        setSmallScreen(window.innerWidth<768);
      }
      window.addEventListener('resize',handleResize);
      return()=>{
        window.removeEventListener('resize',handleResize);
      }
    },[])
    return (
        <div>
          {sessionChecked&&React.Children.map(children, child =>
            React.cloneElement(child, { loggedIn, username,smallScreen })
          )}
        </div>
      );
}

export default AuthWrapper