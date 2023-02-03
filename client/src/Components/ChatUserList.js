const ChatUserList=({roomLinkSelected,onlineUsers,offlineUsers})=>{
    return(
        <div id="userList" className="">
            <ul id="onlineUsers">
                Online: {onlineUsers[roomLinkSelected]&&onlineUsers[roomLinkSelected].map((user,index)=>(<li className="list-none flex" key={index}><img className="w-8 h-8 rounded-full mr-2 inline-block" id="profilePictureImage" alt="" src={user.userProfilePic}/><span className="flex-1">{user.userUsername}</span></li>))}
            </ul>
            <ul id="offlineUsers">
                Offline: {offlineUsers[roomLinkSelected]&&offlineUsers[roomLinkSelected].map((user,index)=>(<li className="list-none flex" key={index}><img className="w-8 h-8 rounded-full mr-2 inline-block" id="profilePictureImage" alt="" src={user.userProfilePic}/>{user.userUsername}</li>))}
            </ul>
        </div>
    )
}
export default ChatUserList;