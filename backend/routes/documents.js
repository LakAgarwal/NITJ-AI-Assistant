const router = require('express').Router();
const { uploadDocument, getAllDocuments, deleteDocument } = require('../controllers/documentController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', authenticate, getAllDocuments);
router.post('/upload', authenticate, requireAdmin, upload.single('file'), uploadDocument);
router.delete('/:id', authenticate, requireAdmin, deleteDocument);

module.exports = router;
