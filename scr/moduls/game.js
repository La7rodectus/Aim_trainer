/* eslint-disable max-len */

//byField for array sort
//regCellBorderColor - change Password and Login borger-color
//regMsg - short msg on reg div
//getRandomIntInclusive fn
import { getRandomIntInclusive,  byField, regCellBorderColor, regMsg } from './library.js';

//canvas class
import CanvasClass from './CanvasClass.js';

//player class
import Player from './player.js';

//timer class
import GameTimer from './gameTimer.js';

export default class Game {
  constructor() {
    this.pauseScreen = document.getElementById('pause');
    this.overScreen = document.getElementById('game-over');
    this.hitSound = new Audio('../media/audio/hit.mp3');
    this.missSound = new Audio('../media/audio/miss.mp3');
    this.currentPlayer = new Player();
    this.front = new CanvasClass('fr_canvas');
    this.back = new CanvasClass('bg_canvas');
    this.gameTimer = new GameTimer('timerText');
    this.currentTimer = 1500;
    this.gameMode = 'challenge';
    this.sound = false;
    this.dif = 50;
    this.maxR = 40;
    this.generatorInterval = undefined;
    this.pauseDiffId = undefined;
    this.missed = 0;
    this.hits = 0;
    this.gameStage = 'stop'; // ['stop', 'pause', 'resume', 'play']
  }

  ini() {
    const confirmBtnReg = document.getElementById('confirm-btn-reg');
    confirmBtnReg.onclick = () => this.login();
    document.getElementById('startStop').onclick = () => this.startBTNActivation();
    document.getElementById('stop').onclick = () => this.gameReset();
    document.getElementById('confirm-btn').onclick = () => this.setFrontColorStyle();
    document.getElementById('checkbox').onclick = () => this.muteBTNAction();
    document.getElementById('reg').onclick = () => this.showReg();
    document.getElementById('confirm-btn-reg').onclick = () => this.login();
    document.getElementById('reg-btn').onclick = () => this.openRegFrom();
    this.currentPlayer.setNick();
    this.getScoreboard();
    document.onkeyup = e => {
      if (e.key === 'Escape') {
        this.hideReg();
      } else if (e.key === 'Enter' && confirmBtnReg.value === 'Sing in') {
        this.login();
      } else if (e.key === 'Enter' && confirmBtnReg.value === 'Cancel') {
        this.regNewUser();
      }
    };

  }

  showReg() {
    if (this.gameStage === 'play') {
      this.pause();
    }
    const regDiv = document.getElementById('regDiv');
    regCellBorderColor();
    document.getElementById('password').value = '';
    document.getElementById('login').value = '';
    regDiv.style.display = 'flex';

  }

  hideReg() {
    document.getElementById('regDiv').style.display = 'none';
    this.cancelRegFrom();
  }

  cancelRegFrom() {
    document.getElementById('confirm-btn-reg').onclick = () => this.login();
    document.getElementById('reg-btn').onclick = () => this.openRegFrom();
    document.getElementById('confirm-btn-reg').value = 'Sign in';
    document.getElementById('mail').style.display = 'none';
    document.getElementById('regHidePar').style.display = 'none';
  }

  openRegFrom() {
    document.getElementById('confirm-btn-reg').onclick = () => this.cancelRegFrom();
    document.getElementById('reg-btn').onclick = () => this.regNewUser();
    document.getElementById('confirm-btn-reg').value = 'Cancel';
    document.getElementById('mail').style.display = 'block';
    document.getElementById('regHidePar').style.display = 'block';
  }

