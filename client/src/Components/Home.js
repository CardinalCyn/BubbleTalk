import React,{useEffect,useState} from 'react'
import { checkSession } from '../Utils/APICalls';
import { useNavigate } from 'react-router';
import Navbar from '../Navigation/Navbar'
const Home=() =>{
  const navigate=useNavigate();

  const [loggedIn,setLoggedIn]=useState(false);
  const [username,setUsername]=useState("");
  useEffect(()=>{
    const checkUserLoggedIn=async()=>{
      const loggedInStatus=await checkSession();
      if(loggedInStatus!=="notLoggedIn"){
        setLoggedIn(true);
        setUsername(loggedInStatus);
      }
    }
    checkUserLoggedIn();
  },[navigate])

  return (
    <div>
      <Navbar loggedIn={loggedIn} username ={username} onHomePage={true}/>
      
    </div>
  )
}

export default Home