const router = require('express').Router();
const { getStats } = require('../controllers/analyticsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, requireAdmin, getStats);

module.exports = router;
