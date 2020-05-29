'use strict';
/* eslint-disable max-len */

// library
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function print(data, discriptoin) {
  // eslint-disable-next-line no-undef
  const datawrap = document.getElementById('text');
  const string = data.toString();
  datawrap.innerHTML = string + '____' + discriptoin + '<br>';
}

//canvas class
class CanvasClass {
  constructor(canvasId) {
    // eslint-disable-next-line no-undef
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvasId = canvasId;
    this.ctx.globalAlpha = 1;
    this.circlesXYandColor = new Array();
    this.circlesStyles = { colorborder: '#00FF00', colorfill: '#eb4034' };
    this.usedColors = ['#00FF00', '#eb4034', '#000000', '#ffffff'];
    this.lost = 0;
  }

  radiusAnimationControl(maxR) {
    this.circlesXYandColor.forEach(circle => {
      if (circle.r === 2) {
        circle.inc = true;
      }
      if (circle.r === maxR) {
        circle.inc = false;
      }
      if (circle.inc === false) {
        circle.r -= 1;
      }
      if (circle.inc === true) {
        circle.r += 1;
      }
      if (circle.r < 3) {
        this.deleteCircle(circle);
        this.lost += 1;
      }
    });
  }

  findObjIndex(obj) {
    for (let i = 0; i < this.circlesXYandColor.length; i++) {
      if (this.circlesXYandColor[i].x === obj.x &&
        this.circlesXYandColor[i].r === obj.r &&
        this.circlesXYandColor[i].y === obj.y) {
        return i;
      }
    }
  }

  getId() {
    return this.canvasId;
  }

  removeCircle(obj) {
    const index = this.findObjIndex(obj);
    this.circlesXYandColor.splice(index, 1);

  }

  removeColor(color) {
    this.usedColors = [...new Set(this.usedColors)];
    const colorIndex = this.usedColors.indexOf(color);
    this.usedColors.splice(colorIndex, 1);
  }

  setCircleStyle(colorborder, colorfill) {
    this.circlesStyles.colorborder = colorborder;
    this.circlesStyles.colorfill = colorfill;
  }

  getCircleStyle() {
    return this.circlesStyles;
  }

  getCircleXY() {
    return this.circlesXYandColor;
  }

  resize() {
    const displayWidth  = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;

    if (this.canvas.width  !== displayWidth ||
      this.canvas.height !== displayHeight) {

      this.canvas.width  = displayWidth;
      this.canvas.height = displayHeight;
    }
  }

  clientXYToCanvasXY(x, y) {
    const bbox = this.canvas.getBoundingClientRect();
    return { x: x - bbox.left * (this.canvas.width / bbox.width),
      y: y - bbox.top * (this.canvas.height / bbox.height) };
  }

  getColorCode() {
    const r = getRandomIntInclusive(0, 255);
    const g = getRandomIntInclusive(0, 255);
    const b = getRandomIntInclusive(0, 255);
    let rgb = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    while (this.usedColors.includes(rgb) || rgb.length !== 7) {
      const r = getRandomIntInclusive(0, 255);
      const g = getRandomIntInclusive(0, 255);
      const b = getRandomIntInclusive(0, 255);
      rgb = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    }
    return rgb;
  }

  findCircleByColor(color) {
    const length = this.circlesXYandColor.length;
    for (let i = 0; i < length; i++) {
      if (this.circlesXYandColor[i].color === color) {
        return this.circlesXYandColor[i];
      }
    }
  }

  checkColor(canvas) {
    const carrentX = this.clientXYToCanvasXY(canvas.clientX, canvas.clientY).x;
    const carrentY = this.clientXYToCanvasXY(canvas.clientX, canvas.clientY).y;
    const pixelColorData = this.ctx.getImageData(carrentX, carrentY, 1, 1).data;
    const r = pixelColorData[0];
    const g = pixelColorData[1];
    const b = pixelColorData[2];
    const carrentColor = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    const res = this.findCircleByColor(carrentColor);
    return res;
  }

