import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { MessageUtil } from '@libs/responseAPI';
import { middyfy } from '@libs/lambda';
import { makeDb } from '@libs/mysql';

import schema from './schema';
import { guestEM } from 'src/model/guest';

const getGuestsInfo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const db = makeDb();

  try {
    const guests: guestEM[] = await db.query(
      "select firstName, lastName, phoneNumber, phoneNumberHash, status " +
      "from guests", []);
    console.log('guests list: ', guests);
    return MessageUtil.success(guests);

  } catch (err) {
    console.error(err);
    return MessageUtil.error(err.code, err.message);
  } finally {
    await db.close();
  }
};

export const main = middyfy(getGuestsInfo);
