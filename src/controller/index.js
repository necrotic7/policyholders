const express       = require('express');
const router        = express.Router();

const apiBase = '/api';
const apiPolicyholders = apiBase + '/policyholders';
router.use(apiPolicyholders, require('./policyholders'))

module.exports = router;