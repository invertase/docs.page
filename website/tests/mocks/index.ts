if (typeof window === 'undefined') {
  const { server } = require('./server');

  server.listen();
  console.log('server mock listening');
} else {
  const { worker } = require('./browser');
  worker.start();
  console.log('worker mock started');
}
