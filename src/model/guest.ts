// used as request body send texts endpoint
export interface guestRM {
    recipient: string,
    phoneNumber: string,
    phoneNumberHash: string,
}

export interface guestEM {
    recipient: string,
    phoneNumber: string,
    phoneNumberHash: string,
    status: number,
    messagesReceived: number,
}

export interface guestsResponse {
    guests: guestEM[],
    rsvpLink: string
}
