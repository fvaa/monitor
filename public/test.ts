import Monitor, { Request, Response } from '../src/index';
const createServer = Monitor({
  // prefix: '/api',
  event: 'popstate'
});

createServer(async (req: Request, res: Response) => {

}).listen('/abc');