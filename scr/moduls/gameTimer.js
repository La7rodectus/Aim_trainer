
export default class GameTimer {
  constructor(timerParId) {
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
    return { m: dm, s: ds };
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
