const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')
const teamEdit = require('../admin/teamEdit');

router.post('/api/teamEdit/editField', auth.optional, teamEdit.editField);
router.post('/api/teamEdit/getTeam', auth.optional, teamEdit.getTeam);
router.post('/api/teamEdit/getTeamField', auth.optional, teamEdit.getTeamField);
router.post('/api/teamEdit/addTeamMember', auth.optional, teamEdit.addTeamMember);
router.post('/api/teamEdit/deleteTeamMember', auth.optional, teamEdit.deleteTeamMember);

module.exports = router;