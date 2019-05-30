import Monitor from '../src/index';
const target = Monitor({
  prefix: '/api'
});

target.createServer(async function() {

})
console.log(target);