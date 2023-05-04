import React,{useContext, useEffect,useState} from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import { checkValidProfile,uploadProfilePicture,getProfilePicture, getAboutMeBio } from '../Utils/APICalls'
import Navbar from '../Navigation/Navbar'
import { DirectMessageContext } from '../Components/DirectMessageContext'
import AboutMeProfile from '../Components/AboutMeProfile'
const Profile=({loggedIn,username}) =>{
  const navigate=useNavigate();
  //profile page based on url
  const profileUser=useParams().username;
  //checks if the profile page is of an actual user or not, and will display page depending on if it is or not
  const [profilePageValid,setProfilePageValid]=useState(false);
  //checks if user is the same as the url, allows you to edit picture, or dm if not the same
  const [sameProfile,setSameProfile]=useState(false);
  //pfp of the user
  const [userProfilePicture,setUserProfilePicture]=useState(null);
  //about me bio of the user
  const [aboutMeBio,setAboutMeBio]=useState("");
  //checks if the file upload was successful or not
  const [fileUploadFailure,setFileUploadFailure]=useState(false);
  //err msg when server error happens when checking if profile page is valid or not
  const [errorConnecting,setErrorConnecting]=useState(false);

  const toggleFileUploadError=()=>{
    setFileUploadFailure(true);
    setTimeout(()=>{
      setFileUploadFailure(true);
    },3000)
  }
  //uploads pfp whenever input element changes
  const uploadPFP=async(image)=>{
    try{
      const formData=new FormData();
      formData.append('profilePicture',image);
      formData.append('profileNameOfProfilePage',profileUser);
      const uploadRequest=await uploadProfilePicture(formData);
      if(uploadRequest["status"]==="fileNotSent"||uploadRequest["status"]==="invalidPictureUploadAttempt"){
        toggleFileUploadError();
      }else if(uploadRequest["status"]==="notLoggedIn"){
        toggleFileUploadError();
      }
      else{
        toggleFileUploadError();
        setUserProfilePicture(uploadRequest["img"]);
      }
    }catch(err){
      toggleFileUploadError();
    }
  }
  //when youre on someone elses profile, and click dm user, you are navigated to /chat, and a dm of the user u want to dm is created for both of you
  const {setUsernameToDm}=useContext(DirectMessageContext);
  const directMessageUser=()=>{
    if(profileUser){
      setUsernameToDm(profileUser);
      navigate('/chat');
    }
  }
  //checks if the profile page is of a user or not, and checks if the user is logged in. if valid, gets the users pfp
  useEffect(()=>{
    if(profileUser===username){
      setSameProfile(true);
    }else{
      setSameProfile(false);
    }
    const checkValidProfilePage=async()=>{
      try{
        const profileStatus=await checkValidProfile(profileUser);
        if(profileStatus==="internalServerError"){
          setErrorConnecting(true);
        }
        else if(profileStatus===true){
          setProfilePageValid(profileStatus);
          try{
            const profilePic=await getProfilePicture(profileUser);
            setUserProfilePicture(profilePic["img"]);
            const aboutMeBioData=await getAboutMeBio(profileUser);
            setAboutMeBio(aboutMeBioData["aboutMeBio"]);
          }catch(err){
            setErrorConnecting(true);
          }
        }else{
          setProfilePageValid(false);
        }
      }catch(err){
        setErrorConnecting(true);
      }
    }
    checkValidProfilePage();
  },[profileUser,username])

  return (
    <div id="profileContainer">
      {errorConnecting?<div>There was an error trying to connect to the server. <a href="/">Click here</a> to return to the home page.</div>:
      !profilePageValid?<div id="profilePageInvalid">This profile page doesn't exist! <a href="/">Click here</a> to return to the home page.</div>:
      <div id="profilePage">
        <Navbar loggedIn={loggedIn} username={username}/>
        <h1 id="profileName" className="mt-24 text-center text-3xl font-bold">
          Profile of {profileUser}
        </h1>
        <div className='flex justify-center'>
          <img src={userProfilePicture} alt="The selected object of the user" className="w-20 h-20 rounded-full mx-auto mt-2 inline-block"/>
        </div>
        {sameProfile&&
          <div className="text-center mt-2">
            <label htmlFor="profilePictureUpload" className="block mt-10 text-center cursor-pointer">
              <span className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
                Upload Profile Picture
              </span>
              <input type="file" accept="image/*" id="profilePictureUpload" onChange={e => uploadPFP(e.target.files[0])} className="hidden" />
            </label>
          </div>
        }
        {fileUploadFailure&&<div className='flex justify-center mt-3'><div id="fileUploadFailure" className='bg-red-500 px-3 py-2 rounded text-gray-100 mb-3 w-1/2'>File was unable to be uploaded</div></div>}
        <div className='flex justify-center'>
          {(loggedIn && !sameProfile) &&<button className="mt-5 px-4 py-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600" id="directMessage" onClick={()=>directMessageUser()}>Message User</button>}
        </div>
        {profilePageValid&&<AboutMeProfile username={profileUser} sameProfile={sameProfile} aboutMeText={aboutMeBio}/>}
      </div>}
    </div>
  )
}

export default Profile