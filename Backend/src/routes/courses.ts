import { courseModel,purchaseModel } from "../db";
import { Router } from "express";
export const courseRouter=Router()
import { middleware,getUser } from "../middleware";

courseRouter.get("/preview",async (req,res)=>{
    const courses=await courseModel.find({})
    res.json({
        courses
    })
})

courseRouter.post("/purchase", middleware, getUser, async (req, res) => {
    const userId = req.userId;
    const { courseId } = req.body;
    if (!courseId) {
        return res.status(400).json({ msg: "CourseId is required" });
    }
    
    const course = await courseModel.findById(courseId);
    if (!course) {
        return res.status(404).json({ msg: "Course not found" });
    }
    
    const alreadyPurchased = await purchaseModel.findOne({ userId, courseID: courseId });
    if (alreadyPurchased) {
        return res.status(409).json({ msg: "Course already purchased" });
    }
 
    await purchaseModel.create({ userId, courseID: courseId });
    res.json({ msg: "Course purchased successfully" });
});