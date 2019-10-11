import Request from './request';
import Response from './response';
import Context from './context';
export { Request, Response, Context };
export declare type MonitorEventListener = 'hashchange' | 'popstate';
export declare type Methods = 'router' | 'get' | 'post' | 'put' | 'delete';
export declare type StackFunction<T extends Context> = (ctx: T) => Promise<any>;
export interface MonitorReference<T extends Context> {
    error?(e: Error, ctx: T): void | Promise<void>;
    start?(ctx: T): void | Promise<void>;
    stop?(ctx: T): void | Promise<void>;
    readonly prefix: string;
    readonly event: MonitorEventListener;
    readonly stacks: StackFunction<T>[];
    readonly referer: string;
    ctx: T | null;
    getCurrentRequest(): string;
    callback(...fns: StackFunction<T>[]): MonitorReference<T>;
    urlencodeWithPrefix(url: string): string;
    generator<U = any>(url: string, method: Methods, force: Boolean | undefined | null, body: any, callback?: (e: Error | null, ctx: T) => Promise<any>): Promise<U>;
    listen(mapState?: {
        [router: string]: string;
    }): Promise<void>;
    bootstrap: (url: string) => Promise<void>;
}
export interface MonitorArguments<T extends Context> {
    prefix?: string;
    event?: MonitorEventListener;
    error?(e: Error, ctx: T): void | Promise<void>;
    start?(ctx: T): void | Promise<void>;
    stop?(ctx: T): void | Promise<void>;
}
export default function Monitor<T extends Context>(options: MonitorArguments<T>): (...fns: StackFunction<T>[]) => MonitorReference<T>;
