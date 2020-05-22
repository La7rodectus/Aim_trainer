
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
  datawrap.innerHTML = string + ' ____' + discriptoin + '<br>';


}


//canvas class

class CanvasClass {
  constructor(canvasId) {
    // eslint-disable-next-line no-undef
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.globalAlpha = 1;
    this.circlesXYandColor = new Array();
    this.circlesStyles = { colorborder: '#00FF00', colorfill: '#eb4034' };
    this.usedColors = ['#00FF00', '#eb4034', '#000000', '#ffffff'];
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
    print(carrentColor, 'this.checkColor');
    return res;
  }

  addArc(x, y, r = 2) {
    const color = this.circlesStyles.colorfill;
    const colorBorder = this.circlesStyles.colorborder;
    this.circlesXYandColor.push({ x, y, color, colorBorder, r });
    this.usedColors.push(color);
    //print(color, 'доданий колір');
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.resize();
    this.circlesXYandColor.forEach(circle => {
      this.ctx.strokeStyle = circle.colorBorder;
      this.ctx.fillStyle = circle.color;
      //print(circle.color, 'draw');
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
}



//ini
const back = new CanvasClass('bg_canvas');
const front = new CanvasClass('fr_canvas');


//generator
function circlesGenerator(front, back, maxR = 40) {
  const x = getRandomIntInclusive(maxR, front.canvas.clientWidth - maxR);
  const y = getRandomIntInclusive(maxR, front.canvas.clientHeight - maxR);
  const backColor = back.getColorCode();
  back.setCircleStyle(backColor, backColor);
  front.addArc(x, y, 40);
  back.addArc(x, y, 40);
  back.draw();
  front.draw();
}
//events
front.canvas.addEventListener('click', (canvas) => {
  const target = back.checkColor(canvas);
  if (target !== undefined) {
    //print(target.color, 'hit');
    front.deleteCircle(target);
    back.deleteCircle(target);
  }
  circlesGenerator(front, back);
  //print('end', '-------');
});

front.canvas.addEventListener('contextmenu', (canvas) => {
  const carrentX = back.clientXYToCanvasXY(canvas.clientX, canvas.clientY).x;
  const carrentY = back.clientXYToCanvasXY(canvas.clientX, canvas.clientY).y;
  const pixelColorData = back.ctx.getImageData(carrentX, carrentY, 1, 1).data;
  const r = pixelColorData[0];
  const g = pixelColorData[1];
  const b = pixelColorData[2];
  const carrentColor = '#' + r.toString(16) + g.toString(16) + b.toString(16);
  print(carrentColor, 'carrent color');
});





















