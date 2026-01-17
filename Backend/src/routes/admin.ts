import { middleware, getAdmin } from "../middleware";
import { courseModel } from "../db";
import { Router } from "express";
export const adminRouter = Router()
import { z } from "zod"


adminRouter.use(middleware)
adminRouter.use(getAdmin)


adminRouter.post("/courses", async (req, res) => {
    const adminId = req.userId

    const required = z.object({
        title: z.string().min(3),
        description: z.string(),
        imageUrl: z.string(),
        price: z.number()
    })

    const parseData = required.safeParse(req.body)
    if (!parseData.success) {
        return res.send("Invalid Credentials")
    }
    const { title, description, imageUrl, price } = req.body

    const already = await courseModel.findOne({ title })
    if (already) {
        return res.send("Course is already exists")
    }

    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        createrId: adminId
    })
    res.json({
        msg: "Course Created successfully",
        courseId: course._id,
    })
})


adminRouter.put("/courses", async (req, res) => {
    const adminId = req.userId;

    const required = z.object({
        title: z.string().min(3),
        description: z.string(),
        imageUrl: z.string(),
        price: z.number(),
        courseID: z.string()
    });

    const parseData = required.safeParse(req.body);
    if (!parseData.success) {
        return res.send("Invalid Credentials");
    }
    const { title, description, imageUrl, price, courseID } = req.body;

    const updatedCourse = await courseModel.findOneAndUpdate(
        {
            _id: courseID,
            createrId: adminId
        },
        {
            title: title,
            description: description,
            imageUrl: imageUrl,
            price: price
        },
        { new: true }
    );

    if (!updatedCourse) {
        return res.send("Course not found or you are not the creator");
    }

    res.json({
        msg: "Course Updated successfully",
        courseId: updatedCourse._id
    });
});

adminRouter.get("/courses", async (req, res) => {
    const adminId = req.userId
    const courses = await courseModel.find({
        createrId: adminId
    })
    res.json({
        courses
    })
})


adminRouter.delete("/courses/:id", async (req, res) => {
    const adminId = req.userId;
    const courseId = req.params.id;
    const course = await courseModel.findOne({
        _id: courseId,
        createrId: adminId
    });
    if (!course) {
        return res.send("Course not found or you are not the creator");
    }
    await courseModel.deleteOne({
        _id: courseId,
        createrId: adminId
    });
    res.send("Course is deleted");
});

