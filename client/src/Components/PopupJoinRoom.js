import React,{useState} from "react";
import '../App.css'
const PopupJoinRoom=({togglePopupVisibility,joinRoom,roomToJoinInvalid,roomToJoinStatus})=>{
    const [roomValue,setRoomValue]=useState("");
    //used to make it so that when u click outside the popup box, you exit it
    const handleOuterClick=(e)=>{
        togglePopupVisibility();
    }
    const handleInnerClick=(e)=>{
        e.stopPropagation();
    }

    const changeRoom=(e)=>{
        e.preventDefault();
        joinRoom(roomValue);
        setRoomValue("");
    }
    return(
        <div id="joinRoomPopup" onClick={handleOuterClick}>
            <div className="innerPopup" id= "innerPopupJoinRoom" onClick={handleInnerClick}>
                <button type="close-btn" id="closePopupBtn" onClick={()=>togglePopupVisibility()}>x</button>
                Join a chat room!
                <br/>
                Enter an existing room key, or make a new one!
                <br/>
                {roomToJoinInvalid?<div id="roomJoinInvalid">That room is invalid</div>:roomToJoinStatus==="userAlreadyInRoom"?<div id="roomAlreadyJoined">You're already in there!</div>:<></>}
                <form id="joinRoomForm" onSubmit={changeRoom}>
                    <input type="text" value={roomValue} onChange={e=>setRoomValue(e.target.value)}></input>
                    <button type="submit" id="submitJoinRoom">Join server</button>
                </form>
            </div>
            
        </div>
    )
}

export default PopupJoinRoom;