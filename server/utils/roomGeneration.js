const generateRoomLink=()=>{
    let roomLink="";
    for(let i=0;i<8;i++){
        let randomCase=Math.random();
        if(randomCase<.5){
            roomLink+=String.fromCharCode(65+Math.floor(26*Math.random()));
        }else{
            roomLink+=String.fromCharCode(97+Math.floor(26*Math.random()))
        }
    }
    return roomLink;
}

module.exports={generateRoomLink};