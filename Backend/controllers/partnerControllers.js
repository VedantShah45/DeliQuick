import { PartnerModel } from "../models/partnerModel.js";
import { runCSVWorker } from "../workers/runWorkers.js";

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
        if(req.body.currentLoad){
            const partner=await PartnerModel.findById(id)
            partner.currentLoad+=req.body.currentLoad;
            partner.save()
            return res.status(201).json({
                success:true,
                partner
            })
        }
        const partner=await PartnerModel.findByIdAndUpdate(id,req.body)        
        return res.status(201).json({
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

export const getDeliveryMetrics=async (req, res) => {
  try {
    // This offloads work to a separate thread
    const filePath = await runCSVWorker();

    res.download(filePath, 'partner_metrics_report.csv', (err) => {
      if (err) {
        console.error('File send error:', err);
        res.status(500).send('Failed to download file.');
      }
    });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).send('Error generating CSV.');
  }
}