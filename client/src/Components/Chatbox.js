import React from "react";

const Chatbox=({username,messageList,chatboxRef,submitMessage,messageToSend,setMessageToSend})=>{
    return(
        <div className="fullChatContainer flex flex-col grow">
            <div id="chatboxContainer" className="overflow-y-scroll grow bg-gray-200" style={{backgroundColor:'#eff6ff'}} ref={chatboxRef}>
                {messageList&&messageList.map((message, index) => 
                (<li className={`list-none flex break-all messageItem ml-2 ${username===message['username']&&'flex-row-reverse'}`} key={index}>{message["profilePicture"]&&
                <a href={`${message.username}/profile`}>
                    <img id="profilePictureImage" className='ml-2 w-10 h-10 rounded-full mr-3 mt-2 inline-block' src={message.profilePicture} alt=""/></a>}
                    <div className="flex flex-col bg-blue-400 rounded-lg" style={{maxWidth:'75%'}}>
                        <span className="font-semibold mt-1 ml-2">
                            {message.username}
                        </span>
                        <span className="ml-2 mr-2">
                            {message.message}
                        </span>
                    </div>
                </li>))}
            </div>
            <form className="flex rounded-lg bg-gray-300" onSubmit={submitMessage}>
                <input type="text" value={messageToSend} onChange={e=>setMessageToSend(e.target.value)} className="w-full" style={{backgroundColor:'#dbeafe'}} placeholder="Type your message here"/>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-tl-md rounded-bl-md">Send</button>
            </form>
        </div>
    )
}

export default Chatbox