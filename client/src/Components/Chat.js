import React,{useState,useEffect,useRef, useContext} from "react";
import Navbar from "../Navigation/Navbar";
import { checkSession } from "../Utils/APICalls";
import { joinSocketRoom, leaveSocketRoom, sendMessage, receiveJoinMessage, receiveMessage, receiveLeaveMessage, receiveDisconnectMessage,receiveOnlineOfflineUsers } from "../Utils/socket";
import { useNavigate } from "react-router";
import { validateRoomToCreate,validRoomToJoin } from "../Utils/inputValidation";
import { createGroupRoomRequest,joinRoomRequest,leaveRoomRequest,getUserRooms,getMessages,createDirectMessageRequest } from "../Utils/APICalls";
import { convertPicture } from "../Utils/ProfilePictureConversion";
import { debounce } from 'lodash';
import { DirectMessageContext } from "./DirectMessageContext";
import ChatUserList from "./ChatUserList";
import ChatSidebar from "./ChatSidebar";
import sidebarLogo from '../logo/sidebar.png'
const Chat=()=>{
    //messagelist, hold the messages sent
    const [messageList,setMessageList]=useState({});
    //offset, used to pull previous messages in increments of 50. 
    const [offset,setOffset]=useState({});
    //allows navigating to other routes
    const navigate=useNavigate();
    //sets user's username
    const [userUsername,setUserUsername]=useState("");
    //checks if user is logged in or not
    const [loggedIn,setLoggedIn]=useState(false);
    //toggles sidebar display
    const [showSidebar,setShowSidebar]=useState(true);
    const toggleShowSideBar=()=>{
        setShowSidebar(!showSidebar);
    }
    //toggles showing room vs dms lsit
    const [showRooms,setShowRooms]=useState(true);
    const [showDirectMessages,setShowDirectMessages]=useState(false);
    const toggleShowRooms=()=>{
        setShowRooms(true);
        setShowDirectMessages(false);
    }
    const toggleShowDirectMessageRooms=()=>{
        setShowDirectMessages(true);
        setShowRooms(false);
    }
    //checks if user is logged in, navigates to home if logged out, sets username and loggedin otherwise
    useEffect(()=>{
        const checkUserLoggedIn=async()=>{
            const loggedInStatus=await checkSession();
            const logStatus=loggedInStatus.toString();
            if(logStatus!=="notLoggedIn"){
                setUserUsername(logStatus);
                setLoggedIn(true);
            }
            else{
                navigate("/RedirectHome");
            }
          }
          checkUserLoggedIn();
    },[navigate])
    //current room you're in, shows chat messages that have been sent in that room
    const [roomSelected,setRoomSelected]=useState("");
    const [roomLinkSelected,setRoomLinkSelected]=useState("");
    const selectRoom=(roomName,roomLink)=>{
        setRoomSelected(roomName);
        setRoomLinkSelected(roomLink);
    }
    //used to scroll to bottom when a message appears in the room that the user is actively looking at
    const chatboxRef=useRef(null);
    const dropChatBoxDivToBottom=()=>{
        const element = document.getElementById('chatboxContainer');
        element.scrollTop = element.scrollHeight;
    }
    useEffect(()=>{
        dropChatBoxDivToBottom();
    },[roomLinkSelected])
    //enter room logic, requests servers for rooms that the user has joined, and puts into usestate array. then creates element in rooms joined that is clickable, and references each room. clicking on one swaps the view to the chatroom that u clicked on
    const [roomsEntered,setRoomsEntered]=useState([]);
    const getUserRoomsAsync=async()=>{
        const userRooms=await getUserRooms();
        setRoomsEntered(userRooms);
        return userRooms;
    }
    useEffect(()=>{
        if(loggedIn){
            //method to get an array for the roomsEntered state
            const enterRooms=async()=>{
                const userRooms=await getUserRoomsAsync();
                for(const room of userRooms){
                    joinSocketRoom(userUsername,room["roomLink"]);
                    setOffset(prevOffset=>{
                        return {...prevOffset,[room["roomLink"]]:0};
                    })
                }
            }
            enterRooms();
        }
    },[loggedIn,userUsername])
    //create room logic
    //creates popup div to create room if user presses create room button
    const [createRoomPopupVisible,setCreateRoomPopupVisible]=useState(false);
    const toggleCreatePopupVisibility=()=>{
        setCreateRoomPopupVisible(!createRoomPopupVisible);
    }
    const [roomCreateInvalid,setRoomCreateInvalid]=useState(false);
    const createGroupRoom=(roomName)=>{
        if(loggedIn&&roomName){
            if(validateRoomToCreate(roomName)==="roomNameValid"){
                setRoomCreateInvalid(false);
                const createRoomAsync=async()=>{
                    const createRoomReq=await createGroupRoomRequest(roomName);
                    if(createRoomReq["status"]==="success"){
                        setCreateRoomPopupVisible(false);
                        setRoomsEntered([...roomsEntered,{roomName:createRoomReq["roomName"],roomLink:createRoomReq["roomLink"],roomType:"group"}])
                        joinSocketRoom(userUsername,createRoomReq["roomLink"]);
                        setRoomSelected(createRoomReq["roomName"]);
                        setRoomLinkSelected(createRoomReq["roomLink"]);
                    }
                }
                createRoomAsync();
            }else{
                setRoomCreateInvalid(true);
            }
        }
    }
    //join room logic
    //functions that toggles visibility of join room popup
    const [joinRoomPopupVisible,setJoinRoomPopupVisible]=useState(false);
    const toggleJoinPopupVisibility=()=>{
        setJoinRoomPopupVisible(!joinRoomPopupVisible);
    }
    const [roomToJoinInvalid,setRoomToJoinInvalid]=useState(false);
    const [roomToJoinStatus,setRoomToJoinStatus]=useState("");
    
    const joinRoom=(roomName)=>{
        if(roomName&&loggedIn){
            if(validRoomToJoin(roomName)==="invalidRoomToJoin"){
                setRoomToJoinInvalid(true);
            }else{
                setRoomToJoinInvalid(false);
                const joinRoomAsync=async()=>{
                    const joinRoomReq=await joinRoomRequest(roomName);
                    if(joinRoomReq["status"]==="invalidRoom"){
                        setRoomToJoinInvalid(true);
                    }else if(joinRoomReq["status"]==="userAlreadyInRoom"){
                        setRoomToJoinStatus("userAlreadyInRoom")
                    }else{
                        setRoomToJoinStatus("userJoinedRoom");
                        setJoinRoomPopupVisible(false);
                        setRoomsEntered([...roomsEntered,{roomName:joinRoomReq["roomName"],roomLink:joinRoomReq["roomLink"],roomType:"group"}]);
                        joinSocketRoom(userUsername,joinRoomReq["roomLink"]);
                        setRoomSelected(joinRoomReq["roomName"]);
                        setRoomLinkSelected(joinRoomReq["roomLink"]);
                    }
                }
                joinRoomAsync();
            }
        }
    }
    //leave room logic
    const leaveRoom=async()=>{
        const leaveRoomStatus=await leaveRoomRequest(roomLinkSelected);
        if(leaveRoomStatus==="success"){
            getUserRoomsAsync();
            leaveSocketRoom(userUsername,roomLinkSelected);
            delete messageList[roomLinkSelected];
            setRoomSelected("");
            setRoomLinkSelected("");
        }else{
            console.log("leaveRoomFail");
        }
    }
    
    //offline and online users array
    const [onlineUsers,setOnlineUsers]=useState({});
    const [offlineUsers,setOfflineUsers]=useState({});
    //socket io logic
    useEffect(()=>{
        receiveJoinMessage(async(roomLink)=>{
            const messages=await getMessages(roomLink,0);
            setOffset(prevOffset=>{
                return {...prevOffset,[roomLink]:50}
            })
            const messagesArray=Object.values(messages);
            let newMessages=messagesArray.map(message=>{
                return{username:message[0],profilePicture:convertPicture(message[1]["data"]),message:message[2]};
            })
            for(const message of newMessages){  
                setMessageList(prevMessageList=>{
                    if(!prevMessageList[roomLink]){
                        return{...prevMessageList,[roomLink]:[{username:message["username"],message:message["message"],profilePicture:message["profilePicture"]}]}
                    }else{
                        return{...prevMessageList,[roomLink]:[...prevMessageList[roomLink],{username:message["username"],message:message["message"],profilePicture:message["profilePicture"]}]}
                    }
                })
            }
        })
        receiveLeaveMessage(()=>{
        });
        receiveDisconnectMessage(()=>{
        });
        receiveMessage((username,roomLink,message,profilePicture)=>{
            setMessageList(prevMessageList=>{
                if(!prevMessageList[roomLink]){
                    return{...prevMessageList,[roomLink]:[{username,message,profilePicture}]};
                }else{
                    return{...prevMessageList,[roomLink]:[...prevMessageList[roomLink],{username,message,profilePicture}]};
                }
            })
            //waits for message to be set to drop the chatbox to bottom
            setTimeout(()=>{
                dropChatBoxDivToBottom();
            },0);
        });
        receiveOnlineOfflineUsers((roomLink,onlineUsers,offlineUsers)=>{
            setOnlineUsers(prevOnlineUsers=>{
                return{...prevOnlineUsers,[roomLink]:onlineUsers}
            })
            setOfflineUsers(prevOfflineUsers=>{
                return{...prevOfflineUsers,[roomLink]:offlineUsers}
            })
        })
    },[])
    //makes it so that when scrolled to the top, will maintain scrollbar so u can still see what u were looking at once messages get appended
    const [previousScrollHeight,setPreviousScrollHeight]=useState(0);
    useEffect(() => {
        const currentRef = chatboxRef.current;
        currentRef.scrollTop += currentRef.scrollHeight - previousScrollHeight;
    }, [previousScrollHeight, messageList]);
    //when the user scrolls to top, pull previous 50 msg history
    useEffect(() => {
        const currentRef = chatboxRef.current;
        const handleScroll = debounce(async() => {
            if(currentRef.scrollTop === 0) {
                setPreviousScrollHeight(currentRef.scrollHeight);
                const messageReq= await getMessages(roomLinkSelected,offset[roomLinkSelected])
                const messagesArray=Object.values(messageReq);
                let newMessages=messagesArray.map(message=>{
                    return{username:message[0],profilePicture:convertPicture(message[1]["data"]),message:message[2]};
                })
                for(let i=newMessages.length-1;i>=0;i--){
                    setMessageList(prevMessageList=>{
                        return {...prevMessageList,[roomLinkSelected]:[{username:newMessages[i]["username"],message:newMessages[i]["message"],profilePicture:newMessages[i]["profilePicture"]},...prevMessageList[roomLinkSelected]]}
                    })
                }
                setOffset(prevOffset=>{
                    return{...prevOffset,[roomLinkSelected]:prevOffset[roomLinkSelected]+50}
                })
            }
        },250);
        currentRef.addEventListener("scroll", handleScroll);
        return ()=>{
            currentRef.removeEventListener("scroll", handleScroll);
        };
    }, [chatboxRef,offset,roomLinkSelected]);
    //send message
    const [messageToSend,setMessageToSend]=useState("");
    const submitMessage=(e)=>{
        e.preventDefault();
        setMessageToSend("");
        sendMessage(userUsername,roomLinkSelected,messageToSend);
    }
    //clicking on dm in profile page runs this
    const {usernameToDm}=useContext(DirectMessageContext)
    useEffect(()=>{
        if(usernameToDm){
            createDirectMessageRequest(usernameToDm);
        }
    },[usernameToDm])
    return(
    <>
    <Navbar loggedIn={loggedIn} username={userUsername}/>
    <div id="chatContainer" className="mt-20 grid grid-cols-12 gap-4 font-openSans">
        <div className="col-span-2">
            <button onClick={()=>toggleShowSideBar()}><img src={sidebarLogo} alt="" className="w-10 h-10 mr-2 mt-2 inline-block"/></button>
            {showSidebar&&  
            <ChatSidebar toggleShowRooms={toggleShowRooms} toggleShowDirectMessageRooms={toggleShowDirectMessageRooms} showRooms={showRooms} showDirectMessages={showDirectMessages} roomsEntered={roomsEntered} selectRoom={selectRoom} toggleCreatePopupVisibility={toggleCreatePopupVisibility} toggleJoinPopupVisibility={toggleJoinPopupVisibility} createRoomPopupVisible={createRoomPopupVisible} joinRoomPopupVisible={joinRoomPopupVisible} createGroupRoom={createGroupRoom} joinRoom={joinRoom} roomToJoinInvalid={roomToJoinInvalid} roomToJoinStatus={roomToJoinStatus} roomCreateInvalid={roomCreateInvalid} />}
        </div>
        <div className="col-span-9 mt-10">
            <div id="roomInfo" className="flex justify-between">
                {roomSelected&&<div id="selectedRoom" className="">
                    Selected Room: {roomSelected}
                </div>}
                {roomLinkSelected&&<div id="roomLink">
                    Room Link: {roomLinkSelected}
                </div>}
                {roomSelected?<button onClick={()=>leaveRoom()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Leave room</button>:<></>}
            </div>
            <div id="chatboxContainer" className="overflow-y-scroll h-64 right-0 bg-gray-400 rounded-lg top-30" ref={chatboxRef}>
                {messageList[roomLinkSelected]&&messageList[roomLinkSelected].map((message, index) => 
                (<li className="list-none flex break-all" key={index}>{message["profilePicture"]&&<img id="profilePictureImage" className="w-10 h-10 rounded-full mr-2 mt-2 inline-block" src={message.profilePicture} alt=""/>}<div className="flex flex-col"><span className="font-semibold">{message.username}</span><span>{message.message}</span></div></li>))}
            </div>
            <form className="flex w-full" onSubmit={submitMessage}>
                <input type="text" value={messageToSend} onChange={e=>setMessageToSend(e.target.value)} className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal w-full"/>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send message</button>
            </form>
        </div>
        {roomSelected&&<ChatUserList roomLinkSelected={roomLinkSelected} onlineUsers={onlineUsers} offlineUsers={offlineUsers} />}
    </div>
    </>
    )
}

export default Chat;