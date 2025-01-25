import { StatusCodes } from 'http-status-codes';

class WebError extends Error{
    constructor(statusCode, code, message){
        super(message)
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
    }
}

class _BadRequest extends WebError{
    constructor(code, message){
        super(StatusCodes.BAD_REQUEST, code, message);
    }
}

class _ServerError extends WebError {
    constructor(code, message, data) {
        super(StatusCodes.INTERNAL_SERVER_ERROR, code, message, data); // 500
    }
}

export default {
    isWebError: (err) => {
        return err instanceof WebError;
    },

    BadRequest: (code, message) => {
        return new _BadRequest(code, message);
    },

    ServerError: (code, message) => {
        return new _ServerError(code, message);
    }
};
