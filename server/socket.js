
module.exports=(https,searchUserByUsername,getUsersInRoom,getMessagesInRoom,uploadMessage)=>{
    const fs=require('fs');
    const io= require('socket.io')(https,{
        cors:{
            origin:"https://192.168.1.192:3000",
        }
    });
    //necessary for handling the socket io disconnections, since the server only has access to the socket io when a user disconnects/ closes tab. used to emit user has disconnected to rooms that they were in
    const users={};
    io.on('connection',(socket)=>{
        socket.on("enterRoom",(username,roomLink)=>{
            socket.join(roomLink);
            if(users[socket.id]){
                if(!users[socket.id][username].includes(roomLink)){
                    users[socket.id]={[username]:[...users[socket.id][username],roomLink]}
                }
            }else{
                users[socket.id]={[username]:[roomLink]}
            }
            socket.emit("enterRoomSuccessful",roomLink);
        })
        socket.on('leaveRoom',async(username,roomLink)=>{
            socket.leave(roomLink);
            users[socket.id][username]=users[socket.id][username].filter(roomLinkVal=>roomLinkVal!==roomLink);
            io.to(roomLink).emit('receiveLeaveMessage',roomLink)
        })
        socket.on("sendMessage",async(username,roomLink,message)=>{
            uploadMessage(username,roomLink,message);
            const searchUserResults=await searchUserByUsername(username);
            const userProfilePicPath=searchUserResults[0].userProfilePic;
            const imageData=fs.readFileSync(userProfilePicPath);
            io.to(roomLink).emit("receiveMessage",username,roomLink,message,imageData);
        })
        socket.on('getOnlineOfflineUsers',async(roomLink)=>{
            //gets all users usernames and pfps that are subscribed to room, online or offline
            const usersInRoom=await getUsersInRoom(roomLink);
            //holds all socketIds connected to room
            const clients = io.sockets.adapter.rooms.get(roomLink);
            if(clients){
                const usernamesOnlineInRoom=[];
                //checks array of users to find which socketId belongs to what username
                for(const socketId of clients){
                    if(Object.keys(users[socketId])){
                        usernamesOnlineInRoom.push(Object.keys(users[socketId])[0]);
                    }
                }
                let offlineUsers=[];
                let onlineUsers=[];
                //get image data of all users, if theyre online push to online, offline to offline
                usersInRoom.forEach(user=>{
                    const imageData=fs.readFileSync(user["userProfilePic"]);
                    user["userProfilePic"]=imageData
                    if(usernamesOnlineInRoom.includes(user["userUsername"])){
                        onlineUsers.push(user);
                    }else{
                        offlineUsers.push(user);
                    }
                })
                io.to(roomLink).emit("receiveOnlineOfflineUsers",roomLink,onlineUsers,offlineUsers);
            }
            
        })
        socket.on('disconnect',()=>{
            if(users[socket.id]){
                const roomsUserWasIn=Object.values(users[socket.id])[0];
                roomsUserWasIn.forEach(room=>{
                    io.to(room).emit('receiveDisconnect',room);
                    socket.leave(room);
                })
                delete users[socket.id];
            }
            socket.removeAllListeners();
        })
    })
};