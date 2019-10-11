import Request from './request';
import Response from './response';
import { MonitorReference, Methods } from './index';
export default class Context {
    title: string;
    body: any;
    readonly req: Request<this>;
    readonly res: Response<this>;
    readonly ref: MonitorReference<this>;
    constructor(url: string, method: Methods, body: any, reference: any);
    readonly method: Methods;
    readonly isApi: boolean;
    readonly query: {
        [key: string]: string;
    };
    readonly state: any;
    readonly params: {
        [key: string]: string;
    };
    readonly referer: string;
    readonly path: string;
    redirect(url: string): Promise<any>;
    replace(url: string): Promise<any>;
    reload(): Promise<any>;
    get<U = any>(url: string): Promise<U>;
    post<U = any>(url: string, data?: any): Promise<U>;
    put<U = any>(url: string, data?: any): Promise<U>;
    delete<U = any>(url: string): Promise<U>;
}
