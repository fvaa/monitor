import Monitor, { Request, Response } from '../src/index';
const createServer = Monitor({
  // prefix: '/api',
  event: 'hashchange'
});


let installed = false;
let divs: HTMLElement;
createServer(async (req: Request, res: Response) => {
  if (!installed) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    div.innerHTML = req.pathname;
    div.addEventListener('click', () => {
      res.redirect('/a/b/c/d')
    });
    installed = true;
    divs = div;
  } else {
    divs.innerHTML = req.pathname
    console.log(req, res);
  }
}).listen({
  '/': '/abc'
});