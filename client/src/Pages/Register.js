import React,{useEffect} from 'react'
import { registerRequest } from '../Utils/APICalls';
import Navbar from '../Navigation/Navbar';
import LoginRegisterForm from '../Components/LoginRegisterForm';
import { useNavigate } from 'react-router';
const Register=({loggedIn,username}) =>{
  const navigate=useNavigate();
  useEffect(()=>{
    if (loggedIn) navigate("/"+username+"/profile")
  },[loggedIn,username,navigate])
  
  const registerUser=async(username,password,staySignedIn,email)=>{
    try{
      const registerStatus= await registerRequest(email,username,password,staySignedIn);
      return registerStatus;
    }catch(err){
      return {status:"internalServerError"};
    }
  }
  return (
    <div>
      <Navbar loggedIn={loggedIn}/>
      <LoginRegisterForm formType={"register"} formSubmit={registerUser}/>
    </div>
  )
}

export default Register