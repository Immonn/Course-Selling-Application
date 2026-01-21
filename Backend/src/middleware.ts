import jwt from "jsonwebtoken"
import { JWT_User } from "./config"
import { Request,Response,NextFunction } from "express"
export function middleware(req:Request,res:Response,next:NextFunction){
    const token:any=req.headers.token
    if (!JWT_User){
        return res.send("Provide JWT")
    }
    if (!token){
        return res.send("Token not found")
    }
    const decode=jwt.verify(token,JWT_User)
    if (!decode){
        return res.send("Invalid token")
    }
    if (decode){
        //@ts-ignore
        req.userId=decode.id
        //@ts-ignore
        req.role=decode.role
        next()
    }else{
        res.send("Please Signed in")
    }

}
export function getAdmin(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if (req.role !== "admin") {
        return res.status(402).send("Access denied: Admins only");
    }
    next();
}

export function getUser(req: Request, res: Response, next: NextFunction){
    if (req.role!=="user"){
        return res.status(402).send("Access denied: Users only");
    }
    next();
}