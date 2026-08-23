const User = require('../models/User');
const Document = require('../models/Document');
const ChatHistory = require('../models/ChatHistory');

async function getStats(_req, res, next) {
  try {
    const [totalUsers, totalDocuments, totalQuestions, topQuestions, topDocuments] = await Promise.all([
      User.countDocuments(),
      Document.countDocuments(),
      ChatHistory.countDocuments(),
      ChatHistory.aggregate([
        { $group: { _id: '$question', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, question: '$_id', count: 1 } }
      ]),
      ChatHistory.aggregate([
        { $unwind: '$sources' },
        { $group: { _id: '$sources.filename', title: { $first: '$sources.documentTitle' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, filename: '$_id', title: 1, count: 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDocuments,
        totalQuestions,
        mostActiveDocument: topDocuments[0] || null,
        topQuestions,
        topDocuments
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats };
