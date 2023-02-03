import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router';
import { checkSession } from '../Utils/APICalls';
const RedirectProfile=()=>{
    const [userStatus,setUserStatus]=useState("");
    const navigate=useNavigate();
    useEffect(()=>{
        const redirectUser=async()=>{
            const userStatus=await checkSession();
            setUserStatus(userStatus);
            if(userStatus==="notLoggedIn"){
                navigate("/login")
            }else{
                setTimeout(() => {
                    navigate("/"+userStatus+"/profile");
                }, 2000);
            }
        }
        redirectUser();
    },[navigate])
    return(
    <div id="RedirectProfileContainer">
        Login successful! Now redirecting to your profile page.
        <a href={"/"+userStatus+"/profile"}>Click here</a> if you aren't redirected
    </div>)
}

export default RedirectProfile;