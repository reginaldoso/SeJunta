const http = require('http');
const app = require('../src/app');

function startApp() {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => resolve(server));
    server.on('error', reject);
  });
}

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch(e) { json = data; }
        resolve({ statusCode: res.statusCode, body: json });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  const server = await startApp();
  const port = server.address().port;
  const host = '127.0.0.1';

  let failures = 0;

  try {
    console.log('Running test: register valid @ufba.br');
    let res = await request({ method: 'POST', host, port, path: '/users/register', headers: { 'Content-Type': 'application/json' } }, { name: 'Fulano', email: 'fulano@ufba.br', password: 'senha123', cpf: '12345678901' });
    if (res.statusCode !== 201 || res.body.email !== 'fulano@ufba.br') { console.error('FAILED', res); failures++; } else console.log('OK');

    console.log('Running test: register invalid domain');
    res = await request({ method: 'POST', host, port, path: '/users/register', headers: { 'Content-Type': 'application/json' } }, { name: 'User', email: 'user@example.com', password: 'x', cpf: '1' });
    if (res.statusCode !== 400) { console.error('FAILED', res); failures++; } else console.log('OK');

    console.log('Running test: login requires fields');
    res = await request({ method: 'POST', host, port, path: '/users/login', headers: { 'Content-Type': 'application/json' } }, {});
    if (res.statusCode !== 400) { console.error('FAILED', res); failures++; } else console.log('OK');

    console.log('Running test: login valid (after register)');
    res = await request({ method: 'POST', host, port, path: '/users/login', headers: { 'Content-Type': 'application/json' } }, { email: 'fulano@ufba.br', password: 'senha123' });
    if (res.statusCode !== 200 || !res.body.token) { console.error('FAILED', res); failures++; } else console.log('OK');

  } catch (err) {
    console.error('Error running tests', err);
    failures++;
  } finally {
    server.close();
    if (failures) {
      console.error(`${failures} test(s) failed`);
      process.exit(1);
    } else {
      console.log('All tests passed');
      process.exit(0);
    }
  }
}

run();
