class ResponseBodyVO {
    code: number;
    message: string;
    data?: object;
}
  
class ResponseVO {
    statusCode: number;
    body: string;
}

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
}


enum StatusCode {
  success = 200,
  badrequest = 400,  
  servererror = 500
}

class Result {
  private statusCode: number;
  private code?: number;
  private message?: string;
  private data?: any;

  constructor(statusCode: number, code: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   */
  bodyToString () {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        data: this.data,
      }, null, 2),
      headers
    };
  }
}

export class MessageUtil {
  static success(data: object): ResponseVO {
    const result = new Result(StatusCode.success, undefined, undefined, data);

    return result.bodyToString();
  }

  static error(code: number = 1000, message: string) {
    const result = new Result(StatusCode.badrequest, code, message, undefined);

    return result.bodyToString();
  }
}

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatOkResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: headers
  }
}

export const formatBadRequestResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 400,
    body: JSON.stringify(response),
    headers: headers
  }
}

export const formatInternalErrorResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 500,
    body: JSON.stringify(response),
    headers: headers
  }
}