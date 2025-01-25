import { StatusCodes } from 'http-status-codes';
import exception from 'workspace-modules/exception.js';

function _succ(resp, data) {
    if (data) {
        resp.status(StatusCodes.OK).json(data);
    } else {
        resp.status(StatusCodes.OK).json();
    }
}

function _fail(resp, err) {
    /**
    * Double check err instance
    */
    if (!exception.isWebError(err)) {
        if (err instanceof Error) {
            err = exception.ServerError('INTERNAL_SERVER_ERROR', err.message);
        } else if (typeof err === 'string') {
            err = exception.ServerError('INTERNAL_SERVER_ERROR', err);
        } else {
            err = exception.ServerError('INTERNAL_SERVER_ERROR', 'unknown error');
        }
    }

    const error = {
        code: err.code,
        message: err.message
    };

    resp.status(err.statusCode).json(error);
}


export const succ = _succ;
export const fail = _fail;