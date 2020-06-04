/* eslint-disable max-len */
const express = require('express');
const fs = require('fs');
const port = 3000;

const app = express();

app.use(express.static('./'));
app.use(express.json({ limit: '1mb' }));

// help fn
function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && 'Error reading file from disk:', cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && 'Error parsing JSON string:', cb(err);
    }
  });
}

jsonReader('./serverData/usersData.json', (err, fileData) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(fileData);
});



app.post('/clientData', (request, response) => {
  console.log(request.body);

  fs.writeFile('./serverData/usersData.json', JSON.stringify(request.body, null, 2), err => {
    if (err) console.log('Error writing file:', err);
  });

  response.json({
    status: 'success',
  });
  response.end();

});

app.get('/clientData', (request, response) => {
  console.log(request);
});

app.listen(port, () => {
  console.log('run at ' + port);
});



