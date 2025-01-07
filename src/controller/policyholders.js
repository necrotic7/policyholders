const { Router } = require('express');
const router = Router();
const Policyholders = require('../model/PolicyHolders');
const response = require('../modules/response');

// API 端點：保戶查詢
router.get('/', async (req, res) => {
    try{
        const { code } = req.query;

        if(!code){
            return res.status(400).json({ error: '缺少參數 code' });
        }
        const worker = new Policyholders();
        const result = await worker.getPolicyHolderByCode(code);

        response.succ(res, result);
    } catch(err){
        return response.fail(res, err);
    }
});
    }
});

module.exports = router;