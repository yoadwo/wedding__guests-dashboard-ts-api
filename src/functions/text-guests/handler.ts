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
  var Message = event.body[0].firstName;
  var PhoneNumber = '+972' + event.body[0].phoneNumber.substring(1); // trim leading zero
  console.log('sending details to first contact only. messaage, phone number', Message, PhoneNumber);

  var params = {
    Message: Message,
    PhoneNumber: PhoneNumber,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        'DataType': 'String',
        'StringValue': 'WEDD-RSVP'
      }
    }
  };

  let snsResp;
  try {
    snsResp = await publishTextPromise.publish(params).promise();
    console.log("sns response", snsResp);
    // await SNSpublisher.publish(messageParams).promise();
  } catch (err) {
    console.log('sns err', err)
    return MessageUtil.error(err.code, err.message);
  }

  return MessageUtil.success({ sns: snsResp })

};

export const main = middyfy(textGuests);
