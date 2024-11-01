import express from 'express';
import {
  createAppointment,
  getCustomerAppointments,
  getAgentAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { authenticate, authorizeAgent } from '../middleware/auth.js';
import { validateAppointment } from '../middleware/validation.js';

const router = express.Router();

router.post('/', authenticate, validateAppointment, createAppointment);
router.get('/customer', authenticate, getCustomerAppointments);
router.get('/agent', authenticate, authorizeAgent, getAgentAppointments);
router.patch('/:appointmentId/status', authenticate, authorizeAgent, updateAppointmentStatus);

export default router;