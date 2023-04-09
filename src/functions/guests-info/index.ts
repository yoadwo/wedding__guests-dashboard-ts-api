// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const getGuestsInfo = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'get-guests-info',
        cors: true
      },
    },
  ],
};
