export default {
  type: "object",
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phoneNumber: { type: 'string' },
    phoneNumberHash: { type: 'string' },
    status: { type: 'number' }
  }  
} as const;
