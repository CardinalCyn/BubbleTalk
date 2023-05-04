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
            <div className="innerPopup py-20 rounded-lg px-20 justify-center text-center" id= "innerPopupJoinRoom" onClick={handleInnerClick}>
                <button type="close-btn" id="closePopupBtn" onClick={()=>togglePopupVisibility()}></button>
                <div className="flex flex-col">
                    {roomToJoinInvalid?<div id="roomJoinInvalid" className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">That room is invalid</div>:roomToJoinStatus==="userAlreadyInRoom"?<div id="roomAlreadyJoined" className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">You're already in there!</div>:<></>}
                    <h1 className="text-lg">Enter an existing room key!</h1>
                    <form id="joinRoomForm" className="flex flex-col mt-10" onSubmit={changeRoom}>
                        <input type="text" className="w-full py-2 bg-gray-300 text-black px-1 outline-none mb-4" placeholder="fdsaQdfa" value={roomValue} onChange={e=>setRoomValue(e.target.value)}></input>
                        <button type="submit" id="submitJoinRoom" className="bg-blue-500 text-white px-4 py-2 rounded-tl-md rounded-bl-md">Join server</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PopupJoinRoom;