import SupportTicket from '../models/SupportTicket.js';

export const getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({});
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.create(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (ticket) {
      ticket.messages.push(req.body);
      await ticket.save();
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resolveTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (ticket) {
      ticket.status = 'Resolved';
      ticket.resolvedAt = Date.now();
      await ticket.save();
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
