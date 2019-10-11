import Request from './request';
import Response from './response';
import { MonitorReference, Methods } from './index';

export default class Context {
  public title: string = window.document.title;
  public body: any;
  public readonly req: Request<this>;
  public readonly res: Response<this>;
  public readonly ref: MonitorReference<this>;
  constructor(url: string, method: Methods, body: any, reference: any) {
    this.ref = reference;
    this.req = new Request(this, url, body);
    this.res = new Response(this);
    this.req.method = method;
  }

  get method() {
    return this.req.method;
  }

  get isApi() {
    return this.method !== 'router';
  }

  get query() {
    return this.req.query;
  }

  get state() {
    return this.req.state;
  }

  get params() {
    return this.req.params;
  }

  get referer() {
    return this.req.referer;
  }

  get path() {
    return this.req.pathname;
  }

  redirect(url: string) {
    return this.res.redirect(url);
  }

  replace(url: string) {
    return this.res.replace(url);
  }

  reload() {
    return this.res.realod();
  }

  get<U = any>(url: string) {
    return this.res.get<U>(url);
  }

  post<U = any>(url: string, data?: any) {
    return this.res.post<U>(url, data);
  }

  put<U = any>(url: string, data?: any) {
    return this.res.put<U>(url, data);
  }

  delete<U = any>(url: string) {
    return this.res.delete<U>(url);
  }
}