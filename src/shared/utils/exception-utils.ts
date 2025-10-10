import { Exception } from '../exceptions/exception';

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  timestamp: string;
};
export class ExceptionUtils {
  public static buildErrorResponse(exception: Exception, statusCode: number) {
    const aResponseData: ExceptionResponse = {
      statusCode: statusCode,
      message: exception.getExternalMessage(),
      timestamp: new Date().toISOString(),
    };
    return aResponseData;
  }
}
