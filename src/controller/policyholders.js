const { Router } = require('express');
const router = Router();
const Policyholders = require('../model/PolicyHolders');
const response = require('../modules/response');
const exception = require('../modules/exception');

// API 端點：保戶查詢
router.get('/', async (req, res) => {
    try{
        const { code } = req.query;

        if(!code){
            throw exception.BadRequest('BAD_REQUEST', 'invalid parameters');
        }
        const worker = new Policyholders();
        const result = await worker.getPolicyHolderByCode(code);

        response.succ(res, result);
    } catch(err){
        return response.fail(res, err);
    }
});

// API 端點：保戶上層查詢
router.get('/:code/top', async (req, res) => {
    try{
        const { code } = req.params;

        if(!code){
            throw exception.BadRequest('BAD_REQUEST', 'invalid parameters');
        }
        const worker = new Policyholders();
        const result = await worker.getPolicyHolderTopByCode(code);

        response.succ(res, result);
    } catch(err){
        return response.fail(res, err);
    }
});

module.exports = router;