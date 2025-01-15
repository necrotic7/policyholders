const express       = require('express');
const router        = express.Router();

router.use('*', (req, res, next)=>{
    const TAG = '[RequestInfo]';
    if(req.method == 'GET'){
        console.log(TAG, `method:${req.method} url:${req.baseUrl} query:`, req.query);
    }else{
        console.log(TAG, `method:${req.method} url:${req.baseUrl} body:`, req.body);
    }
    next();
});

const apiBase = '/api';
const apiPolicyholders = apiBase + '/policyholders';
router.use(apiPolicyholders, require('./policyholders'));

module.exports = router;