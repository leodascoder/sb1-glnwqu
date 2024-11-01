import Appointment from '../models/Appointment.js';
import Agent from '../models/Agent.js';
import { sendAppointmentConfirmation } from '../services/emailService.js';
import { validationResult } from 'express-validator';

export const createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { agentId, date, startTime, endTime, purpose } = req.body;
    const customerId = req.user._id;

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      agentId,
      date,
      startTime,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    const appointment = new Appointment({
      customerId,
      agentId,
      date,
      startTime,
      endTime,
      purpose
    });

    await appointment.save();
    await sendAppointmentConfirmation(req.user.email, appointment);

    res.status(201).json({ 
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error while booking appointment' });
  }
};

export const getCustomerAppointments = async (req, res) => {
  try {
    const customerId = req.user._id;
    const appointments = await Appointment.find({ customerId })
      .populate('agentId')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get customer appointments error:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
};

export const getAgentAppointments = async (req, res) => {
  try {
    const agentId = req.user._id;
    const appointments = await Appointment.find({ agentId })
      .populate('customerId', 'name email')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get agent appointments error:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Appointment status updated successfully', appointment });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error while updating appointment' });
  }
};