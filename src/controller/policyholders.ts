import { Router } from 'express';
const router = Router();
import PolicyholdersService from 'workspace-service/PolicyHolders.js';
import PolicyholdersRepository from 'workspace-repository/PolicyHolders.js';
import { succ, fail } from 'workspace-modules/response.js';
import { Exception as exception } from 'workspace-modules/exception.js';
import database from 'workspace-modules/database.js';
import Joi from 'joi';
// API 端點：保戶查詢
router.get('/', async (req, res) => {
    try{
        const schema = Joi.object({
            code: Joi.number().required()
        })

        const { error, value } = schema.validate(req.query, {allowUnknown:true});
        if(error){
            throw exception.BadRequest('BAD_REQUEST', error.message);
        }
        const repository = new PolicyholdersRepository(database, exception);
        const worker = new PolicyholdersService(repository);
        const { code } = value;
        const result = await worker.getPolicyHolderByCode(code);

        succ(res, result);
    } catch(err){
        return fail(res, err);
    }
});

// API 端點：保戶上層查詢
router.get('/:code/top', async (req, res) => {
    try{
        const schema = Joi.object({
            code: Joi.number().required()
        })

        const { error, value } = schema.validate(req.params, {allowUnknown:true});
        if(error){
            throw exception.BadRequest('BAD_REQUEST', error.message);
        }
        const repository = new PolicyholdersRepository(database, exception);
        const worker = new PolicyholdersService(repository);
        const { code } = value;
        const result = await worker.getPolicyHolderTopByCode(code);

        succ(res, result);
    } catch(err){
        return fail(res, err);
    }
});

export default router;