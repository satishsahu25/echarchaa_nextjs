class RoomDto{
    id;
    topic;
    roomtype;
    speakers;
    ownerId;
    createdAt;

    constructor(room){

        this.id=room._id;
        this.topic=room.topic;
        this.roomtype=room.roomtype;
        this.speakers=room.speakers
        this.ownerId=room.ownerId;
        this.speaker=room.speaker;
    }
}


//no need to create Instance

module.exports=RoomDto;