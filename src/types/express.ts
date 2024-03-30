import express from 'express'
import {Admins, HealthStationInfos, News, Users, Vaccines} from  '@prisma/client'

declare module 'express'{
   export interface Request {
      admin?: Admins
      user?: Users
      news?: News
      Vaccine?: Vaccines
      registeredBy: Number
      hsInfo?: HealthStationInfos
      userId?: Number
      hsInfoId: Number
      newsId: Number
      vaccineId: Number
      hsId: Number
      mId: Number
      childId: Number
      cvId: Number
      mvId: Number
      chatId: Number
      files: any
   }
}
