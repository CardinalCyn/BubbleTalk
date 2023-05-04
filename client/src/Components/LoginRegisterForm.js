import React,{useState} from "react";
import { useNavigate } from "react-router";
const LoginRegisterForm=({formType,formSubmit})=>{
    const navigate=useNavigate();

    const [emailField,setEmailField]=useState("");
    const [usernameField,setUsernameField]=useState("");
    const [passwordField,setPasswordField]=useState("");
    const [staySignedInField,setStaySignedInField]=useState(false);

    const [credentialsInvalid,setCredentialsInvalid]=useState(false);
    const [loginError,setLoginError]=useState(false);
    const [userExists,setUserExists]=useState(false);
    const [emailInvalid,setEmailInvalid]=useState(false);
    const [usernameInvalid,setUsernameInvalid]=useState(false);
    const [passwordInvalid,setPasswordInvalid]=useState(false);

    const clearErrors=()=>{
        setCredentialsInvalid(false);
        setLoginError(false);
        setUserExists(false);
        setEmailInvalid(false);
        setUsernameInvalid(false);
        setPasswordInvalid(false);
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const submitResult=await formSubmit(usernameField,passwordField,staySignedInField,emailField);
            switch (submitResult["status"]) {
                case "internalServerError":
                  clearErrors();
                  setLoginError(true);
                  break;
                case "credentialsInvalid":
                  clearErrors();
                  setCredentialsInvalid(true);
                  break;
                case "userValid":
                case "registerSuccess":
                  navigate("/"+submitResult["username"]+"/profile");
                  clearErrors();
                  break;
                case "userExists":
                  clearErrors();
                  setUserExists(true);
                  break;
                case "invalidInput":
                  clearErrors();
                  for (const invalidField in submitResult["invalidFields"]) {
                    switch (invalidField) {
                      case "emailInvalid":
                        setEmailInvalid(true);
                        break;
                      case "usernameInvalid":
                        setUsernameInvalid(true);
                        break;
                      case "passwordInvalid":
                        setPasswordInvalid(true);
                        break;
                      default:
                        break;
                    }
                  }
                  break;
                default:
                  break;
              }
        }catch(err){
            clearErrors();
            setLoginError(true);
        }
    }
    return(
        <div id="loginRegisterFormContainer">
        <main className='flex items-center justify-center h-screen bg-gray-100'>
          <form className='bg-white w-96 p-6 rounded shadow-sm' onSubmit={handleSubmit}>
            <h1 className='text-xl text-center mx-auto pb-10'>{formType==="register"?"Register":"Login"}</h1>
            {loginError&&
              <div id="loginError" className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">
                <p>You were unable to be logged in, please try again later</p>
              </div>
            }
            {credentialsInvalid&&
            <div id="credentialsInvalidContainer" className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">
              <p>Incorrect username or password
              </p>
            </div>}
            {userExists&&<div id="userExists"><p className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">That email or username is in use</p></div>}
            {emailInvalid&&<div id="emailInvalid"><p className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">That email is invalid</p></div>}
            {formType==="register"&&(<div><label className='text-gray-700'>Email</label>
            <input type="text" className='w-full py-2 bg-gray-100 text-gray-500 px-1 outline-none mb-4' onChange={e=>setEmailField(e.target.value)}></input></div>)}
            {usernameInvalid&&<div id="usernameInvalid"><p className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">Usernames must use alphanumerical characters and be between 2 and 16 characters</p></div>}
            <label className='text-gray-700'>Username</label>
            <input type="text" autoComplete='username'
              className='w-full py-2 bg-gray-100 text-gray-500 px-1 outline-none mb-4' 
            onChange={e=>setUsernameField(e.target.value)} />
            {passwordInvalid&&<div id="passwordInvalid"><p className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">Passwords must be between 6 and 20 characters</p></div>}
            <label className='text-gray-700'>Password</label>
            <input type="password" autoComplete='password' className='w-full py-2 bg-gray-100 text-gray-500 px-1 outline-none mb-4'
            onChange={e=>setPasswordField(e.target.value)} />
            <input id= "Remember" type="checkbox" 
            className='mb-4' onChange={e=>setStaySignedInField(e.target.checked)} />
            <label htmlFor="Remember" className='text-gray-700'> Remember me</label>
            <button type="submit" 
            className="bg-blue-500 text-white w-full rounded py-2 hover:bg-blue-600 transition-colors"
            >{formType==="register"?"Register":"Login"}</button>
          </form>
        </main>
      </div>
    )
}

export default LoginRegisterForm