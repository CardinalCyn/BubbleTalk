const { searchUserByInsertID } = require('./db');

module.exports=(app,checkValidLogin,checkValidRegistration,checkValidProfile,upload,updateProfilePicture,searchUserByUsername,createRoom,createDirectRoom,joinRoom,leaveRoom,getRoomsJoined,getMessagesInRoom)=>{
    const fs=require('fs');
    app.get("/",async (req,res)=>{
        res.json({status:"hi"})
    })
    app.post("/login",async(req,res)=>{
        let {username,password,staySignedIn}=req.body;
        const user=await checkValidLogin(username,password);
        if(user==="usernameInvalid"||user==="passwordInvalid"){
            res.send(user);
        }else{
            if(!staySignedIn){
                req.session.cookie.expires=new Date(Date.now()+2*60*60*1000)
            }
            req.session.user=user;
            req.session.save();
            res.send("userValid");
        }
    })
    app.post("/register",async(req,res)=>{
        const {email,username,password}=req.body;
        let userStatus=await checkValidRegistration(email,username,password);
        if(typeof userStatus!=="string"){
            if(!userStatus.hasOwnProperty("userID")){
                res.send(userStatus);
            }
            else{
                req.session.user=userStatus;
                req.session.save();
                res.send(req.session.user.userUsername);
            }
        }
        else{
            res.send(userStatus);
        }
    })
    app.get("/checkSession",async(req,res)=>{
        if(req.session.user){
            res.send(req.session.user.userUsername);
        }
        else{
            res.send("notLoggedIn");
        }
    })
    app.post("/checkValidProfile",async(req,res)=>{
        const username=req.body.username;
        const profileStatus=await checkValidProfile(username);
        res.send(profileStatus);
    })
    app.post("/profilePictureUpload",upload.single("profilePicture"),async(req,res,next)=>{
        const profileUsername=req.body.profileNameOfProfilePage;
        const loggedInUser=req.session.user.userUsername;
        if(!req.session.user){
            res.json({status:"notLoggedIn"});
        }
        else if(!req.file){
            res.json({status:"fileNotSent"});
        }
        else if(profileUsername!==loggedInUser){
            res.json({status:"invalidPictureUploadAttempt"});
        }
        else{
            const previousUserPFP=await searchUserByUsername(profileUsername);
            const updatePFPStatus=await updateProfilePicture(profileUsername,req.file.path);
            if(updatePFPStatus.serverStatus===34){
                if(previousUserPFP[0].userProfilePic!=="userProfilePictures\\d26c2ad3-cfe8-43a7-b025-f08b168b3757.jpeg"){
                    fs.unlink(previousUserPFP[0].userProfilePic,(err)=>{
                        if(err) throw err;
                    })
                }
                fs.createReadStream(req.file.path).pipe(res);
            }
            else{
                res.send("fileNotSent");
            }
        }
    })
    app.get("/profilePicture",async(req,res)=>{
        const userProfile=await searchUserByUsername(req.query.username);
        const userProfilePicPath=userProfile[0].userProfilePic;
        fs.createReadStream(userProfilePicPath).pipe(res);
    })
    app.post("/createRoom",async(req,res)=>{
        const {roomName,roomType}=req.body;
        const userUsername=req.session.user.userUsername;
        const statusRoomCreation=await createRoom(userUsername,roomName,roomType);
        res.json({status:"success",roomLink:statusRoomCreation.roomLink,roomName:roomName});
    })
    app.post('/createDirectMessageRoom',async(req,res)=>{
        const {userToDM}=req.body;
        const userUsername=req.session.user.userUsername;
        const statusDMCreation=await createDirectRoom(userUsername,userToDM);
        res.send(statusDMCreation);
    })
    app.post("/joinRoom",async(req,res)=>{
        const userUsername=req.session.user.userUsername;
        const roomLink=req.body.roomLink;
        const joinRoomReq=await joinRoom(userUsername,roomLink);
        res.json(joinRoomReq);
    })
    app.post("/leaveRoom",async(req,res)=>{
        const username=req.session.user.userUsername;
        const roomLink=req.body.roomLink;
        const leaveRoomStatus=await leaveRoom(username,roomLink);
        if(leaveRoomStatus==="userLeft"){
            res.send("success");
        }else{
            res.send("userLeftFailed");
        }
    })
    app.get("/getUserRooms",async(req,res)=>{
        const userUsername=req.session.user.userUsername;
        const roomsJoined=await getRoomsJoined(userUsername);
        res.send(roomsJoined);
    })
    app.get('/getMessages/:roomLink/:offset?/',async(req,res)=>{
        const {roomLink,offset}=req.params;
        const messagesResult=await getMessagesInRoom(roomLink,Number(offset));
        let messagesArray=[];
        let userIdsRetrieved={};
        for(const message of messagesResult){
            if(!userIdsRetrieved.hasOwnProperty(message["userID"])){
                const userData=await searchUserByInsertID(message["userID"]);
                const userUsername=userData[0]["userUsername"];
                const userProfilePicPath=userData[0]["userProfilePic"];
                const userProfilePic=fs.readFileSync(userProfilePicPath);
                userIdsRetrieved[message["userID"]]=[userUsername,userProfilePic];
                messagesArray.unshift([userUsername,userProfilePic,message["messageText"]])
            }else{
                const userUsername=userIdsRetrieved[message["userID"]][0]
                const userProfilePic=userIdsRetrieved[message["userID"]][1]
                messagesArray.unshift([userUsername,userProfilePic,message["messageText"]])
            }
        }
        res.send(JSON.stringify(messagesArray));
    })
    app.get("/logout",async(req,res)=>{
        req.session.destroy((err)=>{
            if(err) throw err;
            res.clearCookie("chat_app_session");
            res.send("sessionDestroyed");
        })
    })
}