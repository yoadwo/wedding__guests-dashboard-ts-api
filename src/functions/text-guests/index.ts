import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const textGuests = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'text-guests',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        cors: true
      },
    },
  ],
};
