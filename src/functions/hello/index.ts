import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const hello = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
    {
      http: {
        method: 'get',
        path: 'hello',
        request: {
        },
      },
    }
  ],
};
