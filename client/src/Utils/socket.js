import io from 'socket.io-client';
import { convertPicture } from './ProfilePictureConversion';
const socket= io('https://192.168.1.192:5000',{
    secure:true
});

export const joinSocketRoom=(username,roomLink)=>{
    socket.emit('enterRoom',username,roomLink);
    getOnlineOfflineUsers(roomLink);
}
export const leaveSocketRoom=(username,roomLink)=>{
    socket.emit('leaveRoom',username,roomLink);
    getOnlineOfflineUsers(roomLink);
}
export const receiveJoinMessage=(cb)=>{
    socket.on('enterRoomSuccessful',(roomLink)=>{
        getOnlineOfflineUsers(roomLink);
        cb(roomLink);
    })
}
export const receiveLeaveMessage=(cb)=>{
    socket.on('receiveLeaveMessage',(roomLink)=>{
        getOnlineOfflineUsers(roomLink);
    })
}
export const receiveDisconnectMessage=(cb)=>{
    socket.on('receiveDisconnect',(roomLink)=>{
        getOnlineOfflineUsers(roomLink);
    })
}

export const receiveMessage=(cb)=>{
    socket.on('receiveMessage',(username,roomLink,message,imageData)=>{
        const imageSrc=convertPicture(imageData);
        cb(username,roomLink,message,imageSrc);
    })
}
export const sendMessage=(username,roomLink,message)=>{
    socket.emit('sendMessage',username,roomLink,message);
}

const getOnlineOfflineUsers=(roomLink)=>{
    socket.emit('getOnlineOfflineUsers',roomLink);
}
export const receiveOnlineOfflineUsers=(cb)=>{
    socket.on('receiveOnlineOfflineUsers',(roomLink,onlineUsers,offlineUsers)=>{
        for(let i=0;i<onlineUsers.length;i++){
            onlineUsers[i]["userProfilePic"]=convertPicture(onlineUsers[i]["userProfilePic"]);
        }
        for(let i=0;i<offlineUsers.length;i++){
            offlineUsers[i]["userProfilePic"]=convertPicture(offlineUsers[i]["userProfilePic"]);
        }
        cb(roomLink,onlineUsers,offlineUsers);
    })
}
export const getPreviousMessages=(roomLink)=>{

}