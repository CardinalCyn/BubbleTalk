import io from 'socket.io-client';
const socket= io('https://192.168.1.192:5000',{
    secure:true
});
export const connected=(username)=>{
    socket.emit("connected",username);
}
export const joinSocketRoom=(username,roomLink)=>{
    socket.emit('enterRoom',username,roomLink);
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
        cb(username,roomLink,message,imageData);
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
        cb(roomLink,onlineUsers,offlineUsers);
    })
}
export const updateSocketRooms=(cb)=>{
    socket.on('updateSocketRooms',()=>{
        cb();
    })
}
export const socketError=(cb)=>{
    socket.on('socketError',()=>{
        cb();
    })
}