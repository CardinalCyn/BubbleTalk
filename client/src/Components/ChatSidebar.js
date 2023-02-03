import React from 'react'
import PopupCreateRoom from './PopupCreateRoom'
import PopupJoinRoom from './PopupJoinRoom'
const ChatSidebar=({toggleShowRooms,toggleShowDirectMessageRooms,showRooms,showDirectMessages,roomsEntered,selectRoom,toggleCreatePopupVisibility,toggleJoinPopupVisibility,createRoomPopupVisible,joinRoomPopupVisible,createGroupRoom,joinRoom,roomToJoinInvalid,roomToJoinStatus,roomCreateInvalid})=> {
  return (
    <div id="sideBar" className=''>
        <button id="joinRoomButton" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={()=>{toggleJoinPopupVisibility()}}>Join a Room!</button>
        <button id= "createRoomButton" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={toggleCreatePopupVisibility}>Create a Room!</button>
        <div className='flex'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={()=>toggleShowRooms()}>Rooms</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={()=>toggleShowDirectMessageRooms()}>Direct Messages</button>
        </div>
        {showRooms&& 
        <div id="roomsJoinedContainer" className='w-full'>
            Rooms Joined:
            <ul id="roomsJoinedList">
                {roomsEntered.filter(room=>room["roomType"]==="group").map(room=><li className="list-none" key={room["roomLink"]} onClick={()=>{selectRoom(room["roomName"],room["roomLink"])}}>{room["roomName"]}</li>)}
            </ul>
        </div>}
        {showDirectMessages&&<div id="DirectMessagesJoinedContainer" className='w-full'>
            Direct Messages:
            <ul id="dmsJoinedList">
                {roomsEntered.filter(room=>room["roomType"]==="direct").map(room=><li className="list-none" key={room["roomLink"]} onClick={()=>{selectRoom(room["roomName"],room["roomLink"])}}>{room["roomName"]}</li>)}
            </ul>
        </div>}
        
        {joinRoomPopupVisible&&<PopupJoinRoom togglePopupVisibility={toggleJoinPopupVisibility} joinRoom={joinRoom} roomToJoinInvalid={roomToJoinInvalid} roomToJoinStatus={roomToJoinStatus}/>}
        
        {createRoomPopupVisible&&<PopupCreateRoom togglePopupVisibility={toggleCreatePopupVisibility} createRoom={createGroupRoom} roomCreateInvalid={roomCreateInvalid}/>}
    </div>
  )
}

export default ChatSidebar