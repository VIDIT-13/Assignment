import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/leadController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Apply protect middleware to all routes below
router.use(protect);

router.get('/export', authorize('admin', 'sales'), exportLeadsCsv);

router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize('admin'), deleteLead); // Only admin can delete

export default router;
