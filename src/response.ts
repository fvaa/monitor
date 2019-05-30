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
    return new Promise((resolve, reject) => {
      this.context.generator(url, 'router', force, null, err => {
        if (err) return reject(err);
        callback && callback();
        resolve();
      });
    });
  }

  redirect(url: string): CustomResponse  {
    return this.redirection(url, false, () => {
      if (this.context.event === 'popstate') {
        window.history.pushState(null, window.document.title, this.context.urlencodeWithPrefix(url));
      } else {
        window.location.hash = this.context.urlencodeWithPrefix(url);
      }
    });
  }

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