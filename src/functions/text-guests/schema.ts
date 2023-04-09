export default {
  type: "array",
  items: {
    type: "object",
    properties: {
      firstName: { type: 'string', pattern: "^[א-תa-z0-9]{1,50}$" },
      phoneNumber: { type: 'string', maxLength: 30 },
      phoneNumberHash: { type: 'string', maxLength: 256 }    
    },
    required: ["firstName", "phoneNumber", "phoneNumberHash"],
    additionalProperties: false
  }
} as const;
