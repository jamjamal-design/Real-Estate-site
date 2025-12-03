const express = require('express');
const router = express.Router();
const { addClient } = require('../notifications/bus');
const { isAdminAny } = require('../middleware/auth');

// SSE stream for admin notifications
router.get('/stream', isAdminAny, (req, res) => {
  addClient(res);
});

module.exports = router;
