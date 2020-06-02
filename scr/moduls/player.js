/* eslint-disable max-len */

import { printRightSide } from './library.js';


export default class Player {
  constructor() {
    this.health = null;
    this.hits = new Array();
    this.gameSessions = new Array();
    this.hitsPerSecond = new Array();
  }

  saveGameSessions(time, hits) {
    let speed = hits / (time.m * 60 + time.s);
    if (speed !== 0 && speed) {
      speed = '<br> Hits/sec = ' + speed.toFixed(3);
    } else {
      speed = '<br> not ur best try';
    }
    this.gameSessions.push({ time, hits, speed, graphHits: this.hits });
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
