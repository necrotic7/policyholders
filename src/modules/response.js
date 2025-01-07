'use strict';
const httpStatus = require('http-status-codes');
const exception  = require('./exception');

function succ(resp, data) {
    if (data) {
        resp.status(httpStatus.StatusCodes.OK).json(data);
    } else {
        resp.status(httpStatus.StatusCodes.OK).json();
    }
}

function fail(resp, err) {
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


module.exports.succ = succ;
module.exports.fail = fail;