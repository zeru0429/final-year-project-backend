//messages, status, error code, error
export class HttpExecption extends Error{
   message: string;
   statusCode: number;
   errorCode: ErrorCode;
   error: any

   constructor (message: string, statusCode: number, errorCode: ErrorCode, error: any) {
       super(message);
       this.message = message
       this.statusCode = statusCode
       this.errorCode = errorCode
       this.error = error
   }
   
}

export enum ErrorCode {
   USER_NOT_FOUND=1001,
   USER_ALLREDY_EXIST=1002,
   INCORRECT_PASSWORD =1003,

   INTERNAL_EXCEPTION=500,
   UNPROCESSABLE = 422,
   TOKEN_NOT_FOUND = 404


}