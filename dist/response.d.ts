import { MonitorContext } from './index';
import Request from './request';
declare type CustomResponse = Promise<void | Error>;
export default class Response {
    request: Request;
    context: MonitorContext;
    constructor(context?: MonitorContext);
    private redirection;
    redirect(url: string): CustomResponse;
    replace(url: string): CustomResponse;
    realod(): Promise<void | Error>;
}
export {};
