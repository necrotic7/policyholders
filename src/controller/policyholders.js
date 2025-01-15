const { Router } = require('express');
const router = Router();
const PolicyholdersService = require('workspace-service/PolicyHolders');
const PolicyholdersRepository = require('workspace-repository/PolicyHolders');
const response = require('workspace-modules/response');
const exception = require('workspace-modules/exception');
const database = require('workspace-modules/database');
const Joi = require('joi');
// API 端點：保戶查詢
router.get('/', async (req, res) => {
    try{
        const schema = Joi.object({
            code: Joi.number().required()
        })

        const { error } = schema.validate(req.query, {allowUnknown:true});
        if(error){
            throw exception.BadRequest('BAD_REQUEST', error.message);
        }
        const repository = new PolicyholdersRepository(database, exception);
        const worker = new PolicyholdersService(repository);
        const result = await worker.getPolicyHolderByCode(code);

        response.succ(res, result);
    } catch(err){
        return response.fail(res, err);
    }
});

// API 端點：保戶上層查詢
router.get('/:code/top', async (req, res) => {
    try{
        const schema = Joi.object({
            code: Joi.number().required()
        })

        const { error } = schema.validate(req.params, {allowUnknown:true});
        if(error){
            throw exception.BadRequest('BAD_REQUEST', error.message);
        }
        const repository = new PolicyholdersRepository(database, exception);
        const worker = new PolicyholdersService(repository);
        const result = await worker.getPolicyHolderTopByCode(code);

        response.succ(res, result);
    } catch(err){
        return response.fail(res, err);
    }
});

module.exports = router;