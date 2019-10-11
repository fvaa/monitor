import Context from './context';
export default class Response<T extends Context> {
    readonly ctx: T;
    constructor(ctx: T);
    private http;
    private redirection;
    redirect(url: string): Promise<any>;
    replace(url: string): Promise<any>;
    realod(): Promise<any>;
    get<U = any>(url: string): Promise<U>;
    post<U = any>(url: string, data?: any): Promise<U>;
    put<U = any>(url: string, data?: any): Promise<U>;
    delete<U = any>(url: string): Promise<U>;
}
