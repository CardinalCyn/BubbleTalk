import axios from 'axios'

axios.defaults.withCredentials=true;

export const loginRequest=(username,password,staySignedIn)=>{
    return new Promise((resolve,reject)=>{
        axios.post("https://192.168.1.192:5000/login",{username:username,password:password,staySignedIn:staySignedIn}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

export const registerRequest=(email,username,password,staySignedIn)=>{
    return new Promise((resolve,reject)=>{
        axios.post("https://192.168.1.192:5000/register",{email:email,username:username,password:password,staySignedIn:staySignedIn}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

export const checkSession=()=>{
    return new Promise((resolve,reject)=>{
        axios.get("https://192.168.1.192:5000/checkSession").then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

export const getAboutMeBio=(username)=>{
    return new Promise((resolve,reject)=>{
        axios.get("https://192.168.1.192:5000/aboutMeBio",{params:{username:username}}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

export const postAboutMeBio=(username,aboutMeBio)=>{
    return new Promise((resolve,reject)=>{
        axios.post("https://192.168.1.192:5000/aboutMeBioUpload",{username:username,aboutMeBio:aboutMeBio}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}
export const checkValidProfile=(username)=>{
    return new Promise((resolve,reject)=>{
        axios.post("https://192.168.1.192:5000/checkValidProfile",{username:username}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

export const uploadProfilePicture=(image)=>{
    return new Promise((resolve,reject)=>{
        axios.post("https://192.168.1.192:5000/profilePictureUpload",image).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            console.log(err);
            return reject(err);
        })
    })
}

export const getProfilePicture=(profileName)=>{
    return new Promise((resolve,reject)=>{
        axios.get("https://192.168.1.192:5000/profilePicture",{params:{username:profileName}}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

export const createGroupRoomRequest=(roomName)=>{
    return new Promise((resolve,reject)=>{
        axios.post("https://192.168.1.192:5000/createRoom",{roomName:roomName,roomType:'group'}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

export const createDirectMessageRequest=(userToDM)=>{
    return new Promise((resolve,reject)=>{
        axios.post('https://192.168.1.192:5000/createDirectMessageRoom',{userToDM}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

export const joinRoomRequest=(roomLink)=>{
    return new Promise((resolve,reject)=>{
        axios.post("https://192.168.1.192:5000/joinRoom",{roomLink:roomLink}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}
export const leaveRoomRequest=(roomLink)=>{
    return new Promise((resolve,reject)=>{
        axios.post("https://192.168.1.192:5000/leaveRoom",{roomLink:roomLink}).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}
export const getUserRooms=()=>{
    return new Promise((resolve,reject)=>{
        axios.get("https://192.168.1.192:5000/getUserRooms").then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}
export const getMessages=(roomLink,offset)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`https://192.168.1.192:5000/getMessages/${roomLink}/${offset}/`).then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

export const logoutRequest=()=>{
    return new Promise((resolve,reject)=>{
        axios.get("https://192.168.1.192:5000/logout").then((response)=>{
            return resolve(response.data);
        }).catch((err)=>{
            return reject(err);
        })
    })
}

