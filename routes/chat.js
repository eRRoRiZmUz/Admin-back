const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')
const chat = require('../controllers/chat.js');

router.post('/api/chat/publicChat', auth.optional, chat.publicChat);
router.post('/api/chat/privateChat', auth.required, chat.privateChat);
router.post('/api/chat/teamChat',auth.required, chat.teamChat);
router.post('/api/chat/getChat',auth.required, chat.getChat);
router.post('/api/chat/getChatPac',auth.required, chat.getChatPac);

module.exports = router;