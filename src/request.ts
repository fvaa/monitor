import * as Url from 'url-parse';
import { Methods } from './index';
import Context from './context';

export default class Request<T extends Context> extends Url {
  public body: any = null;
  public state: any = null;
  public params: {[key: string]: string} = {};
  public referer: string | null;
  public method: Methods;
  public ctx: T;

  constructor(ctx: T, address: string, body: any) {
    super(address, true);
    this.ctx = ctx;
    this.state = body;
  }
}