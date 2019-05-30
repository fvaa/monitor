import LocationFormatter from './location';

type EventListener = 'hashchange' | 'popstate';
type AsyncFunctionPromiseLike<T> = () => Promise<T>;

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

  const { parse } = LocationFormatter(options.prefix);
  const context: {
    stacks: Array<AsyncFunctionPromiseLike<void>>,
    request: object,
    referer?: string
  } = {
    stacks: [],
    request: {},
    referer: null
  }

  return {
    createServer(...fns: Array<AsyncFunctionPromiseLike<void>>) {
      context.stacks.push(...fns);
    },
    redirect(url: string) {
      
    }
  }
}