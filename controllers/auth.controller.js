import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

// what is req body = req.body is an object containing data from client (POST req)

//atomic operation = all or nothing -> ro darim anjam midim yani age moghe user auth nesfe info vared data base shod va nesfe dg be error khord hich chizi vared data base nmishe va onaei ham ke vared shodan pak mishan age intori nashe ba error haye ziadi robero mishim vali moghei ke hichi vared nashe ye error miad baramon va motevajeh mishim ye jaye kar milange

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // login to create a new user
    const { name, email, password } = req.body;

    //check if a user already exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exist");
      error.statusCode = 409;
      throw error;
    }

    //hash the password = securing password cuz never wanna save pw in plain text
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [{ name, email, password: hashedpassword }],
      { session }
    );
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user) {
            const error = new Error('user doesnt exist');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            const error = new Error('invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,});

        res.status(200).json({
        success: true,
        message: "user signed in successfully",
        data: {
        token,
        user,
      },
    });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {};
