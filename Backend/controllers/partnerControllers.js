import { PartnerModel } from "../models/partnerModel.js";

export const getAllPartners=async(req,res)=>{
    try {
        const partners=await PartnerModel.find({})
        res.status(200).json({
            success:true,
            partners
        })
    } catch (error) {
        console.log(error);        
    }
}

export const createPartner=async(req,res)=>{
    try {
        const newPartner=req.body
        const partner=await PartnerModel.create(newPartner)
        res.status(201).json({
            success:true,
            partner
        })
    } catch (error) {
        console.log(error);        
    }
}

export const editPartner=async(req,res)=>{
    try {
        const id=req.params.id
        const partner=await PartnerModel.findByIdAndUpdate(id,req.body,{new:true})
        res.status(201).json({
            success:true,
            partner
        })
    } catch (error) {
        console.log(error);        
    }
}

export const deletePartner=async(req,res)=>{
    try {
        const id=req.params.id
        const partner=await PartnerModel.findByIdAndDelete(id,{new:true})
        res.status(201).json({
            success:true,
            partner
        })
    } catch (error) {
        console.log(error);        
    }
}


