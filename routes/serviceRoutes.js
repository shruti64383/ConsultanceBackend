const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const ServiceRequest = require('../models/ServiceRequest'); // We'll create this model next


router.post('/request', verifyToken, async (req, res) => {
  const { serviceName } = req.body;
  const userId = req.user.id;

  try {
    const newService = new ServiceRequest({ userId, serviceName });
    await newService.save();
    res.status(201).json({ message: 'Service requested', service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Service request failed' });
  }
});

router.get('/my', verifyToken, async (req, res) => {
  try {
    const services = await ServiceRequest.find({ userId: req.user.id });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

router.patch('/:id/approve', verifyToken, async (req, res) => {
  try {
    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Approval failed' });
  }
});


module.exports = router;
