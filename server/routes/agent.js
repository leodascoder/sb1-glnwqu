import express from 'express';
import { 
  updateAvailability, 
  getAgentAvailability,
  getAllAgents 
} from '../controllers/agentController.js';
import { authenticate, authorizeAgent } from '../middleware/auth.js';
import { validateAvailability } from '../middleware/validation.js';

const router = express.Router();

router.put('/availability', authenticate, authorizeAgent, validateAvailability, updateAvailability);
router.get('/availability/:agentId', authenticate, getAgentAvailability);
router.get('/', authenticate, getAllAgents);

export default router;