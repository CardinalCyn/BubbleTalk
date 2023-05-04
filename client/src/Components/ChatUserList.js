import React from "react";

const ChatUserList=({onlineUsers,offlineUsers})=>{
    return(
        <div className="userlist-sidebar bg-blue-200 h-full">
            <div id="userList overflow-y-auto" style={{maxHeight:'50vh'}}>
                <ul id="onlineUsers" className="ml-3 font-bold">
                    Online: {onlineUsers&&onlineUsers.map((user,index)=>(<a href={`/${user.userUsername}/profile`} className="list-none flex mt-2" key={index}><img className="w-8 h-8 rounded-full mr-2 inline-block" id="profilePictureImage" alt="" src={user.userProfilePic}/><span className="flex-1">{user.userUsername}</span></a>))}
                </ul>
                <ul id="offlineUsers" className="ml-3 mt-2 font-bold">
                    Offline: {offlineUsers&&offlineUsers.map((user,index)=>(<a href={`/${user.userUsername}/profile`} className="list-none flex mt-2" key={index}><img className="w-8 h-8 rounded-full mr-2 inline-block" id="profilePictureImage" alt="" src={user.userProfilePic}/>{user.userUsername}</a>))}
                </ul>
            </div>
        </div>
    )
}
export default ChatUserList;