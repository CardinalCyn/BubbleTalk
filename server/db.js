const mysql=require("mysql");
const roomGeneration=require('./utils/roomGeneration')
const generateRoomLink=roomGeneration.generateRoomLink;
const filterRoom=require('./utils/filterString')
const filterRoomName=filterRoom.filterRoomName;
const config={
    connectionLimit:process.env.DB_CONNECTION_LIMIT,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
}

const db=mysql.createPool(config);

const searchUserByInsertID=(insertId)=>{
    return new Promise((resolve,reject)=>{
        const searchPrefix="SELECT * FROM usertable WHERE userID = ?";
        const sqlSearchQuery=mysql.format(searchPrefix,[insertId]);
        db.query(sqlSearchQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
const searchUserByUsername=(username)=>{
    return new Promise((resolve,reject)=>{
        const searchPrefix="SELECT * FROM usertable WHERE userUsername = ?"
        const sqlSearchQuery=mysql.format(searchPrefix,[username]);
        db.query(sqlSearchQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
            
        })
    })
}
const searchUserByUsernameAndEmail=(username,email)=>{
    return new Promise((resolve,reject)=>{
        const searchPrefix="SELECT * FROM usertable WHERE userUsername = ? OR userEmail = ?"
        const sqlSearchQuery=mysql.format(searchPrefix,[username,email]);
        db.query(sqlSearchQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
const createUser=(email,username,hashedPassword,pfpLink)=>{
    return new Promise((resolve,reject)=>{
        const insertPrefix="INSERT INTO usertable VALUES (0,?,?,?,?)";
        const sqlInsertQuery=mysql.format(insertPrefix,[email,username,hashedPassword,pfpLink]);
        db.query(sqlInsertQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
const updateProfilePicture=(username,profilePicturePath)=>{
    return new Promise((resolve,reject)=>{
        const updatePrefix="UPDATE userTable SET userProfilePic= ? WHERE userUsername = ?";
        const updateQuery=mysql.format(updatePrefix,[profilePicturePath,username]);
        db.query(updateQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
const checkValidRoomLink=(roomLink)=>{
    return new Promise((resolve,reject)=>{
        const searchPrefix="SELECT * FROM rooms WHERE roomLink= ?";
        const searchQuery=mysql.format(searchPrefix,[roomLink]);
        db.query(searchQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

const searchUserRoomsJoined=(userID,roomID)=>{
    return new Promise((resolve,reject)=>{
        const searchUserRoomsJoinedPrefix="SELECT * FROM userroomsjoined WHERE roomID = ? AND userID= ?";
        const searchUserRoomsJoinedQuery=mysql.format(searchUserRoomsJoinedPrefix,[roomID,userID]);
        db.query(searchUserRoomsJoinedQuery,async(err,result)=>{
            if(err) return reject(err)
            return resolve(result);
        })
    })
}
//creates room and joins it
const createRoom=async(username,roomName,roomType)=>{
    
    //generates roomLink, makes sure that it doesn't exist in db
    let roomLink="";
    while(true){
        roomLink=generateRoomLink();
        let searchValidRoomLinkResults=await checkValidRoomLink(roomLink);
        if(searchValidRoomLinkResults.length===0){
            break;
        }
    }
    
    const usernameSearch=await searchUserByUsername(username);
    const userID=usernameSearch[0].userID;
    const insertRoomPrefix="INSERT INTO rooms VALUES (0,?,?,?)";
    const insertRoomQuery=mysql.format(insertRoomPrefix,[roomName,roomLink,roomType]);
    const insertUserRoomsJoinedPrefix="INSERT INTO userroomsjoined VALUES (?,?)";

    return new Promise((resolve,reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return reject(err);
            connection.beginTransaction(err=>{
                if(err) return reject(err);
                connection.query(insertRoomQuery,async(err,result)=>{
                    if(err){
                        return connection.rollback((err)=>{
                            return reject(err);
                        });
                    }
                    const roomID=result.insertId;
                    const insertUserRoomsJoinedQuery=mysql.format(insertUserRoomsJoinedPrefix,[roomID,userID]);
                    connection.query(insertUserRoomsJoinedQuery,async(err,result)=>{
                        if(err){
                            return(connection.rollback((err)=>{
                                connection.release();
                                return reject(err);
                            }))
                        }
                        connection.commit((err)=>{
                            if(err){
                                return connection.rollback(()=>{
                                    connection.release();
                                    return reject(err);
                                })
                            }
                            connection.release();
                            return resolve({roomName:roomName,roomLink:roomLink});
                        })
                    })
                })
            })
        })
    })
}
const searchDirectRoom=async(roomName1,roomName2)=>{
    return new Promise((resolve,reject)=>{
        const searchRoomsPrefix="SELECT * FROM rooms WHERE roomName= ? OR roomName= ?";
        const searchRoomsQuery=mysql.format(searchRoomsPrefix,[roomName1,roomName2]);
        db.query(searchRoomsQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
const createDirectRoom=async(userUsername,usernameToDm)=>{
    //makes sure that there isnt already a dm room already created
    
    //generates roomLink, makes sure that it doesn't exist in db
    let roomLink="";
    while(true){
        roomLink=generateRoomLink();
        let searchValidRoomLinkResults=await checkValidRoomLink(roomLink);
        if(searchValidRoomLinkResults.length===0){
            break;
        }
    }
    const userUsernameSearch=await searchUserByUsername(userUsername);
    const userUserID=userUsernameSearch[0].userID;
    const usernameToDmSearch=await searchUserByUsername(usernameToDm);
    const userToDmID=usernameToDmSearch[0].userID;

    const insertRoomPrefix="INSERT INTO rooms VALUES (0,?,?,?)";
    const insertRoomQuery=mysql.format(insertRoomPrefix,[userUsername+"/"+usernameToDm,roomLink,"direct"]);
    const insertUserRoomsJoinedPrefix="INSERT INTO userroomsjoined VALUES (?,?),(?,?)";

    return new Promise(async(resolve,reject)=>{
        const str1=userUsername+'/'+usernameToDm;
        const str2=usernameToDm+'/'+userUsername;
        const searchResults=await searchDirectRoom(str1,str2);
        if(searchResults.length>0){
            return resolve("alreadyCreated");
        }
        db.getConnection((err,connection)=>{
            if(err) return reject(err);
            connection.beginTransaction(err=>{
                if(err) return reject(err);
                connection.query(insertRoomQuery,async(err,result)=>{
                    if(err){
                        return connection.rollback((err)=>{
                            return reject(err);
                        })
                    }
                    const roomID=result.insertId;
                    const insertUserRoomsJoinedQuery=mysql.format(insertUserRoomsJoinedPrefix,[roomID,userUserID,roomID,userToDmID]);
                    connection.query(insertUserRoomsJoinedQuery,async(err,result)=>{
                        if(err){
                            return connection.rollback((err)=>{
                                connection.release();
                                return reject(err);
                            })
                        }
                        connection.commit((err)=>{
                            if(err){
                                return connection.rollback((err)=>{
                                    connection.release();
                                    return reject(err);
                                })
                            }
                            connection.release();
                            return resolve("success");
                        })
                    })
                })
            })
        })
    })
}
const joinRoom=async(username,roomLink)=>{
    return new Promise(async(resolve,reject)=>{
        const roomLinkValid=await checkValidRoomLink(roomLink);
        if(roomLinkValid.length===0){
            return resolve({status:"invalidRoom"})
        }
        let roomID=roomLinkValid[0]["roomID"];
        const usernameValid=await searchUserByUsername(username);
        const userID=usernameValid[0]["userID"];
    
        const validRoom= await searchUserRoomsJoined(userID,roomID);
        if(validRoom.length){
            return resolve({status:"userAlreadyInRoom"});
        }
    
        const insertUserRoomsJoinedPrefix="INSERT INTO userroomsjoined VALUES(?,?)";
        const insertUserRoomsJoinedQuery=mysql.format(insertUserRoomsJoinedPrefix,[roomID,userID]);
        db.query(insertUserRoomsJoinedQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve({status:"userJoinedRoom",roomLink:roomLink,roomName:roomLinkValid[0]["roomName"]});
        })
    })
}
const leaveRoom=async(username,roomLink)=>{
    const usernameIDResults=await(searchUserByUsername(username));
    const userID=usernameIDResults[0]["userID"]
    const room=await(checkValidRoomLink(roomLink));
    const roomID= room[0]["roomID"]

    return new Promise((resolve,reject)=>{
        const deleteUserRoomsRowPrefix="DELETE FROM userroomsjoined WHERE userID= ? AND roomID= ?";
        const deleteUserRoomsRowQuery=mysql.format(deleteUserRoomsRowPrefix,[userID,roomID]);
        db.query(deleteUserRoomsRowQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve("userLeft");
        })
    })
}
const getRoomFromRoomID=(roomID)=>{
    return new Promise((resolve,reject)=>{
        const selectRoomPrefix="SELECT * FROM rooms WHERE roomID= ?";
        const selectRoomQuery=mysql.format(selectRoomPrefix,[roomID]);
        db.query(selectRoomQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve(result[0]);
        })
    })
}
const getRoomsJoined=async(username)=>{
    const userNameResults=await searchUserByUsername(username);
    const userID= userNameResults[0]["userID"];
    return new Promise((resolve,reject)=>{
        const searchUserRoomsJoinedPrefix="SELECT * FROM userroomsjoined WHERE userID= ?";
        const searchUserRoomsJoinedQuery=mysql.format(searchUserRoomsJoinedPrefix,[userID]);
        db.query(searchUserRoomsJoinedQuery,async(err,result)=>{
            if(err) return reject(err);
            let arrRooms=[];
            for(let i=0;i<result.length;i++){
                const getRoom=await getRoomFromRoomID(result[i]["roomID"]);
                let roomObjWithoutID;
                if(getRoom["roomType"]==="direct"){
                    roomObjWithoutID={roomName:filterRoomName(getRoom["roomName"],username),roomLink:getRoom["roomLink"],roomType:getRoom["roomType"]};
                }else{
                    roomObjWithoutID={roomName:getRoom["roomName"],roomLink:getRoom["roomLink"],roomType:getRoom["roomType"]}
                }
                arrRooms.push(roomObjWithoutID);
            }
            return resolve(arrRooms);
        })
    })
}
const getUsersInRoom=async(roomLink)=>{
    return new Promise((resolve,reject)=>{
        const searchUsersInRoomPrefix="SELECT usertable.userProfilePic, usertable.userUsername FROM usertable JOIN userroomsjoined ON usertable.userID = userroomsjoined.userID JOIN rooms ON userroomsjoined.roomID = rooms.roomID WHERE rooms.roomLink = ?";
        const searchUsersInRoomQuery=mysql.format(searchUsersInRoomPrefix,roomLink);
        db.query(searchUsersInRoomQuery,async(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
const uploadMessage=(username,roomLink,message)=>{
    return new Promise(async(resolve,reject)=>{
        const roomCheckResults=await checkValidRoomLink(roomLink);
        const roomID=roomCheckResults[0]["roomID"];
        const searchUserResults=await searchUserByUsername(username);
        const userID=searchUserResults[0]["userID"];
        const uploadMessagePrefix="INSERT INTO messages VALUES (0,?,?,?,NOW())";
        const uploadMessageQuery=mysql.format(uploadMessagePrefix,[message,roomID,userID]);
        db.query(uploadMessageQuery,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
const getMessagesInRoom=(roomLink,offset)=>{
    return new Promise(async(resolve,reject)=>{
        const roomCheckResults=await checkValidRoomLink(roomLink);
        const roomID=roomCheckResults[0]["roomID"];
        const searchMessagesPrefix="SELECT * from messages WHERE roomID= ? ORDER BY messageID DESC LIMIT 50 OFFSET ?";
        const searchMessagesQuery=mysql.format(searchMessagesPrefix,[roomID,offset]);
        db.query(searchMessagesQuery,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
module.exports={db,searchUserByInsertID,searchUserByUsername,searchUserByUsernameAndEmail,createUser,updateProfilePicture,createRoom,createDirectRoom,joinRoom,leaveRoom,getRoomsJoined,getUsersInRoom,getMessagesInRoom,uploadMessage,getMessagesInRoom}