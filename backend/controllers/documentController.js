const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const runPython = require('../utils/runPython');

async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'A document file is required' });
    }

    const title = String(req.body.title || '').trim();
    if (!title) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, message: 'Document title is required' });
    }

    const filePath = path.resolve(req.file.path).replace(/\\/g, '/');
    const result = await runPython('process_pdf.py', [filePath, title]);

    const document = await Document.create({
      title,
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedBy: req.user.id,
      pageCount: result.pages || 0,
      chunkCount: result.chunks || 0
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    next(error);
  }
}

async function getAllDocuments(_req, res, next) {
  try {
    const documents = await Document.find()
      .populate('uploadedBy', 'name')
      .sort({ uploadedAt: -1 });

    res.json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
}

async function deleteDocument(req, res, next) {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    await runPython('chat.py', ['--delete', document.filename]);

    const filePath = path.join(__dirname, '..', 'uploads', document.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await document.deleteOne();
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadDocument, getAllDocuments, deleteDocument };
