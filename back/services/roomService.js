const RoomModel = require("../models/RoomModel");

class RoomService {
  async createRoom(payload) {
    const { topic, roomtype, ownerId } = payload;

    const room = await RoomModel.create({
      topic,
      roomtype,
      ownerId,
      speakers: [ownerId],
    });
    return room;
  }

  async getAllRooms(types) {
    const rooms=await RoomModel.find({roomtype:{$in:types}}).populate('speakers').populate('ownerId').exec();
    return rooms;
  }

}

module.exports =new RoomService();
