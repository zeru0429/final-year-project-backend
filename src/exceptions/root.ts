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
   TOKEN_NOT_FOUND = 404,

   NEWS_NOT_FOUND =3001,

   VACCINE_ALLREDY_EXIST =5001,
   VACCINE_NOT_FOUND =5003,

   HS_NOT_FOUND =6004,
   INCORRECT_OLD_PASSWORD = 7001,
   CHILD_NOT_FOUND = 8004,
   CHILD_VACCINE_NOT_FOUND=9004,
   CONTENT_AND_ATTACHMENTS_REQUIRED= 7004,
   CHAT_NOT_FOUND = 10004,
   CHILD_HAVE_CERTIFICATE_BEFORE= 80007,
   CERTIFICATE_NOT_FOUND= 76009,
   MOTHER_NOT_FOUND=5004,
   APPOINTMENT_NOT_FOUND =6004,
   CHILD_NOT_VACCINE_COMPLETED=8900
}