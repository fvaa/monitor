import * as Url from 'url-parse';
import { Methods, MonitorContext } from './index';
import Response from './response';
export default class Request extends Url {
    body: any;
    referer: string | null;
    method: Methods;
    response: Response;
    context: MonitorContext;
    constructor(address: string);
}
