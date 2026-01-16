import { Router } from "express";
const authRoute=Router()
import {email, hash, z} from "zod";
import { JWT_User } from "../config";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
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
    
})