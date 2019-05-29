interface MonitorArguments {
  prefix?: string,
  event?: string
}

interface MonitorResponse {
  callback: Function
}

export default function Monitor(options: MonitorArguments = {
  prefix: '/',
  event: 'hashchange'
}): MonitorResponse {
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

  const stacks = [];

  return {
    callback(...fns: Array<Function>) {
      stacks.push(...fns);
    }
  }
}