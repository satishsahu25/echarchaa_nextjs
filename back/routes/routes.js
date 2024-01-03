const express=require('express');
const router=express.Router();
const AuthController=require('../controllers/control');
const ActivateController = require('../controllers/activate_controller');
const auth_middleware = require('../middlewares/auth_middleware');
const RoomController = require('../controllers/RoomController');


router.post('/otp',AuthController.sendOtp);
router.post('/verify-otp',AuthController.verifyOtp);
router.post('/activate',auth_middleware,ActivateController.activate);
router.get('/refresh',AuthController.refresh);
router.post('/logout',auth_middleware,AuthController.logout);
router.post('/rooms',auth_middleware,RoomController.createRoom);
router.get('/rooms',auth_middleware,RoomController.getAllRooms);


module.exports =router;