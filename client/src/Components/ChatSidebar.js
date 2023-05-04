import React from 'react'
import PopupCreateRoom from './PopupCreateRoom'
import PopupJoinRoom from './PopupJoinRoom'
const ChatSidebar=({toggleShowRooms,showRooms,roomsEntered,selectRoom,toggleCreatePopupVisibility,toggleJoinPopupVisibility,createRoomPopupVisible,joinRoomPopupVisible,createGroupRoom,joinRoom,roomToJoinInvalid,roomToJoinStatus,roomCreateInvalid})=> {

  return (
    <div id="sideBar" className='sidebar bg-blue-300 h-full'>
        <button id="joinRoomButton" className="bg-gray-200 hover:bg-blue-700 font-bold py-2 px-4 rounded w-11/12 h-10 mt-2 items-center" onClick={()=>{toggleJoinPopupVisibility()}}>Join a Room!</button>
        <button id= "createRoomButton" className="mt-2 bg-gray-200 hover:bg-blue-700 font-bold py-2 px-4 rounded w-11/12 h-10" onClick={toggleCreatePopupVisibility}>Create a Room!</button>
        <button className="mt-2 bg-gray-200 hover:bg-blue-700 font-bold py-2 px-2 rounded w-11/12 h-10" onClick={()=>toggleShowRooms()}>{showRooms?<div>Rooms</div>:<div>Direct Messages</div>}</button>
        <h1 className='text-bold text-lg font-bold text-gray-700 mt-2 text-center mb-2'>{showRooms?"Rooms Joined":"Direct Messages"}</h1>
        <div id="roomsJoinedContainer" className='mt-2 w-11/12 text-center overflow-y-auto' style={{maxHeight:'50vh'}}>
          <ul id="roomsJoinedList" className='flex flex-col'>
            {showRooms?
            roomsEntered.filter(room=>room["roomType"]==="group").map(room=><button className=" font-bold mt-1 mx-auto w-full py-2 px-4 rounded bg-gray-200 hover:bg-blue-700" key={room["roomLink"]} onClick={()=>{selectRoom(room["roomName"],room["roomLink"])}}>{room["roomName"]}</button>)
            :
            roomsEntered.filter(room=>room["roomType"]==="direct").map(room=><button className="font-bold mt-1 mx-auto w-full py-2 px-4 rounded bg-gray-200 hover:bg-blue-700" key={room["roomLink"]} onClick={()=>{selectRoom(room["roomName"],room["roomLink"])}}>{room["roomName"]}</button>)}
          </ul>
        </div>
        {joinRoomPopupVisible&&<PopupJoinRoom togglePopupVisibility={toggleJoinPopupVisibility} joinRoom={joinRoom} roomToJoinInvalid={roomToJoinInvalid} roomToJoinStatus={roomToJoinStatus}/>}
        {createRoomPopupVisible&&<PopupCreateRoom togglePopupVisibility={toggleCreatePopupVisibility} createRoom={createGroupRoom} roomCreateInvalid={roomCreateInvalid}/>}
    </div>
  )
}

export default ChatSidebar