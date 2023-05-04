import React from "react";

const RoomInfo=({roomSelected,roomLinkSelected,leaveRoom,smallScreen})=>{
    
    return(
        <div id="roomInfo" className="bg-blue-500">
            {roomSelected&&
            <div className={smallScreen?"flex justify-between font-bold text-center text-white":"justify-center flex font-bold text-center text-white space-x-10"}> 
                <div id="selectedRoom" className="">
                    Room: <br />{roomSelected}
                </div>
                <div id="roomLink" className="">
                    Room Link: <br />{roomLinkSelected}
                </div>
                <button onClick={()=>leaveRoom()} className="leaveRoom hover:bg-red-600 bg-white text-blue-500 font-bold py-1 px-4 rounded">Leave room</button>
            </div>  
            }
        </div>
    )
}

export default RoomInfo