  addArc(x, y, r = 2) {
    const color = this.circlesStyles.colorfill;
    const colorBorder = this.circlesStyles.colorborder;
    this.circlesXYandColor.push({ x, y, color, colorBorder, r });
    this.usedColors.push(color);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.resize();
    this.circlesXYandColor.forEach(circle => {
      this.ctx.strokeStyle = circle.colorBorder;
      this.ctx.fillStyle = circle.color;
      this.ctx.beginPath();
      this.ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.fill();
    });
  }

  deleteCircle(target) {
    this.removeCircle(target);
    this.removeColor(target.color);
  }

  reset() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.circlesXYandColor = new Array();
    this.circlesStyles = { colorborder: '#00FF00', colorfill: '#eb4034' };
    this.usedColors = ['#00FF00', '#eb4034', '#000000', '#ffffff'];
    this.lost = 0;
  }
}

//player
class Player {
  constructor() {
    this.health = null;
    this.hits = new Array();
    this.BestTimes = new Array();
  }

  saveTime(time) {
    this.BestTimes.push(time);
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
}

//timer
class GameTimer {
  constructor(timerParId) {
    // eslint-disable-next-line no-undef
    this.timerPar = document.getElementById(timerParId);
    this.m = 0;
    this.s = 0;
    this.h = 0;
    this.startTime = 0;
    this.pauseTime = 0;
    this.pauseTimeDiff = 0;
    this.interval = undefined;
  }

  init() {
    this.interval = setInterval(this.tick.bind(this), 1000);
    this.startTime = new Date().getTime();
  }

  getLastTime() {
    const ds = this.s.toString().length === 2 ? this.s : '0' + this.s;
    const dm = this.m.toString().length === 2 ? this.m : '0' + this.m;
    return dm + ':' + ds;
  }

  stop() {
    clearInterval(this.interval);
    this.reset();
    this.startTime = 0;
    this.pauseTime = 0;
    this.pauseTimeDiff = 0;
    this.timerPar.innerText = '00:00';
  }

  pause() {
    clearInterval(this.interval);
    this.pauseTime = new Date().getTime();
  }

  resume() {
    if (this.startTime === 0) {
      this.init();
    } else {
      this.pauseTimeDiff = 1000 - (this.pauseTime - this.startTime) % 1000;
      setTimeout(() => { this.tick(); this.init(); }, this.pauseTimeDiff);
    }
  }

  reset() {
    this.s = 0;
    this.m = 0;
    this.h = 0;
  }

  tick() {
    this.s++;
    if (this.s >= 60) {
      this.s = 0;
      this.m++;
    }
    if (this.m >= 60) {
      this.m = 0;
      this.h++;
    }
    const ds = this.s.toString().length === 2 ? this.s : '0' + this.s;
    const dm = this.m.toString().length === 2 ? this.m : '0' + this.m;
    //const dh = this.h.toString().length === 2 ? this.h : '0' + this.h;
    if (this.h >= 24) {
      this.reset();
    }
    this.timerPar.innerText = /*dh + ':' + */dm + ':' + ds;
  }
}

// game class
class Game {
  constructor(frontCanvas, backCanvas, gameTimer, player) {
    this.currentPlayer = player;
    this.front = frontCanvas;
    this.back = backCanvas;
    this.gameTimer = gameTimer;
    this.TIMER = 2000;
    this.carrentTimer = this.TIMER;
    this.gameMode = 'challenge';
    this.dif = 50;
    this.maxR = 40;
    this.startBTN = 0;
    this.generatorInterval = undefined;
    this.missed = 0;
  }

  startBTNActivation() {
    if (this.startBTN === 0) {
      this.startBTN = 1;
      this.play();
      this.gameTimer.resume();
    } else {
      this.startBTN = 0;
      this.gameTimer.pause();
    }
  }

