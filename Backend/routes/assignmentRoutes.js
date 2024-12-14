import express from 'express'
import { deleteAssignmentController, getAllAssns, postAssignment, updateAssignmentStatusController } from '../controllers/assignmentControllers.js';

const router=express.Router();

router.route('/').get(getAllAssns)
router.route('/:id').delete(deleteAssignmentController).patch(updateAssignmentStatusController)
router.route('/run').post(postAssignment)

export default router