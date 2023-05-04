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
            <div className="innerPopup py-20 rounded-lg px-20 justify-center" id="innerPopupCreateRoom" onClick={handleInnerClick}>
                <button type="close-btn" id="closePopupBtn" onClick={()=>togglePopupVisibility()}></button>
                <div className="flex flex-col">
                    <h1 className="text-lg text-center">Create a chat room!</h1>
                    {roomCreateInvalid?<div id="roomNameInvalid" className="bg-red-500 px-3 py-2 rounded text-gray-100 mb-3">Room names must be between 1 and 25 characters</div>:<></>}
                    <form id="joinRoomForm" className="flex flex-col mt-10" onSubmit={changeRoom}>
                        <input type="text" className="w-full py-2 bg-gray-300 text-black px-1 outline-none mb-4" placeholder="Your room name here!" onChange={e=>setRoomName(e.target.value)}></input>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-tl-md rounded-bl-md" id="submitJoinRoom">Create server</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default PopupCreateRoom