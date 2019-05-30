import * as Url from 'url-parse';
import { Methods, MonitorContext } from './index';
import Response from './response';

export default class Request extends Url {
  public body: any;
  public referer: string | null;
  public method: Methods;
  public response: Response;
  public context: MonitorContext;

  constructor(address: string) {
    super(address, true);
  }
}