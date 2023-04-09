import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { MessageUtil } from '@libs/responseAPI';
import { middyfy } from '@libs/lambda';
import { SNS } from 'aws-sdk';

const publishTextPromise = new SNS({ apiVersion: '2010-03-31' });

import schema from './schema';
import { guestRM } from 'src/model/guest';

const textGuests: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  if (!event.body) {
    return MessageUtil.error(-1, "bad request: body is missing");
  }

  console.log('this is body: ', event.body);  

  let params = {
    Message: undefined,
    PhoneNumber: undefined
  }

  let promises: Promise<SNS.PublishResponse>[] = [];
  const inviteLink = process.env.RSVP_LINK;

  event.body.forEach((guest) => {
    params.Message = `הי ${guest.firstName}, הוזמנת לחתונה של שירלי ויועד. אנא עדכנו אם תגיעו בלחיצה על הקישור הבא - ${inviteLink+guest.phoneNumberHash}`;
    params.PhoneNumber = `+972${guest.phoneNumber.substring(1)}`;
    promises.push(publishTextPromise.publish(params).promise());
  });

  let snsResp;
  try {
    snsResp = await Promise.all(promises);
    console.log("sns response", snsResp);
  } catch (err) {
    console.log('sns err', err)
    return MessageUtil.error(err.code, err.message);
  }

  return MessageUtil.success({ sns: snsResp })

};

export const main = middyfy(textGuests);
