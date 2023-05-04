import React from 'react'
import Navbar from '../Navigation/Navbar'
import Hero from '../Components/Hero'
const Home=({loggedIn,username}) =>{

  return (
    <div>
      <Navbar loggedIn={loggedIn} username ={username} onHomePage={true}/>
      <Hero />
    </div>
  )
}

export default Home;