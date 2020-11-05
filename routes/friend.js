const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')

//controller path
const friend = require('../controllers/friend.js');

router.post('/api/friend/send', auth.required, friend.send);
router.post('/api/friend/cancel',auth.required, friend.cancel);
router.post('/api/friend/accept',auth.required, friend.accept);

module.exports = router;