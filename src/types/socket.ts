import { Socket } from 'socket.io';
import { Users } from '@prisma/client';

declare module 'socket.io' {
  interface Socket {
    user?: Users;
  }
}
