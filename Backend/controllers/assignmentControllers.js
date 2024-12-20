import { AssignmentModel } from "../models/assignmentModel.js";

export const getAllAssns=async(req,res)=>{
    try {
        const assignments=await AssignmentModel.find({})
        res.status(200).json({
            assignments
        })
    } catch (error) {
        console.log(error);   
        res.status(500)     
    }
}

export const deleteAssignmentController=async(req,res)=>{
    try {
        const id=req.params.id
        const assignments=await AssignmentModel.findByIdAndDelete(id)
        res.status(200).json({
            assignments
        })
    } catch (error) {
        console.log(error);   
        res.status(500)     
    }
}
export const updateAssignmentStatusController=async(req,res)=>{
    try {
        const id=req.params.id
        const assignments=await AssignmentModel.findByIdAndUpdate(id,{status:req.body.status})
        res.status(200).json({
            assignments
        })
    } catch (error) {
        console.log(error);   
        res.status(500)     
    }
}

export const postAssignment=async(req,res)=>{
    try {
        const {orderId,partnerId}=req.body;
        console.log(orderId+" "+partnerId);
        
        if(!orderId || !partnerId ){
            return res.status(400).json({
                message:"Send all attributes"
            })
        }       
        const newAssignment=await AssignmentModel.create({...req.body,timeStamp:Date.now()})
        res.status(201).json(newAssignment)
    } catch (error) {
        console.log(error);        
    }
}