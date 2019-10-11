import Request from './request';
import Response from './response';
import Context from './context';

export { Request, Response, Context };
export type MonitorEventListener = 'hashchange' | 'popstate';
export type Methods = 'router' | 'get' | 'post' | 'put' | 'delete';
export type StackFunction<T extends Context> = (ctx: T) => Promise<any>;
export interface MonitorReference<T extends Context> {
  error?(e: Error, ctx: T): void | Promise<void>,
  start?(ctx: T): void | Promise<void>,
  stop?(ctx: T): void | Promise<void>,
  readonly prefix: string,
  readonly event: MonitorEventListener,
  readonly stacks: StackFunction<T>[],
  readonly referer: string,
  ctx: T | null,
  getCurrentRequest(): string,
  callback(...fns: StackFunction<T>[]): MonitorReference<T>,
  urlencodeWithPrefix(url: string): string,
  generator<U = any>(
    url: string, 
    method: Methods, 
    force: Boolean | undefined | null, 
    body: any,
    callback?: (e: Error | null, ctx: T) => Promise<any>
  ): Promise<U>,
  listen(mapState?: { [router: string]: string }): Promise<void>,
  bootstrap: (url: string) => Promise<void>,
}

export interface MonitorArguments<T extends Context> {
  prefix?: string,
  event?: MonitorEventListener,
  error?(e: Error, ctx: T): void | Promise<void>,
  start?(ctx: T): void | Promise<void>,
  stop?(ctx: T): void | Promise<void>,
}

export default function Monitor<T extends Context>(options: MonitorArguments<T>) {
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

  const reference: MonitorReference<T> = {
    prefix: options.prefix,
    event: options.event,
    error: options.error,
    start: options.start,
    stop: options.stop,
    stacks: [],
    ctx: null,

    get referer() {
      return reference.ctx ? reference.ctx.req.referer : null;
    },

    // Determine the routing address 
    // by the current network address and prefix prefix
    getCurrentRequest() {
      let path = reference.event === 'popstate' 
        ? window.location.href.substring(window.location.origin.length) || reference.prefix
        : (window.location.hash ? window.location.hash.substring(1) : reference.prefix);
      if (path.startsWith(reference.prefix)) path = path.substring(reference.prefix.length - 1) || '/';
      return path;
    },

    // Combine custom addresses with prefix to form a network address
    urlencodeWithPrefix(url) {
      if (url.startsWith(reference.prefix)) return url;
      if (url.startsWith('/')) url = url.substring(1);
      return reference.prefix + url;
    },

    // Customize events and behaviors by throwing them 
    // into a rule parsing function by customizing the address.
    async generator(url, method, force, body, callback) {
      if (!force && reference.referer === url) return;
      const ctx = new Context(url, method, body, reference) as T;
      if (method === 'router') reference.ctx = ctx;
      reference.start && await reference.start(ctx);
      let stopInvoked = false;
      return await Promise.all(reference.stacks.map(stack => Promise.resolve(stack(ctx))))
        .then(async () => {
          if (method === 'router') reference.ctx.req.referer = url;
          if (reference.stop) {
            await reference.stop(ctx);
            stopInvoked = true;
          }
          if (callback) await callback(null, ctx);
          return ctx.body;
        }).catch(async e => {
          if (!stopInvoked && reference.stop) {
            await reference.stop(ctx);
          }
          callback && await callback(e, ctx);
        });
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
      return reference.bootstrap(mapState[path] || path);
    },

    bootstrap(url: string) {
      url = reference.urlencodeWithPrefix(url);
      return reference.generator(url, 'router', false, null, async (err, ctx) => {
        if (err) {
          if (reference.error) await Promise.resolve(reference.error(err, ctx));
          throw err;
        }
        if (reference.event === 'popstate') {
          window.history.replaceState(null, ctx.title || window.document.title, reference.urlencodeWithPrefix(url));
        } else {
          const i = window.location.href.indexOf('#');
          window.location.replace(
            window.location.href.slice(0, i >= 0 ? i : 0) + '#' + reference.urlencodeWithPrefix(url)
          );
          window.document.title = ctx.title || window.document.title;
        }
      });
    }
  }

  // Listen to browser default behavior
  window.addEventListener(reference.event, () => {
    const path = reference.getCurrentRequest();
    reference.generator(path, 'router', false, null, async (e, ctx) => {
      if (e) {
        if (reference.error) return await Promise.resolve(reference.error(e, ctx));
        throw e;
      }
    });
  });

  return function createServer(...fns: StackFunction<T>[]) {
    return reference.callback(...fns);
  }
}