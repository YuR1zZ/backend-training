import { Router } from "express";
import  authorize  from "../middlewares/auth.middleware.js";
import { getUser, getUsers } from "../controllers/user.controller.js";


const userRouter = Router();

userRouter.get('/', getUsers)

// ba vojode authorize be onvane middleware dg har kasi nmitone be user detail dastresi dashte bashe
// alan dg http://localhost:5500/api/v1/users/683c7199a2c7feb6e15c6523 kar nmikone bayad hatman login shim ke detailemon ro behemon neshon bede
// POST http://localhost:5500/api/v1/auth/sign-in bad az inke sign in kardim mitonim detailemon ro bbinim 
//hala age bekhaym ba Bearer detailemon ro bbinim => aval login mikonim id va bearer tokenemon ro copy mikonim  =>.  GET http://localhost:5500/api/v1/users/683c7199a2c7feb6e15c6523 bad baghale body authorization ro entekham konim va Bearer token ro bezanim bearer tokeni ke copy kardim ro vared konim va get ro bezanim

userRouter.get('/:id', authorize, getUser)

userRouter.post('/', (req,res)=>res.send({title:'Create new user'}))

userRouter.put('/:id', (req,res)=>res.send({title:'UPDATE user'}))

userRouter.delete('/:id', (req,res)=>res.send({title:'DELETE a user'}))

export default userRouter;