//express boilerplate
const express=require('express');
const app=express();
//cross origin, allows us to communicate w/ react frontend
const cors=require('cors');
app.use(cors({
    origin:["https://192.168.1.192:3000"],
    methods:["GET","POST","DELETE"],
    credentials:true,
}));
//used to turn server into https
const fs=require('fs');
const options={
    key:fs.readFileSync('./192.168.1.192-key.pem'),
    cert:fs.readFileSync('./192.168.1.192.pem')
}
const https=require('https').createServer(options,app);
//allows us to use req.body
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//allows us to read environment variables
require('dotenv').config()
//sql connection creation, sql functions
const dbExports=require('./db');
const db=dbExports.db;
const createRoom=dbExports.createRoom;
const joinRoom=dbExports.joinRoom;
const leaveRoom=dbExports.leaveRoom;
const getRoomsJoined=dbExports.getRoomsJoined;
//express session middleware
const session=require("express-session");
var MySQLStore = require('express-mysql-session')(session);
const store=new MySQLStore({
    expires: 14*24*60*60*1000,
    clearExpired: true,
    checkExpirationInterval:9000,
    createDatabaseTable:true,
    schema:{
        tableName:"Sessions",
        columnNames:{
            session_id:"session_id",
            expires:"expires",
            data:"session_data"
        }
    }
},db);
app.use(session({
    name:"chat_app_session",
    secret:"fdkmsg",
    resave:false,
    saveUninitialized:false,
    store:store,
    cookie:{
        secure:true,
        maxAge:14*24*60*60*1000,
    }
}))
//verification functions
const inputVerification=require('./inputValidation');
const checkValidLogin=inputVerification.checkValidLogin;
const checkValidRegistration=inputVerification.checkValidRegistration;
const checkValidProfile=inputVerification.checkValidProfile;
//update pfp in db function
const updateProfilePicture=inputVerification.updateProfilePicture;
const searchUserByUsername=inputVerification.searchUserByUsername;
//file upload
const { v4: uuidv4 } = require('uuid');
const multer= require('multer');
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./userProfilePictures')
    },
    filename:(req,file,cb)=>{
        const arraySplit=file.mimetype.split('/');
        const fileName=uuidv4()+"."+arraySplit[arraySplit.length-1];
        cb(null,fileName);
    }
})
const upload = multer({ 
    storage:storage,
    fileFilter:(req,file,cb)=>{
        //checks if the file is a picture or not
        if(file.mimetype=="image/png"||file.mimetype=="image/jpg"||file.mimetype=="image/jpeg"){
            cb(null,true);
        }
        else{
            cb(null,false);
            return cb(new Error('Only pngs, jpgs, and .jpegs are allowed!'))
        }
    }
});
//websocket implementation for chat
require('./socket')(https,searchUserByUsername,dbExports.getUsersInRoom,dbExports.getMessagesInRoom,dbExports.uploadMessage);
//routes
require('./routes')(app,checkValidLogin,checkValidRegistration,checkValidProfile,upload,updateProfilePicture,searchUserByUsername,createRoom,dbExports.createDirectRoom,joinRoom,leaveRoom,getRoomsJoined,dbExports.getMessagesInRoom);

https.listen(5000, console.log("listening on port 5000"));
