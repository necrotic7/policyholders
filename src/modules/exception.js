const httpStatus  = require('http-status-codes');

class WebError extends Error{
    constructor(statusCode, code, message){
        super(message)
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
    }
}

class BadRequest extends WebError{
    constructor(code, message){
        super(httpStatus.StatusCodes.BAD_REQUEST, code, message);
    }
}

class ServerError extends WebError {
    constructor(code, message, data) {
        super(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, code, message, data); // 500
    }
}

module.exports = {
    isWebError: (err) => {
        return err instanceof WebError;
    },
    BadRequest: (code, message) => {
        return new BadRequest(code, message);
    },
    ServerError: (code, message) => {
        return new ServerError(code, message);
    }
};