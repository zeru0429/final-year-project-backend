import express from 'express'
import {Admins, News, Users, Vaccines} from  '@prisma/client'

declare module 'express'{
   export interface Request {
      admin?: Admins
   }
}
declare module 'express'{
   export interface Request {
      user?: Users
      registeredBy: Number
   }
}

declare module 'express'{
   export interface Request {
      news?: News
      newsId: Number
   }
}
declare module 'express'{
   export interface Request {
      Vaccine?: Vaccines
      vaccineId: Number
   }
}