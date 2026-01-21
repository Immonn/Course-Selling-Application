import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {authRoute} from "./routes/auth"
import { adminRouter } from "./routes/admin";
import { userRouter } from "./routes/user";
import { courseRouter } from "./routes/courses";
import mongoose from "mongoose";

const app = express();
app.use(express.json())

app.use("/auth",authRoute)
app.use("/admin",adminRouter)
app.use("/user",userRouter)
app.use("/course",courseRouter)


async function main() {
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000, () => { console.log("Your app is running"); });
}

main();