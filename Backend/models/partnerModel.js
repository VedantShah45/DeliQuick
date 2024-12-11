import mongoose from 'mongoose'

const PartnerSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    status:{
        type:String,
        enum:['active','inactive'],
    },
    currentLoad:Number,
    areas:[String],
    shift:{
        type:{
            start:String,
            end:String
        }
    },
    metrixs:{
        type:{
            rating:Number,
            completedOrders:Number,
            cancelledOrders:Number,
        }
    }
})

export const PartnerModel=mongoose.model('Partner',PartnerSchema)