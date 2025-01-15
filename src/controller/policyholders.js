const { Router } = require('express');
const router = Router();
const PolicyholdersService = require('../service/PolicyHolders');
const PolicyholdersRepository = require('../repository/PolicyHolders');
const response = require('../modules/response');
const exception = require('../modules/exception');
const database = require('../modules/database');

// API 端點：保戶查詢
router.get('/', async (req, res) => {
    try{
        const { code } = req.query;

        if(!code){
            throw exception.BadRequest('BAD_REQUEST', 'invalid parameters');
        }
        const repository = new PolicyholdersRepository(database);
        const worker = new PolicyholdersService(exception, repository);
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
        const repository = new PolicyholdersRepository(database);
        const worker = new PolicyholdersService(exception, repository);
        const result = await worker.getPolicyHolderTopByCode(code);

        response.succ(res, result);
    } catch(err){
        return response.fail(res, err);
    }
});

module.exports = router;