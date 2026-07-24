const Ticket = require('../models/Ticket');
const crypto = require('crypto');

exports.getTickets = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    const tickets = await Ticket.find(query)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Ticket.countDocuments(query);
    res.json({ success: true, tickets, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticketId = 'TKT-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const ticket = await Ticket.create({ ...req.body, ticketId, user: req.user.id });
    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    ticket.messages.push({ sender: req.user.id, content: req.body.content });
    await ticket.save();
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
