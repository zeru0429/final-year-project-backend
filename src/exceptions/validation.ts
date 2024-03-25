import { HttpExecption } from "./root.js";

export class UnprocessableEntity extends HttpExecption {

   constructor(message: string, statusCode: number, errorCode: number, error: any) {
      super(message, 422, errorCode , null);
   }
}