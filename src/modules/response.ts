import { WebError as tWebError } from 'workspace-model/exception';
import { StatusCodes } from 'http-status-codes';
import exception from 'workspace-modules/exception.js';
function _succ(resp: any, data: object) {
    if (data) {
        resp.status(StatusCodes.OK).json(data);
    } else {
        resp.status(StatusCodes.OK).json();
    }
}

function _fail(resp: any, err: unknown) {
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

    const e = err as tWebError

    const error = {
        code: e.code,
        message: e.message
    };

    resp.status(e.statusCode).json(error);
}


export const succ = _succ;
export const fail = _fail;