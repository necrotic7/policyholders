
export interface WebError {
    statusCode: number;
    code: string;
    message: string;
}

export interface _BadRequest {}

export interface _ServerError {}


export interface Exception {
    isWebError(err: unknown): err is WebError
    BadRequest(code: string, message: string) : _BadRequest
    ServerError(code: string, message: string): _ServerError
};
