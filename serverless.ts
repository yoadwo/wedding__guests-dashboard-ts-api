import type { AWS } from '@serverless/typescript';

// import hello from '@functions/hello';
// import { helloDef } from '@functions/hello';
import { hello, getGuestsInfo, textGuests } from '@functions/index';


const serverlessConfiguration: AWS = {
  org: 'yoadw',
  app: 'wedding-invitations-aws',
  service: 'guests-dashboard-ts-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        'Effect': 'Allow',
        'Action': ['sns:SetSMSAttributes', 'sns:Publish'],
        'Resource': '*'
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      GUESTS_DB_HOST: '${param:GUESTS_DB_HOST}',
      GUESTS_DB_USER: '${param:GUESTS_DB_USER}',
      GUESTS_DB_PWD: '${param:GUESTS_DB_PWD}',
      GUESTS_DB_NAME: '${param:GUESTS_DB_NAME}',
      GUESTS_DB_TABLE: '${param:GUESTS_DB_TABLE, "guests"}',
      RSVP_LINK: '${param:RSVP_LINK}',
    },
  },
  // import the function via paths
  functions: { hello, getGuestsInfo, textGuests },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
