const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')
const team = require('../controllers/team.js');

router.post('/api/team/register', auth.optional, team.register);
router.post('/api/team/send', auth.required, team.send);
router.post('/api/team/cancel',auth.required, team.cancel);
router.post('/api/team/accept',auth.required, team.accept);
router.post('/api/team/removeMember',auth.required, team.removeMember);
router.post('/api/team/selectCaptain',auth.required, team.selectCaptain);
router.post('/api/team/uploadProfilePic',auth.required, team.uploadProfilePic);

module.exports = router;