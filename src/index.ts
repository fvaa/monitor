import Request from './request';
import Response from './response';

export { Request, Response };
export type EventListener = 'hashchange' | 'popstate';
export type Methods = 'router' | 'get' | 'post' | 'put' | 'delete';
export type AsyncRequestPromiseLike<T> = (req: Request, res: Response) => Promise<T>;
export interface MonitorContext {
  prefix: string,
  event: EventListener,
  stacks: Array<AsyncRequestPromiseLike<void>>,
  referer: string,
  callback(...fns: Array<AsyncRequestPromiseLike<void>>): MonitorContext,
  urlencodeWithPrefix(url: string): string,
  generator(url: string, method: Methods, force: Boolean | undefined | null, body: any, callback: (e?: Error) => any): void,
  listen(url:string): void,
}

interface MonitorArguments {
  prefix?: string,
  event?: EventListener
}

export default function Monitor(options: MonitorArguments = {
  prefix: '/',
  event: 'hashchange'
}) {
  /**
   * In the following two cases, the system will force the listen mode to be converted to `hashchange`:
   *  1. When the `popstate` listen mode is specified, but the system browser does not support.
   *  2. When loading the page using the file protocol.
   */
  if (
    (options.event === 'popstate' && !window.history.pushState) || 
    window.location.protocol.indexOf('file:') === 0
  ) {
    options.event = 'hashchange';
  }

  if (!options.prefix) options.prefix = '/';
  if (!options.prefix.endsWith('/')) options.prefix += '/';
  const context: MonitorContext = {
    prefix: options.prefix,
    event: options.event,
    stacks: [],
    referer: null,
    urlencodeWithPrefix(url) {
      if (url.startsWith(this.prefix)) return url;
      if (url.startsWith('/')) url = url.substring(1);
      return this.prefix + url;
    },
    generator(url, method, force, body, callback) {
      if (!force && this.referer === url) return;
      const request = new Request(url);
      const response = new Response(this);
      request.body = body;
      request.referer = this.referer;
      request.method = method;
      request.response = response;
      response.request = request;
      request.context = this;
      Promise.all(context.stacks.map(stack => stack(request, response))).then(() => {
        if (method === 'router') {
          this.referer = request.href;
        }
      }).catch(e => callback(e)).then(callback);
    },
    callback(...fns) {
      this.stacks.push(...fns);
      return this;
    },
    listen(url) {
      const response = new Response(this);
      return response.replace(url);
    }
  }

  return function createServer(...fns: Array<AsyncRequestPromiseLike<void>>) {
    return context.callback(...fns);
  }
}