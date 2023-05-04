import React, { useEffect, useState } from "react";
import { postAboutMeBio } from "../Utils/APICalls";

const AboutMeProfile=({username,aboutMeText,sameProfile})=>{
    const [charCount,setCharCount]=useState(0);
    const [editing,setEditing]=useState(false);

    const [errorMessage,setErrorMessage]=useState("");
    const [successMessage,setSuccessMessage]=useState("");
    const handleInput=(e)=>{
        setCharCount(e.target.value.length);
    }
    useEffect(()=>{
        if(aboutMeText) setCharCount(aboutMeText.length);
    },[aboutMeText])
    const changeEditing=(editValue)=>{
        setEditing(editValue);
    }
    const aboutMeBioSubmit=async(aboutMeText)=>{
        const bioPostRequest=await postAboutMeBio(username,aboutMeText);
        switch(bioPostRequest["status"]){
            case "notLoggedIn":
                setErrorMessage("You need to be logged in to do that!");
                break;
            case "notSameUser":
                setErrorMessage("You can't edit other people's profile!");
                break;
            case "success":
                setSuccessMessage("Your biography upload was successful!");
                setErrorMessage("");
                setEditing(false);
                setTimeout(()=>{
                    setSuccessMessage("");
                },5000);
                break;
            case "aboutMeBioInputInvalid":
                setErrorMessage("Your bio must use 512 valid characters or less");
                break;
            default:
                setErrorMessage("There was a problem uploading your bio, try again later");
        }
    }
    return(
        <div className="relative">
           <div className="absolute top-0 left-0 right-0 z-10">
                {errorMessage && (
                <div className="mt-[-60px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">{errorMessage}</strong>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </span>
                </div>
                )}
                {successMessage && (
                <div className="mt-[-60px] flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
                    <p className="text-center">{successMessage}</p>
                </div>
                )}
            </div>
            <label htmlFor="message" className="mt-10 block mb-2 text-2xl font-medium text-gray-900 dark:text-white text-center">
                About me
            </label>
            <div className="flex flex-col items-center">
                {sameProfile&&
                    <button className={`px-4 py-2 font-medium text-white rounded ${editing? 'bg-red-600':'bg-blue-600'}`} onClick={() => changeEditing(!editing)}>
                        {editing?'Cancel':'Edit'}
                    </button>
                }
                <textarea 
                    id="bio"
                    rows="7" 
                    className="text-center text-md mt-2 block p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none" 
                    defaultValue={aboutMeText}
                    readOnly={!editing}
                    onInput={handleInput}>
                </textarea>
                {editing&&
                    <div className="editingSubmission flex flex-col items-end">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {charCount}/512 characters
                        </div>
                        <button onClick={()=>aboutMeBioSubmit(document.getElementById("bio").value)} type="submit" className="block w-20 py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Submit
                        </button>
                    </div>
                }
            </div>
        </div>
    ) 
}

export default AboutMeProfile;