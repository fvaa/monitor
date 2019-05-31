import { MonitorContext } from './index';
import Request from './request';

type CustomResponse = Promise<void | Error>;

export default class Response {
  public request: Request;
  public context: MonitorContext;

  constructor(context?: MonitorContext) {
    this.context = context;
  }

  private redirection(url: string, force: Boolean | undefined | null, callback: Function): CustomResponse {
    return new Promise(resolve => {
      this.context.generator(url, 'router', force, null, (err, req, res) => {
        if (err) {
          if (this.context.error) {
            this.context.error(err, req, res);
          }
          return resolve();
        }
        callback && callback();
        resolve();
      });
    });
  }

  // Add a history to the browser 
  // and perform the current recorded events and behaviors
  redirect(url: string): CustomResponse  {
    return this.redirection(url, false, () => {
      if (this.context.event === 'popstate') {
        window.history.pushState(null, window.document.title, this.context.urlencodeWithPrefix(url));
      } else {
        window.location.hash = this.context.urlencodeWithPrefix(url);
      }
    });
  }

  // Replace the current history for the browser 
  // and perform the current recorded events and behaviors
  replace(url: string): CustomResponse {
    url = this.context.urlencodeWithPrefix(url);
    return this.redirection(url, false, () => {
      if (this.context.event === 'popstate') {
        window.history.replaceState(null, window.document.title, this.context.urlencodeWithPrefix(url));
      } else {
        const i = window.location.href.indexOf('#');
        window.location.replace(
          window.location.href.slice(0, i >= 0 ? i : 0) + '#' + this.context.urlencodeWithPrefix(url)
        );
      }
    });
  }

  // Overloading events and behaviors of the current route
  realod() {
    return this.redirection(this.request.href, true, () => {
      if (this.context.event === 'popstate') {
        window.history.pushState(null, window.document.title, this.context.urlencodeWithPrefix(this.request.href));
      } else {
        window.location.hash = this.context.urlencodeWithPrefix(this.request.href);
      }
    });
  }
}