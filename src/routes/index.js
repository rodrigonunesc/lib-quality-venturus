const express = require('express');

const router = express.Router();

const metricRoutes = require('./git-metric');

router.get('/online', (req, res) => res.json({ message: 'Online!' }));
router.use('/git-metric', metricRoutes(express));

module.exports = router;