  rulesCheck() {
    if (this.back.lost !== this.missed) {
      this.missed++;
      this.currentPlayer.health--;
    }
    if (this.currentPlayer.health === 0) {
      this.currentPlayer.saveTime(this.gameTimer.getLastTime());
      this.gameReset();
    }
  }

  gameReset() {
    this.startBTN = 0;
    this.carrentTimer = this.TIMER;
    this.back.reset();
    this.front.reset();
    this.gameTimer.stop();
    this.currentPlayer.playerHealthReset();
    this.missed = 0;
  }

  stopBTNActivation() {
    this.gameReset();
  }

  circlesGeneratorChallenge() {
    if (this.startBTN === 1) {
      setTimeout(this.circlesGeneratorChallenge.bind(this), this.carrentTimer);
      const x = getRandomIntInclusive(this.maxR, this.front.canvas.clientWidth - this.maxR);
      const y = getRandomIntInclusive(this.maxR, this.front.canvas.clientHeight - this.maxR);
      const backColor = this.back.getColorCode();
      this.back.setCircleStyle(backColor, backColor);
      this.front.addArc(x, y);
      this.back.addArc(x, y);
      this.back.draw();
      this.front.draw();
      if (this.carrentTimer > this.dif + 250) {
        if (this.carrentTimer > 700) {
          this.carrentTimer -= this.dif;
        }
        if (this.carrentTimer <= 700) {
          this.carrentTimer -= this.dif / 3;
        }
      }
    }
  }

  animateCircels() {
    const increment = setInterval(() => {
      if (this.startBTN === 0) {
        clearInterval(increment);
      }
      this.back.radiusAnimationControl(this.maxR);
      this.front.radiusAnimationControl(this.maxR);
      this.rulesCheck();
    }, 50);
    this.refreshCanvas60();
  }

  refreshCanvas60() {
    const refresh = setInterval(() => {
      if (this.startBTN === 0) {
        clearTimeout(this.generatorInterval);
        clearInterval(refresh);
      }
      this.back.draw();
      this.front.draw();
    }, 16);
  }

  play() {
    if (!this.currentPlayer.health) {
      this.currentPlayer.init(this.gameMode);
    }
    if (this.startBTN === 1) {
      if (this.gameMode === 'challenge') {
        this.generatorInterval = setTimeout(this.circlesGeneratorChallenge.bind(this), this.carrentTimer);
      }
    }
    this.animateCircels();
  }

  shot(canvas) {
    const target = this.back.checkColor(canvas);
    if (target) {
      const carrentX = this.back.clientXYToCanvasXY(canvas.clientX, canvas.clientY).x;
      const carrentY = this.back.clientXYToCanvasXY(canvas.clientX, canvas.clientY).y;
      this.front.deleteCircle(target);
      this.back.deleteCircle(target);
      this.back.draw();
      this.front.draw();
      this.currentPlayer.addHit(carrentX, carrentY, target);
    } else {
      this.currentPlayer.health -= 1;
      this.rulesCheck();
    }
  }

}

//class ini
const back = new CanvasClass('bg_canvas');
const front = new CanvasClass('fr_canvas');
const gameTimer = new GameTimer('timerText');
const player = new Player();
const game = new Game(front, back, gameTimer, player);

//event Listeners
front.canvas.addEventListener('click', canvas => {
  game.shot(canvas);
});

front.canvas.addEventListener('contextmenu', canvas => {
  const carrentX = back.clientXYToCanvasXY(canvas.clientX, canvas.clientY).x;
  const carrentY = back.clientXYToCanvasXY(canvas.clientX, canvas.clientY).y;
  const pixelColorData = back.ctx.getImageData(carrentX, carrentY, 1, 1).data;
  const r = pixelColorData[0];
  const g = pixelColorData[1];
  const b = pixelColorData[2];
  const carrentColor = '#' + r.toString(16) + g.toString(16) + b.toString(16);
  print(carrentColor, 'carrent color');
});






















