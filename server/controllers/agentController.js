import Agent from '../models/Agent.js';
import Appointment from '../models/Appointment.js';
import { validationResult } from 'express-validator';

export const updateAvailability = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { availability } = req.body;
    const agentId = req.user._id;

    let agent = await Agent.findOne({ userId: agentId });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    agent.availability = availability;
    await agent.save();

    res.json({ message: 'Availability updated successfully', availability: agent.availability });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error while updating availability' });
  }
};

export const getAgentAvailability = async (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = await Agent.findById(agentId).populate('userId', 'name');

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const appointments = await Appointment.find({
      agentId,
      status: { $ne: 'cancelled' },
      date: {
        $gte: new Date().setHours(0, 0, 0, 0)
      }
    });

    const availabilityWithBookings = agent.availability.map(day => ({
      ...day.toObject(),
      slots: day.slots.map(slot => ({
        ...slot.toObject(),
        isBooked: appointments.some(apt => 
          apt.startTime === slot.startTime && 
          apt.date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
        )
      }))
    }));

    res.json({
      agentName: agent.userId.name,
      availability: availabilityWithBookings
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error while fetching availability' });
  }
};

export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find()
      .populate('userId', 'name')
      .select('specialization experience rating totalReviews');

    res.json(agents);
  } catch (error) {
    console.error('Get all agents error:', error);
    res.status(500).json({ message: 'Server error while fetching agents' });
  }
};