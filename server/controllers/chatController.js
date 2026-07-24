const ChatMessage = require('../models/ChatMessage');

exports.getChats = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    const chats = await ChatMessage.find(query)
      .populate('user', 'name email')
      .sort('-updatedAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await ChatMessage.countDocuments(query);
    res.json({ success: true, chats, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const chats = await ChatMessage.find({ user: req.user.id }).sort('-updatedAt');
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, content, sender } = req.body;
    let chat = await ChatMessage.findOne({ sessionId });
    if (!chat) {
      chat = await ChatMessage.create({
        user: req.user?.id,
        sessionId,
        messages: [{ sender: sender || 'user', content }]
      });
    } else {
      chat.messages.push({ sender: sender || 'user', content });
      await chat.save();
    }
    const io = req.app.get('io');
    if (io) {
      io.to('admin-room').emit('new-message', { sessionId, message: { sender: sender || 'user', content, timestamp: new Date() } });
    }
    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminReply = async (req, res) => {
  try {
    const { sessionId, content } = req.body;
    const chat = await ChatMessage.findOne({ sessionId });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    chat.messages.push({ sender: 'admin', content });
    await chat.save();
    const io = req.app.get('io');
    if (io && chat.user) {
      io.to(`user-${chat.user}`).emit('message-received', { sessionId, message: { sender: 'admin', content, timestamp: new Date() } });
    }
    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.closeChat = async (req, res) => {
  try {
    const chat = await ChatMessage.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    await ChatMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
