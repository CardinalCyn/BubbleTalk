import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
import Profile from './Components/Profile'
import RedirectProfile from './Components/RedirectProfile'
import RedirectHome from './Components/RedirectHome'
import Logout from './Components/Logout'
import Chat from './Components/Chat'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css';
import { DirectMessageContext } from './Components/DirectMessageContext'
import { useState } from 'react'
function App() {
  const [usernameToDm,setUsernameToDm]=useState("");
  
  return (
    <Router>
      <DirectMessageContext.Provider value={{usernameToDm,setUsernameToDm}}>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>      
        <Route path= "/redirectProfile" element= {<RedirectProfile />}/>
        <Route path="/redirectHome" element= {<RedirectHome />}/>
        <Route path="/:username/profile" element={<Profile />}/>
        <Route path="/chat" element= {<Chat />} />
        <Route path= "/logout" element={<Logout />}/>
      </Routes>
      </DirectMessageContext.Provider>
    </Router>
    
  );
}

export default App;
