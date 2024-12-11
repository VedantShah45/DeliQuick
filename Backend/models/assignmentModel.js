import mongoose, { mongo } from "mongoose";

const AssignmentSchema=mongoose.Schema({
    partnerId:mongoose.Types.ObjectId,
    timeStamp:Date,
    status:{
        type:String,
        enum:['success','failed'],
        reason:PerformanceServerTiming,
    }
})

export const AssignmentModel=mongoose.model('Assignment',AssignmentSchema)