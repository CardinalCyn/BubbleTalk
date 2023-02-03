const bcrypt=require("bcrypt");
const validator=require('email-validator');
const dbExports=require('./db');
const updateProfilePicture=dbExports.updateProfilePicture
const searchUserByInsertID=dbExports.searchUserByInsertID;
const searchUserByUsername=dbExports.searchUserByUsername;
const searchUserByUsernameAndEmail=dbExports.searchUserByUsernameAndEmail;
const createUser=dbExports.createUser;

const checkValidLogin=async(username,password)=>{
    const user=await searchUserByUsername(username);
    if(!user.length){
        return "usernameInvalid";
    }
    else{
        const dbHashedPassword=user[0].userPassword;
        if(await bcrypt.compare(password,dbHashedPassword)){
            return user[0];
        }
        else{
            return "passwordInvalid";
            }
        }
}
const checkValidRegistration=async(email,username,password)=>{
    const hashedPassword=await bcrypt.hash(password,10);
    const validInput={};
    if(!validator.validate(email)||email.length>40){
        validInput.email=false;
    }
    const regExp=/^[a-z0-9]+$/i;
    if(username.length>20||username.length<2||regExp.test(username)===false){
        validInput.username=false;
    }
    if(password.length<6||password.length>60){
        validInput.password=false;
    }
    if(Object.keys(validInput).length){
        return validInput;
    }
    const user=await searchUserByUsernameAndEmail(username,email);
    if(user.length){
        return "userExists";
    }
    else{
        const createdId=await createUser(email,username,hashedPassword,"userProfilePictures\\d26c2ad3-cfe8-43a7-b025-f08b168b3757.jpeg").then(result=>{
            return result.insertId;
        });
        const user=await searchUserByInsertID(createdId);
        if(user[0]){
            return user[0]; 
        }
    }
}
const checkValidProfile=async(username)=>{
    const user=await searchUserByUsername(username);
    const userFound=user.length?true:false;
    return userFound;
}
const checkValidRoomLink=async(roomLink)=>{
    const regExp=/^[a-z]+$/i;
    if(regExp.test(roomLink)&&roomLink.length===8){
        return true;
    }
    return false;
}
module.exports={checkValidLogin,checkValidRegistration,checkValidProfile,updateProfilePicture,searchUserByUsername,checkValidRoomLink}


