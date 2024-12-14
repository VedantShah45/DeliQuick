import { OrderModel } from "../models/orderModel.js";

export const getAllOrders=async(req,res)=>{
    try {
        const orders=await OrderModel.find({})
        res.status(200).json({
            message:"Orders fetched Successfully",
            success:true,
            orders
        })
    } catch (error) {
        console.log(error);       
        res.status(500).json({
            message:"Internal Server Error"
        }) 
    }
}

export const deleteOrder=async(req,res)=>{
    try {
        const id=req.params.id
        const orders=await OrderModel.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            orders
        })
    } catch (error) {
        console.log(error);       
        res.status(500).json({
            message:"Internal Server Error"
        }) 
    }
}

export const assignOrder = async (req, res) => {
    try {
        const {
            orderNumber,
            customer,
            area,
            items,
            status,
            scheduledFor,
            assignedTo,
            createdAt,
            updatedAt,
        } = req.body;

        // Validate required fields
        if (!orderNumber || !customer || !items || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new order
        const newOrder = new OrderModel({
            orderNumber,
            customer,
            area,
            items,
            status,
            scheduledFor,
            assignedTo,
            createdAt: createdAt || new Date(),
            updatedAt: updatedAt || new Date(),
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        // Send success response
        return res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder,
        });
    } catch (error) {
        console.log(error);       
        res.status(500).json({
            message:"Internal Server Error"
        }) 
    }
}

export const updateStatus=async(req,res)=>{
    try {
        const {status}=req.body
        const orderId=req.params.id
        if(!['pending','assigned','picked','delivered'].includes(status))
            return res.status(401).json({
                success:false,
                message:"Invalid Status"
            })
        const order=await OrderModel.findById(orderId)
        order.status=status
        order.save();
        res.status(201).json({
            success:true,
            updatedOrder:order
        })    
    } catch (error) {
        console.log(error);       
        res.status(500).json({
            message:"Internal Server Error"
        }) 
    }
    
}
