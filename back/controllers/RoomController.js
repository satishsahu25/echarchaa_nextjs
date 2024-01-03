const RoomDto = require("../dtos/roomDto");
const  RoomService=require('../services/roomService');

class RoomController {
  async createRoom(req, res) {

    const { topic, roomtype } = req.body;
 
    if (!topic || !roomtype) {
      return res.status(400).json({ msg: "All fields are required" });
    }

  
    const room = await RoomService.createRoom({
      topic,
      roomtype,
      ownerId: req.user._id,
    });
    
    return res.status(200).json(new RoomDto(room));
  }

  async getAllRooms(req,res){
    const rooms=await RoomService.getAllRooms(['open']);
    const allrooms=rooms.map(room=>new RoomDto(room)); //all rooms go in formatted way
    return res.json(allrooms);
  }
}

module.exports = new RoomController();
