
import { getRandomIntInclusive } from './library.js';

export default class CanvasClass {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvasId = canvasId;
    this.circlesXYandColor = new Array();
    this.circlesStyles = { colorborder: '#000000', colorfill: '#FFFFFF' };
    this.usedColors = ['#00FF00', '#eb4034', '#000000', '#ffffff'];
    this.lost = 0;
  }

  radiusAnimationControl(maxR) {
    this.circlesXYandColor.forEach(circle => {
      if (circle.r === 2) {
        circle.inc = true;
      } else if (circle.r === maxR) {
        circle.inc = false;
      }
      if (circle.inc === true) {
        circle.r += 1;
      } else {
        circle.r -= 1;
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
    this.usedColors = ['#00FF00', '#eb4034', '#000000', '#ffffff'];
    this.lost = 0;
  }
}
