export class Rsvp {
  constructor(payload) {
    if (!payload) return null;
    else {
      (this.name = payload.name),
        (this.rsvpRequestId = 'somestring'),
        (this.attending = payload.attending),
        (this.email = payload.email),
        (this.message = payload.message),
        (this.createdOn = Date.now());
    }
  }

  formatForDynamo() {
    return {
      Item: {
        name: {
          S: this.name,
        },
        rsvp_request_id: {
          S: this.rsvpRequestId,
        },
        created_on: {
          N: this.createdOn,
        },
        attending: {
          BOOL: this.attending == 'on' ? true : false,
        },
        email: {
          S: this.email,
        },
        message: {
          S: this.message,
        },
      },
    };
  }
}
