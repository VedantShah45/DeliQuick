import mongoose, { Mongoose } from 'mongoose'

const OrderSchema=mongoose.Schema({
    OrderNumber:String,
    customer:{
        type:{
            name:String,
            phone:String,
            address:String,
        }
    },
    area:String,
    items:{
        type:[{
            name:String,
            quantity:Number,
            price:Number,
        }]
    },
    status:{
        type:String,
        enum:['pending','assigned','picked','delivered']
    },
    scheduledFor:String,
    assignedTo:mongoose.Types.ObjectId,
    createdAt:Date,
    updatedAt:Date
})

export const OrderModel=mongoose.model('Order',OrderSchema)