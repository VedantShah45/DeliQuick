import express from 'express'
import { createPartner, deletePartner, editPartner, getAllPartners, getDeliveryMetrics } from '../controllers/partnerControllers.js';
const router=express.Router();

router.route('/')
.post(createPartner)
.get(getAllPartners)

router.route('/metrics')
.get(getDeliveryMetrics)

router.route('/:id')
.delete(deletePartner)
.patch(editPartner)

export default router

