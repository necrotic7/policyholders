import { Router } from 'express';
const router = Router();

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
import policyHolders from './policyholders';
router.use(apiPolicyholders, policyHolders);

export default router;