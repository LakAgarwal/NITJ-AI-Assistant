const ChatHistory = require('../models/ChatHistory');
const runPython = require('../utils/runPython');

async function ask(req, res, next) {
  try {
    const question = String(req.body.question || '').trim();

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const result = await runPython('chat.py', [question, req.user.id]);
    const history = await ChatHistory.create({
      userId: req.user.id,
      question,
      answer: result.answer,
      sources: result.sources || []
    });

    res.json({
      success: true,
      data: {
        id: history._id.toString(),
        question,
        answer: history.answer,
        sources: history.sources,
        timestamp: history.timestamp
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const messages = await ChatHistory.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    next(error);
  }
}

module.exports = { ask, getHistory };