  regNewUser() {
    const mail = document.getElementById('mail').value;
    const password = document.getElementById('password').value;
    const login = document.getElementById('login').value;
    if (login && password && mail) {
      const sendOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName: `${login}`, password, mail }),
      };
      fetch('/regNewUser', sendOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === 'valid, nick free') {
            regCellBorderColor('green');
            regMsg('Added ' + data.nick + ' glhf');
            document.getElementById('confirm-btn-reg').style.display = 'block';
            this.cancelRegFrom();
          } else {
            regCellBorderColor('red');
          }
        })
        .catch(err => console.log(err));
    } else {
      regCellBorderColor('red');
    }
  }

  login() {
    const password = document.getElementById('password').value;
    const login = document.getElementById('login').value;
    if (login && password) {
      const sendOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName: `${login}`, password }),
      };
      fetch('/checkUserLogAndPass', sendOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === 'valid, login successful') {
            this.currentPlayer.setNick(data.nick);
            regCellBorderColor('green');
            regMsg('Login seccesful, hello ' + data.nick);
            this.gameReset();
            this.currentPlayer.getBestResalt();
          } else {
            regCellBorderColor('red');
          }
        })
        .catch(err => console.log(err));
    } else {
      regCellBorderColor('red');
    }
  }

  getScoreboard() {
    const sendOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    fetch('/getScoreboard', sendOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const scoreboardDiv = document.getElementById('scoreboard');
        scoreboardDiv.innerHTML = '';
        data.scoreboard.sort(byField('time')).reverse();
        data.scoreboard.forEach(player => {
          scoreboardDiv.innerHTML += '<p>' + player.nick + ' : ' + player.time + ' sec <br>';
        });
      })
      .catch(err => console.log(err));
  }

  muteBTNAction() {
    if (this.sound === false) {
      document.getElementById('tusz').innerText = 'Tyts to turn off sound';
      this.sound = true;
    } else {
      this.sound = false;
      document.getElementById('tusz').innerText = 'Tyts to turn on sound';
    }

  }

  showPauseScreen() {
    this.pauseScreen.style.display = 'inline-flex';
    this.pauseScreen.classList.add('show');
    this.pauseScreen.onclick = () => this.resume();
  }

  hidePauseScreen() {
    this.pauseScreen.style.display = 'none';
    this.pauseScreen.classList.remove('show');
    this.pauseScreen.onclick = null;
  }

  startBTNActivation() {
    if (this.gameStage === 'stop') {
      this.play();
      setTimeout(() => {
        this.front.canvas.onmouseleave = this.mouseOutIvent.bind(this);
      }, 1000);
    } else if (this.gameStage === 'pause') {
      this.resume();
      setTimeout(() => {
        this.front.canvas.onmouseleave = this.mouseOutIvent.bind(this);
      }, 1000);
    } else if (this.gameStage === 'play') {
      this.pause();
    }
  }

  pause() {
    if (this.gameStage !== 'pause') {
      this.front.canvas.onclick = null;
      this.gameStage = 'pause';
      this.showPauseScreen();
      this.gameTimer.pause();
      clearTimeout(this.generatorInterval);
      clearTimeout(this.pauseDiffId);
    }
  }

  resume() {
    const pauseTimerDif = this.gameTimer.getPauseTimeDiff();
    this.pauseDiffId = setTimeout(() => {
      const x = getRandomIntInclusive(this.maxR, this.front.canvas.clientWidth - this.maxR);
      const y = getRandomIntInclusive(this.maxR, this.front.canvas.clientHeight - this.maxR);
      const backColor = this.back.getColorCode();
      this.back.setCircleStyle(backColor, backColor);
      this.front.addArc(x, y);
      this.back.addArc(x, y);
      this.back.draw();
      this.front.draw();
      this.timerItervalCorrection();
      this.generatorInterval = setTimeout(this.circlesGeneratorChallenge.bind(this), this.currentTimer);
    }, pauseTimerDif);
    this.front.canvas.onclick = () => this.shot();
    this.hidePauseScreen();
    this.gameOverScreenHide();
    this.animateCircels();
    this.gameTimer.resume();
    this.gameStage = 'play';
  }

  play() {
    this.currentPlayer.init(this.gameMode);
    if (this.gameMode === 'challenge') {
      this.generatorInterval = setTimeout(this.circlesGeneratorChallenge.bind(this), this.currentTimer);
    }
    this.front.canvas.onclick = this.shot.bind(this);
    this.hidePauseScreen();
    this.gameOverScreenHide();
    this.animateCircels();
    this.gameTimer.resume();
    this.gameStage = 'play';
  }

  rulesCheck() {
    if (this.back.lost !== this.missed) {
      this.missed++;
      this.currentPlayer.health--;
      if (this.sound) {
        this.missSound.currentTime = 0;
        this.missSound.play();
      }
    }
    if (this.currentPlayer.health === 0) {
      this.currentPlayer.saveGameSessions(this.gameTimer.getLastTime(), this.hits);
      this.gameReset();
      this.gameOverScreenShow();
      setTimeout(() => {
        this.currentPlayer.getBestResalt();
        this.getScoreboard();
      }, 2000);
    }
  }

  gameOverScreenShow() {
    this.overScreen.style.zIndex = 5;
    const lastTime = this.currentPlayer.gameSessions[this.currentPlayer.gameSessions.length - 1];
    const speed = lastTime.speed;
    this.overScreen.innerHTML = 'Game Over <br>' + lastTime.time.m + ':' + lastTime.time.s + speed + '<br> shoot to try again';
    this.overScreen.classList.add('show');
    this.currentPlayer.printResult();
    setTimeout(() => {
      this.overScreen.onclick = this.startBTNActivation.bind(this);
    }, 2000);
  }

  gameOverScreenHide() {
    this.overScreen.style.zIndex = 1;
    this.overScreen.classList.remove('show');
    this.overScreen.onclick = null;
  }

  gameReset() {
    this.front.canvas.onclick = null;
    this.front.canvas.onmouseleave = null;
    this.gameStage = 'stop';
    this.currentTimer = 1500;
    this.back.reset();
    this.front.reset();
    this.gameTimer.stop();
    this.currentPlayer.playerHealthReset();
    this.missed = 0;
    this.hits = 0;
    this.gameOverScreenHide();
    this.hidePauseScreen();
    clearTimeout(this.generatorInterval);
    clearTimeout(this.pauseDiffId);
  }

  mouseOutIvent() {
    if (this.gameStage === 'play') {
      this.pause();
    }
  }

  timerItervalCorrection() {
    if (this.currentTimer > this.dif + 300) {
      if (this.currentTimer > 700) {
        this.currentTimer -= this.dif;
      }
      if (this.currentTimer <= 700) {
        this.currentTimer -= this.dif / 5;
      }
    }
  }

  circlesGeneratorChallenge() {
    const x = getRandomIntInclusive(this.maxR, this.front.canvas.clientWidth - this.maxR);
    const y = getRandomIntInclusive(this.maxR, this.front.canvas.clientHeight - this.maxR);
    const backColor = this.back.getColorCode();
    this.back.setCircleStyle(backColor, backColor);
    this.front.addArc(x, y);
    this.back.addArc(x, y);
    this.back.draw();
    this.front.draw();
    this.timerItervalCorrection();
    this.generatorInterval = setTimeout(this.circlesGeneratorChallenge.bind(this), this.currentTimer);
  }

  animateCircels() {
    const increment = setInterval(() => {
      if (this.gameStage === 'pause' || this.gameStage === 'stop') {
        clearInterval(increment);
      }
      this.back.radiusAnimationControl(this.maxR);
      this.front.radiusAnimationControl(this.maxR);
      this.rulesCheck();
    }, 50);
    this.refreshCanvas60();
  }

  refreshCanvas60() {
    if (this.gameStage === 'pause' || this.gameStage === 'stop') {
      window.cancelAnimationFrame(this);
    }
    this.back.draw();
    this.front.draw();
    window.requestAnimationFrame(this.refreshCanvas60.bind(this));
  }

  setFrontColorStyle() {
    const inputFillHex = document.getElementById('colorfillinput');
    const inputBorderHex = document.getElementById('colorborderinput');
    const message = document.getElementById('message');
    const sevenSymbols = document.getElementById('seven');
    const firstSymdol = document.getElementById('first');
    let validarionLevel = 0;
    message.style.display = 'block';
    message.classList.remove('hide');
    message.classList.add('showToOpa1');
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
    } else {
      setTimeout(() => {
        message.classList.add('hide');
      }, 5000);
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
      if (this.sound) {
        this.hitSound.currentTime = 0;
        this.hitSound.play();
      }

    } else {
      this.currentPlayer.health--;
      this.rulesCheck();
      if (this.sound) {
        this.missSound.currentTime = 0;
        this.missSound.play();
      }

    }
  }

}

