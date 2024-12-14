import express from 'express'
import { deleteAssignmentController, getAllAssns, postAssignment } from '../controllers/assignmentControllers.js';

const router=express.Router();

router.route('/').get(getAllAssns)
router.route('/:id').delete(deleteAssignmentController)
router.route('/run').post(postAssignment)

export default router