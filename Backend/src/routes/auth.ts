import { Router } from "express";
export const authRoute=Router()
import { z} from "zod";
import { JWT_User } from "../config";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userModel } from "../db";

authRoute.post("/up",async (req,res)=>{
    const required=z.object({
        username:z.string().min(3),
        password:z.string(),
        role:z.enum(["admin","user"])
    })
    const parseData=required.safeParse(req.body)
    if (!parseData.success){
        return res.send("Invalid Credentials")
    }
    const {username,password,role}=req.body;
    const user=await userModel.findOne({
        username 
    })
    if(user){
        return res.send("User is already exits")
    }
    const hashpassword=await bcrypt.hash(password,5)
    await userModel.create({
        username:username,
        password:hashpassword,
        role:role 
    })
    res.send("Signed up")
})

authRoute.post("/in",async (req,res)=>{
   const required=z.object({
        username:z.string().min(3),
        password:z.string(),
        role:z.enum(["admin","user"])
    })
    const parseData=required.safeParse(req.body)
    if (!parseData.success){
        return res.send("Invalid Credentials")
    }
    const {username,password,role}=req.body;

    const user=await userModel.findOne({
        username 
    })
    if (!user){
        return res.send("User doent exists pls")
    }
    if (typeof user.password !== "string") {
        return res.send("Password not set for this user");
    }
    const comaparepassword=await bcrypt.compare(password,user.password)
    if (!comaparepassword){
        return res.send("Incorrect password")
    }
    if (!JWT_User){
        return res.send("Cant find JWT")
    }
    const token=jwt.sign({
        id:user?._id,
        role:user?.role
    },JWT_User)
    res.json({
        token
    })
})

