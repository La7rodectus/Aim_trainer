/* eslint-disable max-len */
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

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
function byField(field) {
  return (a, b) => (a[field] > b[field] ? 1 : -1);
}
function convertSpeedAndTime(sessionStats) {
  const time = sessionStats.time.m * 60 + sessionStats.time.s;
  if (time === 0) {
    sessionStats.speed = 0;
    sessionStats.time = 0;
  } else {
    sessionStats.time = +time;
    sessionStats.speed = +(sessionStats.hits / time).toFixed(3);
  }
}

jsonReader('./serverData/usersData.json', (err, fileData) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(fileData);
});

app.post('/saveClientData', (request, response) => {
  console.log(request.body);
  fs.readFile('./serverData/usersData.json', (err, fileData) => {
    if (err) {
      return 'Error reading file from disk:', err;
    }
    const nickName = request.body.playerName;
    const sessionStats = request.body.sessionData;
    convertSpeedAndTime(sessionStats);
    const jsonObj = JSON.parse(fileData);
    !jsonObj[nickName] ? jsonObj[nickName] = new Array() : jsonObj[nickName];
    jsonObj[nickName].push(sessionStats);
    fs.writeFile('./serverData/usersData.json', JSON.stringify(jsonObj, null, 2), err => {
      if (err) console.log('Error writing file:', err);
    });
  });
  response.json({
    status: 'success',
  });
  response.end();

});

app.post('/getBestRes', (request, response) => {
  fs.readFile('./serverData/usersData.json', (err, fileData) => {
    if (err) {
      return 'Error reading file from disk:', err;
    }
    const playerName = request.body.playerName;
    const jsonFile = JSON.parse(fileData);
    if (jsonFile[playerName]) {
      jsonFile[playerName].sort(byField('time')).reverse();
      const bestTime = jsonFile[playerName][0].time;
      response.json({
        status: 'success',
        bestTime: `${bestTime}`,
      });
      response.end();
    }
  });
  console.log(request.body);
});

app.post('/getScoreboard', (request, response) => {
  fs.readFile('./serverData/usersData.json', (err, fileData) => {
    if (err) {
      return 'Error reading file from disk:', err;
    }
    const jsonFile = JSON.parse(fileData);
    const scoreboard = new Array();
    for (let playerName in jsonFile) {
      jsonFile[playerName].sort(byField('time')).reverse();
      const bestTime = jsonFile[playerName][0].time;
      scoreboard.push({ nick: playerName, time: bestTime });
    }
    response.json({
      status: 'success',
      scoreboard,
    });
    response.end();
  });
});


app.listen(port, () => {
  console.log('run at ' + port);
});



