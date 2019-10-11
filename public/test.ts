import Monitor from '../src/index';
const createServer = Monitor({
  prefix: '/api',
  event: 'hashchange',
  error(e, ctx) {
    console.log(ctx, e)
  }
});


let installed = false;
let divs: HTMLElement;
createServer(async (ctx) => {
  if (!installed) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    div.innerHTML = ctx.req.pathname;
    div.addEventListener('click', () => {
      // ctx.res.redirect('/a/b/c/d')
      ctx.post('/test').then(console.log)
    });
    installed = true;
    divs = div;
  } else if (ctx.path === '/test') {
    // ctx.body = {
    //   a:1
    // }
    throw new Error('sdaf')
  } else {
    divs.innerHTML = ctx.req.pathname
    console.log(ctx);
  }
}).listen({
  '/': '/abc'
});