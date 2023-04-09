import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { MessageUtil } from '@libs/responseAPI';
import { middyfy } from '@libs/lambda';
import throat from 'throat';
import { SNS } from 'aws-sdk';

const publishTextPromise = new SNS({ apiVersion: '2010-03-31' });

import schema from './schema';
import { guestRM } from 'src/model/guest';

const textGuests: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  if (!event.body) {
    return MessageUtil.error(-1, "bad request: body is missing");
  }
  console.log('this is body: ', event.body);  

  const guests: guestRM[] = event.body;
  const inviteLink = process.env.RSVP_LINK;
  try {
    const snsResp = await Promise.all(
      guests.map(throat(5, (guest) => publishTextPromise.publish(
        {
          Message : `הי ${guest.firstName}, הוזמנת לחתונה של שירלי ויועד. אנא עדכנ/י אם תגיעו בלחיצה על הקישור הבא - ${inviteLink+guest.phoneNumberHash}`,
          PhoneNumber : `+972${guest.phoneNumber.substring(1)}`,
        }
      ).promise())),
    )
    return MessageUtil.success({ sns: snsResp })
  } catch (err) {
    console.log('sns err', err)
    return MessageUtil.error(err.code, err.message);
  }
};

export const main = middyfy(textGuests);
