import { HttpExecption } from "./root.js";

export class BadRequest extends HttpExecption {

   constructor(message: string, statusCode: number, errorCode: number, error: any) {
      super(message, 400, errorCode , null);
   }
}