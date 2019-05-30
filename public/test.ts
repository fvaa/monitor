import Monitor, { Request, Response } from '../src/index';
const createServer = Monitor({
  // prefix: '/api',
  event: 'hashchange'
});


let installed = false;
createServer(async (req: Request, res: Response) => {
  if (!installed) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    div.innerHTML = 'test';
    div.addEventListener('click', () => {
      res.redirect('/a/b/c/d')
    });
    installed = true;
  } else {
    console.log(req, res);
  }
}).listen({
  '/': '/abc'
});