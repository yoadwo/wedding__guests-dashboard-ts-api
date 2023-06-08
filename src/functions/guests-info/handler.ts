import type { EventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { MessageUtil } from '@libs/responseAPI';
import { middyfy } from '@libs/lambda';
import { makeDb } from '@libs/mysql';

import { guestEM, guestsResponse } from 'src/model/guest';


const getGuestsInfo: EventAPIGatewayProxyEvent = async (event) => {
  const db = makeDb();
  
  try {
    const guests: guestEM[] = await db.query(
      `select recipient, phoneNumber, phoneNumberHash, status, attendingCount, side, _group, messagesReceived from ${process.env.GUESTS_DB_TABLE}`, []);
    console.log('guests list: ', guests);
    const resp: guestsResponse = {
      guests: guests,
      rsvpLink: process.env.RSVP_LINK
    }
    return MessageUtil.success(resp);

  } catch (err) {
    console.error(err);
    return MessageUtil.error(err.code, err.message);
  } finally {
    await db.close();
  }
};

export const main = middyfy(getGuestsInfo);
