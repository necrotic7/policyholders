import { StatusCodes } from 'http-status-codes';
import { 
    Exception as tException,
    WebError as tWebError,
    _BadRequest as tBadRequest,
    _ServerError as tServerError
 } from 'workspace-model/exception';
class WebError extends Error implements tWebError{
    statusCode: number;
    code: string;
    message: string;
    constructor(statusCode: number, code: string, message: string){
        super(message)
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
    }
}

class _BadRequest extends WebError implements tBadRequest{
    constructor(code: string, message: string){
        super(StatusCodes.BAD_REQUEST, code, message);
    }
}

class _ServerError extends WebError implements tServerError{
    constructor(code: string, message: string) {
        super(StatusCodes.INTERNAL_SERVER_ERROR, code, message); // 500
    }
}

export const Exception: tException = {
    isWebError(err: unknown): err is WebError{
        return err instanceof WebError;
    },

    BadRequest(code: string, message: string){
        return new _BadRequest(code, message);
    },

    ServerError(code: string, message: string){
        return new _ServerError(code, message);
    }
};
