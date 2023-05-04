import React, { useEffect } from 'react'
import { loginRequest } from '../Utils/APICalls'
import Navbar from '../Navigation/Navbar';
import LoginRegisterForm from '../Components/LoginRegisterForm';
import { useNavigate } from 'react-router';
const Login=({loggedIn,username}) =>{
  const navigate=useNavigate();
  useEffect(()=>{
    if(loggedIn) navigate("/"+username+"/profile");
  },[loggedIn,navigate,username])
  
  const loginUser=async (username,password,staySignedIn)=>{
    try{
      let loginStatus=await loginRequest(username,password,staySignedIn);
      return loginStatus;
    }
    catch(err){
      return {status:"internalServerError"};
    }
  }
  return (
    <div>
      <Navbar loggedIn={loggedIn} />
      <LoginRegisterForm formType={"login"} formSubmit={loginUser}/>
    </div>
  )
}

export default Login