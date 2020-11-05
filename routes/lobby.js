const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')
const lobby = require('../admin/lobby');

router.post('/api/lobby/SeeLobbyUsers', auth.optional, lobby.SeeLobbyUsers);
router.post('/api/lobby/KickLobby', auth.optional, lobby.KickLobby);

module.exports = router;