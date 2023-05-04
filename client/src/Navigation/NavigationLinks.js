import React, { useEffect,useState } from "react"

const NavigationLinks=({mobile,loggedIn,logo,demoAccount,username})=>{
    const [styles,setStyles]=useState("text-xl px-2 py-2 text-white hover:bg-gray-700 rounded font-sans my-auto");
    const [navStyle,setNavStyle]=useState("flex justify-center bg-blue-500");
    const [aDivStyle,setADivStyle]=useState("anchorElements flex items-end")
    useEffect(()=>{
        if(mobile){
            setStyles("text-lg px-3 py-1 text-white rounded font-sans")
            setNavStyle("flex flex-col items-end bg-blue-500")
            setADivStyle("anchorElements flex flex-col items-end");
        }
    },[mobile])
    //mobile: anchorElements flex flex-col items-end
    //computer:
    return(
        <div>{!loggedIn?
            <nav className={navStyle}>
                {!mobile&&<img src={logo} className="w-22 h-20 mx-auto my-auto" alt="Website Logo"/>}
                <button onClick={()=>demoAccount()} className={styles}>Demo</button>
                <div className={aDivStyle}>
                    <a href="/" className={styles}>Home</a>
                    <a href="/login" className={styles}>Login</a>
                    <a href="/register" className={styles}>Register</a>
                </div>
            </nav>
            :
            <nav className={navStyle}>
                {!mobile&&<img src={logo} className="w-22 h-20 mx-auto my-auto" alt="Website Logo"/>}
                <div className={aDivStyle}>
                    <a href="/" className={styles}>Home</a>
                    <a href={"/" + username + "/profile"} className={styles}>Profile</a>
                    <a href="/chat" className={styles}>Chat</a>
                    <a href="/logout" className={styles}>Log out</a>
                </div>
            </nav>
            }
        </div>
    )
}

export default NavigationLinks