import {Schema,model,ObjectId,Types} from "mongoose";


const userSchema=new Schema({
    username:{type:String,required:true,unique:true},
    password:String,
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }
})

const CourseSchema=new Schema({
    title:{type:String,unique:true,required:true},
    description:String,
    imageUrl:String,
    price:Number,
    createrId:Types.ObjectId
})


const purchaseSchema=new Schema({
    userId: Types.ObjectId,
    courseID: {
        type: Types.ObjectId,
        ref: "Courses"
    }
})

export const userModel=model("User",userSchema)
export const courseModel=model("Courses",CourseSchema)
export const purchaseModel=model("Purchases",purchaseSchema)


