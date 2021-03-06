/* eslint-disable max-len */

import { printRightSide } from './library.js';

//config
import CONFIG from '../../config.js';
const ID = CONFIG.id;


export default class Player {
  constructor() {
    this.health = null;
    this.hits = new Array();
    this.gameSessions = new Array();
    this.hitsPerSecond = new Array();
    this.playerName = 'Temporary';
  }

  getBestResalt() {
    if (this.playerName !== 'Temporary') {
      const sendOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName: `${this.playerName}` }),
      };
      fetch('/getBestRes', sendOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const str = ('BestTime = ' + data.bestTime + ' sec');
          if (!document.getElementById(ID.bestTime_par)) {
            const resPlace = document.getElementById(ID.lastSessionRes_div);
            const p = document.createElement('p');
            p.id = ID.bestTime_par;
            p.innerHTML = str;
            resPlace.append(p);
          } else {
            document.getElementById(ID.bestTime_par).innerHTML = str;
          }
        })
        .catch(err => console.log(err));
    } else {
      document.getElementById(ID.bestTime_par).remove();
    }
  }

  saveGameSessions(time, hits) {
    let speed = hits / (time.m * 60 + time.s);
    if (speed !== 0 && speed) {
      speed = '<br> Hits/sec = ' + speed.toFixed(3);
    } else {
      speed = '<br> not ur best try';
    }
    const serverData = { time, hits, speed, graphHits: this.hits };
    this.gameSessions.push(serverData);
    if (this.playerName) {
      const sendOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName: `${this.playerName}`, sessionData: serverData }),
      };
      fetch('/saveClientData', sendOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })
        .catch(err => console.log(err));
    }

  }

  setNick(nick = undefined) {
    if (nick !== undefined) {
      this.playerName = nick;
      document.getElementById(ID.nick_div).innerText = nick;
      this.getBestResalt();
    } else {
      const sendOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      };
      fetch('/getCurrentUser', sendOptions)
        .then(response => response.json())
        .catch(err => console.log('response failed ', err))
        .then(data => {
          this.playerName = data.nick;
          document.getElementById(ID.nick_div).innerText = data.nick;
          this.getBestResalt();
        })
        .catch(err => console.log('can\'t show scoreboard', err));
    }
  }

  playerHealthReset() {
    this.health = null;
  }

  init(gameMode) {
    if (gameMode === 'challenge') {
      this.health = 3;
    }
  }

  addHit(x, y, target) {
    this.hits.push({ x, y, target });
  }

  printResult() {
    const lastGame = this.gameSessions[this.gameSessions.length - 1];
    const strToPrint = 'time = ' + lastGame.time.m + ':' + lastGame.time.s + lastGame.speed;
    printRightSide(strToPrint);
  }

}
