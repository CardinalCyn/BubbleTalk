import React,{useState,useEffect} from 'react'
import { loginRequest,checkSession } from '../Utils/APICalls'
import { useNavigate } from 'react-router';
import Navbar from '../Navigation/Navbar';

const Login=() =>{
  const [usernameField,setUsernameField]=useState("");
  const [passwordField,setPasswordField]=useState("");
  const [staySignedInField,setStaySignedInField]=useState(false);
  const [credentialsInvalid,setCredentialsInvalid]=useState(false);

  const navigate=useNavigate();

  useEffect(()=>{
    const checkUserLoggedIn=async()=>{
      const loggedInStatus=await checkSession();
      if(loggedInStatus!=="notLoggedIn"){
        navigate("/"+loggedInStatus+"/profile");
      }
    }
    checkUserLoggedIn();
  },[navigate])

  const loginUser=async (e)=>{
    e.preventDefault();
    let loginStatus=await loginRequest(usernameField,passwordField,staySignedInField);
    if(loginStatus==="userValid"){
      navigate("/redirectProfile");
    }
    else{
      setCredentialsInvalid(true);
    }
  }

  return (
    <div>
      <Navbar loggedIn={false} />
      <div id="loginFormContainer">
        <main className='flex items-center justify-center h-screen bg-gray-100'>
          <form className='bg-white w-96 p-6 rounded shadow-sm' onSubmit={loginUser}>
            <h1 className='text-xl text-center mx-auto pb-10'>Welcome back!</h1>
            {credentialsInvalid&&
            <div id="credentialsInvalidContainer" className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">
              <p>Incorrect username or password
              </p>
            </div>}
            <label className='text-gray-700'>Username</label>
            <input type="text" autoComplete='username'
              className='w-full py-2 bg-gray-100 text-gray-500 px-1 outline-none mb-4' 
            onChange={e=>setUsernameField(e.target.value)} />
            <label className='text-gray-700'>Password</label>
            <input type="password" autoComplete='password' className='w-full py-2 bg-gray-100 text-gray-500 px-1 outline-none mb-4'
            onChange={e=>setPasswordField(e.target.value)} />
            <input id= "Remember" type="checkbox" 
            className='mb-4' onChange={e=>setStaySignedInField(e.target.checked)} />
            <label htmlFor="Remember" className='text-gray-700'> Remember me</label>
            <button type="submit" 
            className="bg-blue-500 text-white w-full rounded py-2 hover:bg-blue-600 transition-colors"
            >Log in</button>
          </form>
        </main>
      </div>
    </div>
  )
}

export default Login