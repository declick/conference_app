

export class SeatsNotAvailableException extends Error {
    constructor() {
      super("Cannot reduce seats below existing bookings");
      this.name = "SeatsNotAvailableException";
    }
  }
  