const express = require('express');
const router = express.Router();    
const { register, login, lead, mine} = require('../controllers/authControllers');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');
// const authMiddleware = require('../middleware/authMiddleware')

router.get('/dashboard', verifyToken, restrictTo('admin'), (req, res) => {
  res.json({
    message: 'Welcome to the Admin Dashboard',
    user: req.user,
  });
});
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});


router.post('/register', register);
router.post('/login', login);
router.post('/lead', lead);
router.get('/mine', mine);

module.exports = router;