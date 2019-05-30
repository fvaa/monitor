import Request from './request';
import Response from './response';

export { Request, Response };
export type MonitorEventListener = 'hashchange' | 'popstate';
export type Methods = 'router' | 'get' | 'post' | 'put' | 'delete';
export type AsyncRequestPromiseLike<T> = (req: Request, res: Response) => Promise<T>;
export interface MonitorContext {
  error?(e: Error, req: Request, res: Response): void,
  prefix: string,
  event: MonitorEventListener,
  stacks: Array<AsyncRequestPromiseLike<void>>,
  referer: string,
  getCurrentRequest(): string,
  callback(...fns: Array<AsyncRequestPromiseLike<void>>): MonitorContext,
  urlencodeWithPrefix(url: string): string,
  generator(url: string, method: Methods, force: Boolean | undefined | null, body: any, callback?: (e: Error | null, req: Request, res: Response) => any): void,
  listen(mapState?: { [router: string]: string }): void,
}

interface MonitorArguments {
  prefix?: string,
  event?: MonitorEventListener,
  error?(e: Error): void,
}

export default function Monitor(options: MonitorArguments = {
  prefix: '/',
  event: 'hashchange',
}): (...fns: Array<AsyncRequestPromiseLike<void>>) => MonitorContext {
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

  // We agree that the `options.prefix` must end with `/`
  if (!options.prefix) options.prefix = '/';
  if (!options.prefix.endsWith('/')) options.prefix += '/';

  const context: MonitorContext = {
    prefix: options.prefix,
    event: options.event,
    error: options.error,
    stacks: [],
    referer: null,

    // Determine the routing address 
    // by the current network address and prefix prefix
    getCurrentRequest() {
      let path = this.event === 'popstate' 
        ? window.location.href.substring(window.location.origin.length) || this.prefix
        : (window.location.hash ? window.location.hash.substring(1) : this.prefix);
      if (path.startsWith(this.prefix)) path = path.substring(this.prefix.length - 1) || '/';
      return path;
    },

    // Combine custom addresses with prefix to form a network address
    urlencodeWithPrefix(url) {
      if (url.startsWith(this.prefix)) return url;
      if (url.startsWith('/')) url = url.substring(1);
      return this.prefix + url;
    },

    // Customize events and behaviors by throwing them 
    // into a rule parsing function by customizing the address.
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
      Promise.all(context.stacks.map(stack => stack(request, response)))
      .then(() => {
        if (method === 'router') this.referer = url;
        if (callback) return callback(null, request, response);
      }).catch(e => callback && callback(e, request, response));
    },

    // Stack throw function for multi-layer custom events and behaviors
    callback(...fns) {
      this.stacks.push(...fns);
      return this;
    },

    // The jump map is implemented by listening 
    // to the matched route through the parameter dictionary.
    listen(mapState = {}) {
      const path = this.getCurrentRequest();
      const response = new Response(this);
      return response.replace(mapState[path] || '/');
    }
  }

  // Listen to browser default behavior
  window.addEventListener(context.event, () => {
    const path = context.getCurrentRequest();
    context.generator(path, 'router', false, null, (e, req, res) => {
      if (context.error) {
        context.error(e, req, res);
      }
    });
  });

  return function createServer(...fns) {
    return context.callback(...fns);
  }
}