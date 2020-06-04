
const express = require('express');
const port = 3000;

const app = express();

app.use(express.static('./'));
app.use(express.json({ limit: '1mb' }));

app.post('/clientData', (request, response) => {
  console.log(request.body);
  response.json({
    status: 'success',
  });
});

app.get('/clientData', (request, response) => {
  console.log(request);
});

app.listen(port, () => {
  console.log('run at ' + port);
});



