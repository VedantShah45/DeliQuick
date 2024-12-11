import express from 'express'
import { assignOrder, getAllOrders, updateStatus } from '../controllers/orderControllers.js'

const router=express.Router()

router.route('/').get(getAllOrders)

router.route('/assign').post(assignOrder)

router.route('/:id/status').patch(updateStatus)

export default router