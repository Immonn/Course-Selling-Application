import jwt from "jsonwebtoken";
import { JWT_User } from "./config";
import { Request, Response, NextFunction } from "express";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send("Token not provided");
    }
    if (!JWT_User) {
        return res.status(500).send("JWT secret not configured");
    }
    try {
        const decode = jwt.verify(token, JWT_User) as { id: string, role: string };
        // @ts-ignore
        req.userId = decode.id;
        // @ts-ignore
        req.role = decode.role;
        next();
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
}