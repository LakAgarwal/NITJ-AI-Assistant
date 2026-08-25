const router = require('express').Router();
const { ask, getHistory } = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, ask);
router.get('/history', authenticate, getHistory);

module.exports = router;
