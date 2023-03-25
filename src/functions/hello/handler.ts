 import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { MessageUtil } from '../../libs/responseAPI';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('body: ', event.body);
  return MessageUtil.success({
    message: `Hello ${event.body?.name || 'Stranger'}, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(hello);
