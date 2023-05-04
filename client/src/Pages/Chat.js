import React,{useState,useEffect,useRef, useContext,useCallback} from "react";
import Navbar from "../Navigation/Navbar";
import { joinSocketRoom, leaveSocketRoom, sendMessage, receiveJoinMessage, receiveMessage, receiveLeaveMessage, receiveDisconnectMessage,receiveOnlineOfflineUsers,socketError, updateSocketRooms, connected } from "../Utils/socket";
import { validateRoomToCreate,validRoomToJoin } from "../Utils/inputValidation";
import { createGroupRoomRequest,joinRoomRequest,leaveRoomRequest,getUserRooms,getMessages,createDirectMessageRequest } from "../Utils/APICalls";
import { debounce } from 'lodash';
import { DirectMessageContext } from "../Components/DirectMessageContext";
import ChatUserList from "../Components/ChatUserList";
import ChatSidebar from "../Components/ChatSidebar";
import { useNavigate } from "react-router";
import Chatbox from "../Components/Chatbox";
import RoomInfo from "../Components/RoomInfo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup,faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Chat=({loggedIn,username,smallScreen})=>{
    //styling based on screen size
    useEffect(()=>{
        const sidebarContainer = document.querySelector('.sidebar-container');
        const userlistSidebarContainer=document.querySelector('.userlist-container');
        const chatboxContainer=document.querySelector('.fullChatContainer');
        if(!smallScreen){
            sidebarContainer.style.marginTop='64px';
            sidebarContainer.style.width='20%';
            sidebarContainer.style.maxHeight='calc(100vh - 100px)';
            userlistSidebarContainer.style.marginTop='144px';
            userlistSidebarContainer.style.width='20%';
            if(chatboxContainer){
                chatboxContainer.style.marginLeft='20%';
                chatboxContainer.style.marginRight='20%';
            }
        }else{
            sidebarContainer.style.marginTop='114px';
            sidebarContainer.style.width='40%';
            sidebarContainer.style.maxHeight='calc(100vh - 190px)';
            userlistSidebarContainer.style.marginTop='194px';
            userlistSidebarContainer.style.width='0%';
            if(chatboxContainer){
                chatboxContainer.style.marginLeft='0%';
                chatboxContainer.style.marginRight='0%';
            }
        }
    },[smallScreen])
    //error displayed
    const [errorMessage,setErrorMessage]=useState("");
    //sets an errormessage, then clears it
    const createErrorMessage=(errorMessage)=>{
        setErrorMessage(errorMessage);
        setTimeout(()=>{
            setErrorMessage("");
        },3000)
    }
    //messagelist, hold the messages sent
    const [messageList,setMessageList]=useState({});
    //offset, used to pull previous messages in increments of 50. 
    const [offset,setOffset]=useState({});
    //used to navigate to a different page
    const navigate=useNavigate();

    //toggles sidebar display, toggles its width from 0 and 40%
    const [showSidebar,setShowSidebar]=useState(true);
    const toggleShowSideBar=()=>{
        setShowSidebar(!showSidebar);
        const sidebarContainer = document.querySelector('.sidebar-container');
        sidebarContainer.style.width = showSidebar ? 0 : '40%';
    }
    //toggles userinfo sidebar display, toggles its width from 0 and 40%
    const [showUserList,setShowUserList]=useState(true);
    const toggleUserListVisibility=()=>{
        setShowUserList(!showUserList);
        const userlistSidebarContainer=document.querySelector('.userlist-container');
        userlistSidebarContainer.style.width = showUserList ? '40%' : 0;
    }
    //toggles roomInfo visibility
    const [roomInfoVisible,setRoomInfoVisible]=useState(false);
    const toggleRoomInfoVisibility=()=>{
        const newRoomInfoVisible = !roomInfoVisible;
        setRoomInfoVisible(!roomInfoVisible);
        const roomInfoElement = document.querySelector('.roominfo-container');
        roomInfoElement.style.maxHeight=newRoomInfoVisible?'0':'500px';
    }
    //toggles showing room vs dms list
    const [showRooms,setShowRooms]=useState(true);
    const toggleShowRooms=()=>{
        setShowRooms(!showRooms);
    }
    //current room you're in, shows chat messages that have been sent in that room
    const [roomSelected,setRoomSelected]=useState("");
    const [roomLinkSelected,setRoomLinkSelected]=useState("");
    const selectRoom=(roomName,roomLink)=>{
        setRoomSelected(roomName);
        setRoomLinkSelected(roomLink);
        if(smallScreen){
            toggleShowSideBar();
        }
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
        try{
            const userRooms=await getUserRooms();
            if(userRooms["status"]==="success") setRoomsEntered(userRooms["userRooms"]);
            return userRooms;
        }catch(err){
            return {status:"error",error:err};
        }   
    }
    const {usernameToDm}=useContext(DirectMessageContext);
    //if user is logged in, will req server for rooms that the user has joined, and add them to client
    const enterRooms=useCallback(async()=>{
        try{
            if(usernameToDm){
                const dmRequest = await createDirectMessageRequest(usernameToDm);
                if(dmRequest["error"]==="alreadyCreated"){
                    createErrorMessage("Your dm request was unsuccessful, try again later");
                }else{
                    setShowRooms(true);
                    setRoomLinkSelected(dmRequest["roomLink"]);
                    setRoomSelected(usernameToDm);
                }
            }
            const userRooms=await getUserRoomsAsync();
            if (userRooms["status"]==="success"){
                for(const room of userRooms["userRooms"]){
                    joinSocketRoom(username, room["roomLink"]);
                    setOffset((prevOffset) => {
                        return{ ...prevOffset, [room["roomLink"]]:0};
                    });
                }
            }else{
                createErrorMessage("An error has occurred while loading rooms");
            }
        }catch (err){
            createErrorMessage("An error has occurred while loading rooms");
        }
    },[username,usernameToDm]);
    //create room logic
    //creates popup div to create room if user presses create room button
    const [createRoomPopupVisible,setCreateRoomPopupVisible]=useState(false);
    const toggleCreatePopupVisibility=()=>{
        setCreateRoomPopupVisible(!createRoomPopupVisible);
    }
    //error for if the roomname is invalid
    const [roomCreateInvalid,setRoomCreateInvalid]=useState(false);
    const createGroupRoom=(roomName)=>{
        if(loggedIn&&roomName&&validateRoomToCreate(roomName)==="roomNameValid"){
            setRoomCreateInvalid(false);
            const createRoomAsync=async()=>{
                try{
                    const createRoomReq=await createGroupRoomRequest(roomName);
                    if(createRoomReq["status"]==="success"){
                        setCreateRoomPopupVisible(false);
                        setRoomsEntered([...roomsEntered,{roomName:createRoomReq["roomName"],roomLink:createRoomReq["roomLink"],roomType:"group"}])
                        joinSocketRoom(username,createRoomReq["roomLink"]);
                        setRoomSelected(createRoomReq["roomName"]);
                        setRoomLinkSelected(createRoomReq["roomLink"]);
                    }else{
                        createErrorMessage("There was an error in creating the room");
                        
                    }
                }catch(err){
                    createErrorMessage("There was an error in creating the room");
                }
            }
            createRoomAsync();
        }else{
            setRoomCreateInvalid(true);
        }
    }
    //join room logic
    
    const [roomToJoinInvalid,setRoomToJoinInvalid]=useState(false);
    const [roomToJoinStatus,setRoomToJoinStatus]=useState("");
    
    const joinRoom=(roomName)=>{
        if(roomName&&loggedIn){
            if(validRoomToJoin(roomName)==="invalidRoomToJoin"){
                setRoomToJoinInvalid(true);
            }else{
                setRoomToJoinInvalid(false);
                const joinRoomAsync=async()=>{
                    try{
                        const joinRoomReq=await joinRoomRequest(roomName);
                        if(joinRoomReq["status"]==="invalidRoom"){
                            setRoomToJoinInvalid(true);
                        }else if(joinRoomReq["status"]==="userAlreadyInRoom"){
                            setRoomToJoinStatus("userAlreadyInRoom")
                        }else if(joinRoomReq["status"]==="userJoinedRoom"){
                            setRoomToJoinStatus("userJoinedRoom");
                            setJoinRoomPopupVisible(false);
                            setRoomsEntered([...roomsEntered,{roomName:joinRoomReq["roomName"],roomLink:joinRoomReq["roomLink"],roomType:"group"}]);
                            joinSocketRoom(username,joinRoomReq["roomLink"]);
                            setRoomSelected(joinRoomReq["roomName"]);
                            setRoomLinkSelected(joinRoomReq["roomLink"]);
                        }
                        else{
                            createErrorMessage("There was an error in trying to join the room, try again later");
                        }
                    }catch(err){
                        createErrorMessage("There was an error in trying to join the room, try again later");
                    }
                }
                joinRoomAsync();
            }
        }
    }

    //functions that toggles visibility of join room popup
    const [joinRoomPopupVisible,setJoinRoomPopupVisible]=useState(false);
    const toggleJoinPopupVisibility=()=>{
        setJoinRoomPopupVisible(!joinRoomPopupVisible);
        setRoomToJoinInvalid(false);
        setRoomToJoinStatus("");
    }
    //leave room logic
    const leaveRoom=async()=>{
        try{
            const leaveRoomReq=await leaveRoomRequest(roomLinkSelected);
            if(leaveRoomReq["status"]==="success"){
                leaveSocketRoom(username,roomLinkSelected);
                delete messageList[roomLinkSelected];
                setRoomSelected("");
                setRoomLinkSelected("");
                try{
                    const getRoomsRequest=await getUserRoomsAsync();
                    if(getRoomsRequest["status"]==="error"){
                        createErrorMessage("An error has occurred while loading rooms");
                    }
                }catch(err){
                    createErrorMessage("An error has occurred while loading rooms");
                }
            }else{
                createErrorMessage("There was an error in leaving the room");
            }
        }catch(err){
            createErrorMessage("There was an error in leaving the room");
        }
    }
    
    //offline and online users array
    const [onlineUsers,setOnlineUsers]=useState({});
    const [offlineUsers,setOfflineUsers]=useState({});
    //socket io logic
    useEffect(()=>{
        
        if(loggedIn){
            enterRooms();
        }else{
            navigate("/login");
        }
        receiveJoinMessage(async(roomLink)=>{
            try{
                const messageRequest=await getMessages(roomLink,0);
                if(messageRequest["status"]==="success"){
                    const messages=JSON.parse(messageRequest["messages"]);
                    setOffset(prevOffset=>{
                        return {...prevOffset,[roomLink]:50}
                    })
                    const messagesArray=Object.values(messages);
                    let newMessages=messagesArray.map(message=>{
                        return{username:message[0],profilePicture:message[1],message:message[2]};
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
                }else{
                    createErrorMessage("There was an error in retrieving the messages, try reloading the page");
                }
                
            }catch(err){
                createErrorMessage("There was an error in retrieving the messages, try reloading the page");
            }
        })
        connected(username);
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
        });
        socketError(()=>{
            createErrorMessage("There was an error with sending that, try again later");
        });
        updateSocketRooms(async()=>{
            enterRooms();
        })
    },[username,loggedIn,enterRooms,navigate])
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
                try{
                    setPreviousScrollHeight(currentRef.scrollHeight);
                    const messageRequest= await getMessages(roomLinkSelected,offset[roomLinkSelected]);
                    if(messageRequest["status"]==="success"){
                        const messages=JSON.parse(messageRequest["messages"]);
                        const messagesArray=Object.values(messages);
                        let newMessages=messagesArray.map(message=>{
                            return{username:message[0],profilePicture:message[1],message:message[2]};
                        })
                        for(let i=newMessages.length-1;i>=0;i--){
                            setMessageList(prevMessageList=>{
                                return {...prevMessageList,[roomLinkSelected]:[{username:newMessages[i]["username"],message:newMessages[i]["message"],profilePicture:newMessages[i]["profilePicture"]},...prevMessageList[roomLinkSelected]]}
                            })
                        }
                        setOffset(prevOffset=>{
                            return{...prevOffset,[roomLinkSelected]:prevOffset[roomLinkSelected]+50}
                        })
                    }else{
                        createErrorMessage("There was an error loading messages, reload the page and try again later");
                    }
                }catch(err){
                    createErrorMessage("There was an error loading messages, reload the page and try again later");
                }
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
        sendMessage(username,roomLinkSelected,messageToSend);
        setMessageToSend("");
    }
    return(
        <div className="bg-blue-500">
            <Navbar loggedIn={loggedIn} username={username}/>
            <div id="chatContainer" className="h-full flex">
                <div className="flex justify-between bg-blue-500 mb-1">
                    {smallScreen&&<button onClick={()=>toggleShowSideBar()} className="ml-2"style={{backgroundColor:'white', borderRadius:'50%', height:'50px', width:'50px'}}><FontAwesomeIcon icon={faArrowLeft} size="2x" style={{transition: 'transform 0.3s ease-in-out', transform: showSidebar ? 'none' : 'rotate(180deg)'}}/></button>}
                    {(smallScreen&&roomSelected)&&<button onClick={()=>toggleRoomInfoVisibility()} className="leaveRoom bg-white text-blue-500 font-bold py-1 px-4 rounded">Room Info</button>}
                    {smallScreen&&roomSelected&&<button onClick={()=>toggleUserListVisibility()} className="mr-2" style={{backgroundColor:'white', borderRadius:'50%',height:'50px', width:'50px'}}><FontAwesomeIcon icon={faUserGroup} size="2x" className="mb-2"/></button>}
                </div>
                <div className="roominfo-container">
                    <RoomInfo roomSelected={roomSelected} roomLinkSelected={roomLinkSelected} leaveRoom={leaveRoom} smallScreen={smallScreen}/>
                </div>
                {errorMessage&&<div id="errorContainer" className="text-center bg-red-500 px-3 py-2 rounded text-gray-100 mb-3 w-1/2 mx-auto">
                    {errorMessage}
                </div>}
                <div className='sidebar-container' style={{width:'40%'}}>
                    <ChatSidebar toggleShowRooms={toggleShowRooms} showRooms={showRooms} roomsEntered={roomsEntered} selectRoom={selectRoom} toggleCreatePopupVisibility={toggleCreatePopupVisibility} toggleJoinPopupVisibility={toggleJoinPopupVisibility} createRoomPopupVisible={createRoomPopupVisible} joinRoomPopupVisible={joinRoomPopupVisible} createGroupRoom={createGroupRoom} joinRoom={joinRoom} roomToJoinInvalid={roomToJoinInvalid} roomToJoinStatus={roomToJoinStatus} roomCreateInvalid={roomCreateInvalid} />
                </div>
                <div className="userlist-container">
                    <ChatUserList onlineUsers={onlineUsers[roomLinkSelected]} offlineUsers={offlineUsers[roomLinkSelected]}/>
                </div>
                <Chatbox username={username} messageList={messageList[roomLinkSelected]} chatboxRef={chatboxRef} submitMessage={submitMessage} messageToSend={messageToSend} setMessageToSend={setMessageToSend}/>
            </div>
        </div>
    )
}

export default Chat;