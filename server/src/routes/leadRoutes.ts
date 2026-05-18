import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/leadController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema } from '../validators';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/export/csv', exportLeadsCsv);

router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', validate(createLeadSchema), createLead);
router.put('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', authorize(UserRole.Admin), deleteLead);

export default router;
