import Request from './request';
import Response from './response';
export { Request, Response };
export declare type MonitorEventListener = 'hashchange' | 'popstate';
export declare type Methods = 'router' | 'get' | 'post' | 'put' | 'delete';
export declare type AsyncRequestPromiseLike<T> = (req: Request, res: Response) => Promise<T>;
export interface MonitorContext {
    error?(e: Error, req: Request, res: Response): void;
    prefix: string;
    event: MonitorEventListener;
    stacks: Array<AsyncRequestPromiseLike<void>>;
    referer: string;
    getCurrentRequest(): string;
    callback(...fns: Array<AsyncRequestPromiseLike<void>>): MonitorContext;
    urlencodeWithPrefix(url: string): string;
    generator(url: string, method: Methods, force: Boolean | undefined | null, body: any, callback?: (e: Error | null, req: Request, res: Response) => any): void;
    listen(mapState?: {
        [router: string]: string;
    }): void;
}
interface MonitorArguments {
    prefix?: string;
    event?: MonitorEventListener;
    error?(e: Error): void;
}
export default function Monitor(options?: MonitorArguments): (...fns: Array<AsyncRequestPromiseLike<void>>) => MonitorContext;
