import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router';
import { registerRequest,checkSession } from '../Utils/APICalls';
import Navbar from '../Navigation/Navbar';
const Register=() =>{
  const navigate=useNavigate();

  const [emailField,setEmailField]=useState("");
  const [usernameField,setUsernameField]=useState("");
  const [passwordField,setPasswordField]=useState("");
  const [staySignedInField,setStaySignedInField]=useState(false);
  
  const [userExists,setUserExists]=useState(false);
  const [emailInvalid,setEmailInvalid]=useState(false);
  const [usernameInvalid,setUsernameInvalid]=useState(false);
  const [passwordInvalid,setPasswordInvalid]=useState(false);

  useEffect(()=>{
    const checkUserLoggedIn=async()=>{
      const loggedInStatus=await checkSession();
      if(loggedInStatus!=="notLoggedIn"){
        navigate("/"+loggedInStatus+"/profile");
      }
    }
    checkUserLoggedIn();
  },[navigate])

  const registerUser=async(e)=>{
    e.preventDefault();
    const registerStatus= await registerRequest(emailField,usernameField,passwordField,staySignedInField);
    if(registerStatus==="userExists"){
      setUserExists(true);
      setEmailInvalid(false);
      setUsernameInvalid(false);
      setPasswordInvalid(false);
    }
    else if(typeof registerStatus==="string"||typeof registerStatus==="number"){
      navigate("/redirectProfile");
    }
    else{
      setEmailInvalid(false);
      setUsernameInvalid(false);
      setPasswordInvalid(false);
      for(const prop in registerStatus){
        if(prop==="email") setEmailInvalid(true);
        if(prop==="username") setUsernameInvalid(true);
        if(prop==="password") setPasswordInvalid(true);
      }
    }
  }
  return (
    <div>
      <Navbar loggedIn={false}/>
      <div id="registerFormContainer">
        <main className='flex items-center justify-center h-screen'>
          <form className='bg-white w-96 p-6 rounded shadow-sm' onSubmit={registerUser}>
            <h1 className='text-xl text-center mx-auto pb-10'>Welcome back!</h1>
            {userExists&&<div id="userExists"><p className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">That email or username is in use</p></div>}
            {emailInvalid&&<div id="emailInvalid"><p className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">That email is invalid</p></div>}
            <label className='text-gray-700'>Email</label>
            <input type="text" className='w-full py-2 bg-gray-100 text-gray-500 px-1 outline-none mb-4' onChange={e=>setEmailField(e.target.value)}></input>
            {usernameInvalid&&<div id="usernameInvalid"><p className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">Usernames must use alphanumerical characters and be between 2 and 16 characters</p></div>}
            <label className='text-gray-700'>Username</label>
            <input type="text" autoComplete="username" className='w-full py-2 bg-gray-100 text-gray-500 px-1 outline-none mb-4' onChange={e=>setUsernameField(e.target.value)}></input>
            {passwordInvalid&&<div id="passwordInvalid"><p className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">Passwords must be between 6 and 20 characters</p></div>}
            <label className='text-gray-700'>Password</label>
            <input type="password" autoComplete="current-password" className='w-full py-2 bg-gray-100 text-gray-500 px-1 outline-none mb-4' onChange={e=>setPasswordField(e.target.value)}></input>
            <label htmlFor="Remember" className='text-gray-700'>Remember me </label>
            <input id="Remember"type="checkbox" onChange={e=>setStaySignedInField(e.target.checked)}></input>
            <button type="submit" className="bg-blue-500 text-white w-full rounded py-2 hover:bg-blue-600 transition-colors">Register</button>
          </form>
        </main>
        
      </div>
    </div>
  )
}

export default Register