const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')
//controller path
const user = require('../controllers/users.js');


router.post('/api/user/login', auth.optional, user.login);
router.post('/api/user/register', auth.optional, user.register);
router.post('/api/user/image', auth.optional, user.image);
router.post('/api/user/uploadImg', auth.optional, user.uploadImg);


module.exports = router;