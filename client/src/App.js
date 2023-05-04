import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Profile from './Pages/Profile'
import RedirectHome from './Pages/RedirectHome'
import Logout from './Pages/Logout'
import Chat from './Pages/Chat'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css';
import { DirectMessageContext } from './Components/DirectMessageContext'
import { useState } from 'react'
import AuthWrapper from './Components/AuthWrapper'
const App=()=> {
  const [usernameToDm,setUsernameToDm]=useState("");
  
  return (
    <Router>
      <DirectMessageContext.Provider value={{usernameToDm,setUsernameToDm}}>
        <Routes>
          <Route path="/" element={<AuthWrapper><Home /></AuthWrapper>}/>
          <Route path="/login" element={<AuthWrapper><Login /></AuthWrapper>}/>
          <Route path="/register" element={<AuthWrapper><Register /></AuthWrapper>}/>      
          <Route path="/redirectHome" element= {<RedirectHome />}/>
          <Route path="/:username/profile" element={<AuthWrapper><Profile /></AuthWrapper>}/>
          <Route path="/chat" element= {<AuthWrapper><Chat /></AuthWrapper>} />
          <Route path= "/logout" element={<Logout />}/>
        </Routes>
      </DirectMessageContext.Provider>
    </Router>
    
  );
}

export default App;
