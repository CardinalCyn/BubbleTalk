export const validateRoomToCreate=(roomName)=>{
    if(roomName.length>=1&&roomName.length<=25){
        return "roomNameValid";
    }
    else{
        return "roomNameInvalid";
    }
}
export const validRoomToJoin=(roomLink)=>{
    const regExp=/^[a-z]+$/i;
    if(regExp.test(roomLink)&&roomLink.length===8){
        return "validRoomToJoin";
    }else{
        return "invalidRoomToJoin"
    }
}