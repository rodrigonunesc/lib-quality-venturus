const express = require('express');

const router = express.Router();

const metricRoutes = require('./metric');

router.get('/online', (req, res) => res.json({ message: 'Online!' }));

router.use('/metric', metricRoutes(express));

module.exports = router;
