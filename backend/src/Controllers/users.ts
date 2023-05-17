import {RequestHandler} from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req,res,next)=>{
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email ||!passwordRaw){
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({username: username}).exec();

        if(existingUsername){
            throw createHttpError(409, "Username already taken, please choose a different one");
        }

        const existingEmail = await UserModel.findOne({email: email}).exec();
        if(existingEmail){
            throw createHttpError(409, "Already email exist, please log in");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create(
            {
                username: username,
                password: passwordHashed,
            }
        );
        req.session.userId = newUser._id;
        


        res.status(201).json(newUser);
    }catch(error){
        next(error);

    }
}