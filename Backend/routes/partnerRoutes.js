import express from 'express'
import { createPartner, deletePartner, editPartner, getAllPartners } from '../controllers/partnerControllers.js';
const router=express.Router();

router.route('/')
.post(createPartner)
.get(getAllPartners)

router.route('/:id')
.delete(deletePartner)
.patch(editPartner)

export default router

