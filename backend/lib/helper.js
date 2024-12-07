
//get all users from room
export const getSocketIdsForEachUserBasedOnRoomId = ( socket, roomId=[]) =>{

    const roomAllIds=[];


    //sometimes the error comes in this part when we dont have required room
            if(socket.adapter.rooms.get(roomId)){
                socket.adapter.rooms.get(roomId).forEach((id)=>{
                roomAllIds.push(id);
              })
            }
        
    
    return roomAllIds;
}

export const getAllRoomUsers = ( allUsers=[], roomAllIds=[]) =>{

    
    const allRoomUsers = Array.from(allUsers).filter((user)=>{
    
        return roomAllIds.includes(user[0]);
      })
      .map((user)=>{
        return user[1];
      })

      return allRoomUsers;

}

