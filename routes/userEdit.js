const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')
const userEdit = require('../admin/userEdit');

router.post('/api/userEdit/sortUser', auth.optional, userEdit.sortUser);
router.post('/api/userEdit/ProfileEdit', auth.optional, userEdit.ProfileEdit);
router.post('/api/userEdit/temporaryPass', auth.optional, userEdit.temporaryPass);
router.post('/api/userEdit/profilePicEdit', auth.optional, userEdit.profilePicEdit);
router.post('/api/userEdit/RegistrationToday', auth.optional, userEdit.RegistrationToday);
router.post('/api/userEdit/bankAccount', auth.optional, userEdit.bankAccount);
router.post('/api/userEdit/sendVerificationCode', auth.optional, userEdit.sendVerificationCode);
router.post('/api/userEdit/RegistrationUser', auth.optional, userEdit.RegistrationUser);

module.exports = router;