export class HttpError extends Error {
    public readonly httpStatus: number;
  
    constructor(message: string, httpStatus: number) {
      super(message);
      this.httpStatus = httpStatus;
    }
}