import React,{useState} from "react";

const PopupCreateRoom=({togglePopupVisibility,createRoom,roomCreateInvalid})=>{
    const [roomName,setRoomName]=useState("");

    const handleOuterClick=(e)=>{
        togglePopupVisibility();
    }
    const handleInnerClick=(e)=>{
        e.stopPropagation();
    }

    const changeRoom=(e)=>{
        e.preventDefault();
        createRoom(roomName);
    }
    return(
        <div id="createRoomPopup" onClick={handleOuterClick}>
            <div className="innerPopup" id="innerPopupCreateRoom" onClick={handleInnerClick}>
            <button type="close-btn" id="closePopupBtn" onClick={()=>togglePopupVisibility()}>x</button>
                Create a chat room!
                <br/>
                Make a name for your room
                <br/>
                {roomCreateInvalid?<div id="roomNameInvalid">Room names must be between 1 and 25 characters</div>:<></>}
                <form id="joinRoomForm" onSubmit={changeRoom}>
                    <input type="text" onChange={e=>setRoomName(e.target.value)}></input>
                    <button type="submit" id="submitJoinRoom">Create server</button>
                </form>
            </div>
        </div>
    )
}
export default PopupCreateRoom