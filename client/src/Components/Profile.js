import React,{useContext, useEffect,useState} from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import { checkSession,checkValidProfile,uploadProfilePicture,getProfilePicture } from '../Utils/APICalls'
import { convertPicture } from '../Utils/ProfilePictureConversion'
import Navbar from '../Navigation/Navbar'
import { DirectMessageContext } from './DirectMessageContext'
const Profile=() =>{
  const navigate=useNavigate();
  //profile page based on url
  const profileUser=useParams().username;
  //checks if the profile page is of an actual user or not, and will display page depending on if it is or not
  const [profilePageValid,setProfilePageValid]=useState(false);
  //checks if user is logged in
  const [loggedIn,setLoggedIn]=useState(false);
  //passes in username of user
  const [userUsername,setUserUsername]=useState("");
  //checks if user is the same as the url, allows you to edit picture, or dm if not the same
  const [sameProfile,setSameProfile]=useState(false);
  //pfp of the user
  const [userProfilePicture,setUserProfilePicture]=useState(null);
  //checks if the file upload was successful or not
  const [fileUploadFailure,setFileUploadFailure]=useState(false);
  //uploads pfp whenever input element changes
  const uploadPFP=async(image)=>{
    const formData=new FormData();
    formData.append('profilePicture',image);
    formData.append('profileNameOfProfilePage',profileUser);
    const uploadStatus=await uploadProfilePicture(formData);
    if(uploadStatus==="fileNotSent"){
      setFileUploadFailure(true);
    }else{
      setFileUploadFailure(false);
      setUserProfilePicture(convertPicture(uploadStatus));
    }
  }
  const {setUsernameToDm}=useContext(DirectMessageContext);
  const directMessageUser=()=>{
    if(profileUser){
      setUsernameToDm(profileUser);
      navigate('/chat');
    }
  }
  //checks if the profile page is of a user or not, and checks if the user is logged in
  useEffect(()=>{
    const checkValidProfilePage=async()=>{
      const profileStatus=await checkValidProfile(profileUser);
      setProfilePageValid(profileStatus);
    }
    checkValidProfilePage();
    const checkUserLoggedIn=async()=>{
      const loggedInStatus=await checkSession();
      const logStatus=loggedInStatus.toString();
      if(logStatus===profileUser){
        setUserUsername(logStatus);
        setLoggedIn(true);
        setSameProfile(true);
      }
      else if(loggedInStatus!=="notLoggedIn"){
        setLoggedIn(true);
        setUserUsername(logStatus);
      }
    }
    checkUserLoggedIn();
  },[profileUser])

  //gets pfp from server, and sets img element to its value
  useEffect(()=>{
    if(profilePageValid){
      const getProfilePic=async()=>{
        const profilePic=await getProfilePicture(profileUser);
        convertPicture(profilePic);
        setUserProfilePicture(convertPicture(profilePic));
      }
      getProfilePic();
    }
  },[profileUser,profilePageValid])
  
  return (
    <div id="profileContainer">
      {!profilePageValid?<div id="profilePageInvalid">This profile page doesn't exist! <a href="/">Click here</a> to return to the home page.</div>:
      <div id="profilePage">
        <Navbar loggedIn={loggedIn} username={userUsername}/>
        <h1 id="profileName">
          Profile of {profileUser}
        </h1>
        <img src={userProfilePicture} alt="The selected object of the user" />
        {sameProfile?<input type="file" accept="image/*" id="profilePictureUpload" onChange={e=>uploadPFP(e.target.files[0])}/>:<></>}
        {fileUploadFailure?<div id="fileUploadFailure">File was unable to be uploaded</div>:<></>}
        {loggedIn&&!sameProfile?<button id="directMessage" onClick={()=>directMessageUser()}>Message User</button>:<></>}
      </div>}
    </div>
  )
}

export default Profile