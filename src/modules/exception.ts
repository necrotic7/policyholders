import { StatusCodes } from 'http-status-codes';
import { 
    WebError as iWebError,
    _BadRequest as iBadRequest,
    _ServerError as iServerError
 } from 'workspace-model/exception';
class WebError extends Error implements iWebError{
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

class _BadRequest extends WebError implements iBadRequest{
    constructor(code: string, message: string){
        super(StatusCodes.BAD_REQUEST, code, message);
    }
}

class _ServerError extends WebError implements iServerError{
    constructor(code: string, message: string) {
        super(StatusCodes.INTERNAL_SERVER_ERROR, code, message); // 500
    }
}

export default {
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
