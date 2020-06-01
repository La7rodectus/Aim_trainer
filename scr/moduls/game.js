/* eslint-disable max-len */

import { getRandomIntInclusive } from './library.js';

export default class Game {
  constructor(frontCanvas, backCanvas, gameTimer, player) {
    this.pauseScreen = document.getElementById('pause');
    this.overScreen = document.getElementById('game-over');
    this.currentPlayer = player;
    this.front = frontCanvas;
    this.back = backCanvas;
    this.gameTimer = gameTimer;
    this.carrentTimer = 1500;
    this.gameMode = 'challenge';
    this.dif = 50;
    this.maxR = 40;
    this.startBTN = 0;
    this.generatorInterval = undefined;
    this.missed = 0;
    this.hits = 0;
    this.gameStage = 0; // ['stop', 'pause', 'resume', 'play', 'gameover']
  }

  ini() {
    this.front.canvas.onclick = this.shot.bind(this);
    document.getElementById('startStop').onclick = this.startBTNActivation.bind(this);
    document.getElementById('stop').onclick = this.stopBTNActivation.bind(this);
    document.getElementById('confirm-btn').onclick = this.setFrontColorStyle.bind(this);
    this.pauseScreen.onclick = this.startBTNActivation.bind(this);
    this.overScreen.onclick = this.startBTNActivation.bind(this);
  }

  showPauseScreen() {
    this.pauseScreen.style.display = 'inline-flex';
    this.pauseScreen.classList.add('show');
  }

  hidePauseScreen() {
    this.pauseScreen.style.display = 'none';
    this.pauseScreen.classList.remove('show');
  }

  startBTNActivation() {
    if (this.startBTN === 0) {
      this.hidePauseScreen();
      this.gameOverScreenHide();
      this.startBTN = 1;
      this.play();
      this.gameTimer.resume();
      setTimeout(() => {
        this.front.canvas.onmouseleave = this.mouseOutIvent.bind(this);
      }, 1000);
    } else {
      this.front.canvas.removeAttribute('onmouseleave');
      this.showPauseScreen();
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
      this.currentPlayer.saveGameSessions(this.gameTimer.getLastTime(), this.hits);
      this.gameReset();
      this.gameOverScreenShow();
    }
  }

  gameOverScreenShow() {
    this.overScreen.style.zIndex = 5;
    const index = this.currentPlayer.gameSessions.length - 1;
    const lastTime = this.currentPlayer.gameSessions[index];
    let speed = lastTime.hits / (lastTime.time.m * 60 + lastTime.time.s);
    if (speed !== 0) {
      speed = '<br> Hits/sec = ' + speed.toFixed(3);
    } else {
      speed = '<br> not ur best try';
    }
    this.overScreen.innerHTML = 'Game Over <br>' + lastTime.time.m + ':' + lastTime.time.s + speed;
    this.overScreen.classList.add('show');
  }

  gameOverScreenHide() {
    this.overScreen.style.zIndex = 1;
    this.overScreen.classList.remove('show');
  }

  gameReset() {
    this.startBTN = 0;
    this.carrentTimer = 1500;
    this.back.reset();
    this.front.reset();
    this.gameTimer.stop();
    this.currentPlayer.playerHealthReset();
    this.missed = 0;
    this.hits = 0;
    this.gameOverScreenHide();
    this.hidePauseScreen();
  }

  stopBTNActivation() {
    this.gameReset();
  }

  mouseOutIvent() {
    if (this.startBTN === 1) {
      setTimeout(() => {
        this.front.canvas.removeAttribute('onmouseleave');
        this.showPauseScreen();
        this.startBTN = 0;
        this.gameTimer.pause();
      }, 500);
    }
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
          this.carrentTimer -= this.dif / 8;
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
    if (this.startBTN === 0) {
      window.cancelAnimationFrame(this);
    }
    this.back.draw();
    this.front.draw();
    window.requestAnimationFrame(this.refreshCanvas60.bind(this));
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

  setFrontColorStyle() {
    const inputFillHex = document.getElementById('colorfillinput');
    const inputBorderHex = document.getElementById('colorborderinput');
    const message = document.getElementById('message');
    const sevenSymbols = document.getElementById('seven');
    const firstSymdol = document.getElementById('first');
    let validarionLevel = 0;
    message.style.display = 'block';
    if (inputBorderHex.value.length === 7 && inputFillHex.value.length === 7) {
      sevenSymbols.classList.add('valid');
      sevenSymbols.classList.remove('invalid');
      validarionLevel++;
    }
    if (inputBorderHex.value.split('')[0] === '#' && inputFillHex.value.split('')[0] === '#') {
      firstSymdol.classList.add('valid');
      firstSymdol.classList.remove('invalid');
      validarionLevel++;
    }
    if (validarionLevel === 2) {
      message.style.display = 'none';
      sevenSymbols.classList.remove('valid');
      firstSymdol.classList.remove('valid');
      firstSymdol.classList.add('invalid');
      sevenSymbols.classList.add('invalid');
      this.front.setCircleStyle(inputBorderHex.value, inputFillHex.value);
      inputBorderHex.value = '';
      inputFillHex.value = '';
    }

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
      this.hits++;
    } else {
      this.currentPlayer.health--;
      this.rulesCheck();
    }
  }

}

