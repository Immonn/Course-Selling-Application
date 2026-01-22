import { Router } from "express";
export const userRouter=Router()
import { purchaseModel } from "../db";
import { getUser,middleware } from "../middleware";

userRouter.use(middleware)
userRouter.use(getUser)

userRouter.get("/purchases", async (req, res) => {
    const userId = req.userId;
    const purchases = await purchaseModel.find({ userId }).populate("courseID");
    const courses = purchases.map(p => p.courseID);
    res.json({ purchasedCourses: courses });
});

