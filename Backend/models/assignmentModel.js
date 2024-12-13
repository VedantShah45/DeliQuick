import mongoose, { mongo } from "mongoose";

const AssignmentSchema=mongoose.Schema({
    orderId:mongoose.Types.ObjectId,
    partnerId:mongoose.Types.ObjectId,
    timeStamp:Date,
    status:{
        type:String,
        enum:['success','failed'],
    },
    reason:String,
})

export const AssignmentModel=mongoose.model('Assignment',AssignmentSchema)