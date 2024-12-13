import express from 'express'
import { getAllAssns, postAssignment } from '../controllers/assignmentControllers.js';

const router=express.Router();

router.route('/').get(getAllAssns)
router.route('/run').post(postAssignment)

export default router