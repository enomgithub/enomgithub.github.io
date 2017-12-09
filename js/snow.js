/**
 * @license MIT
 * @author enom
 */
"use strict";

// Snow ========================================================================
/**
 * @namespace
 */
let Snow = {};

// Snow.Snow ===================================================================
/**
 * @memberof snow
 * @constructor
 * @param {number} x - x座標の初期値
 * @param {number} y - y座標の初期値
 * @param {number} vx - x方向の速度
 * @param {number} vy - y方向の速度
 * @param {number} size - 雪のサイズ
 */
Snow.Snow = function(x, y, vx, vy, size) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.size = size;
}

// -----------------------------------------------------------------------------
/**
 * move
 * @param {number} dx - x方向の移動量
 * @param {number} dy - y方向の移動量
 */
Snow.Snow.prototype.move = function(dx, dy) {
  this.x += dx;
  this.y += dy;
}

// -----------------------------------------------------------------------------
/**
 * moveAbs
 * @param {number} x - x座標
 * @param {number} y - y座標
 */
Snow.Snow.prototype.moveAbs = function(x, y) {
  this.x = x;
  this.y = y;
}

// Snow.Simulator ===================================================================
/**
 * @memberof Snow
 * @constructor
 * @param {number} width - canvasの幅
 * @param {number} height - canvasの高さ
 * @param {string} id - canvasのid
 */
Snow.Simulator = function(width, height, id) {
  this.MS = 16;

  this.width = width;
  this.height = height;

  this.ctx = document.getElementById(id).getContext('2d');
  this.snows = [];
}

// -----------------------------------------------------------------------------
/**
 * makeSnows
 * @param {number} n - 作成するSnowオブジェクトの数
 * @param {number} size - 雪のサイズ
 * @param {number} vx - x方向の速度
 * @param {number} vy - y方向の速度
 * @param {string} color - 雪の色（RGBで指定）
 */
Snow.Simulator.prototype.makeSnows = function(n, size, vx, vy, color) {
  let snows = [];
  for (let i = 0; i < n; i += 1) {
    let x = (Math.random() * this.width)|0;
    let y = (Math.random() * this.height)|0;
    snows.push(new Snow.Snow(x, y, vx, vy, size));
  }
  this.snows.push({"snows": snows, "color": color});
}

// -----------------------------------------------------------------------------
/**
 * moveSnows
 * @param {Array.<Snow>} snows - Snowオブジェクトの配列
 */
Snow.Simulator.prototype.moveSnows = function(snows) {
  for (let snow of snows) {
    let x = ((Math.random() * snow.vx) + 1)|0;
    let y = ((Math.random() * snow.vy) + 1)|0;
    snow.move(x, y);
    if (snow.x >= this.width) {
      snow.moveAbs(0, snow.y);
    }
    if (snow.y >= this.height) {
      snow.moveAbs(snow.x, 0);
    }
  }
}

// -----------------------------------------------------------------------------
/**
 * drawSnows
 * @param {Array.<Snow>} snows - Snowオブジェクトの配列
 * @param {string} color - 雪の色（RGBで指定）
 */
Snow.Simulator.prototype.drawSnows = function(snows, color) {
  this.ctx.fillStyle = color;
  for (let snow of snows) {
    this.ctx.beginPath();
    this.ctx.arc(snow.x, snow.y, snow.size / 2, 0, Math.PI * 2, true);
    this.ctx.fill();
  }
}

// -----------------------------------------------------------------------------
/**
 * draw
 */
Snow.Simulator.prototype.draw = function() {
//  this.ctx.globalAlpha = 0.8;
  this.ctx.fillStyle = 'rgb(13, 0, 21)';
  this.ctx.fillRect(0, 0, this.width, this.height);

  for (let snows of this.snows) {
    this.drawSnows(snows["snows"], snows["color"]);
  }
}

// -----------------------------------------------------------------------------
/**
 * loop
 */
Snow.Simulator.prototype.loop = function() {
  this.draw();
  for (let snows of this.snows) {
    this.moveSnows(snows["snows"]);
  }
}

// Snowの変数 ==================================================================
Snow.simulator;
Snow.timer = null;

// Snowの関数 ==================================================================
/**
 * @memberof Snow
 * run
 */
Snow.run = function() {
  Snow.simulator.loop();
}

// -----------------------------------------------------------------------------
/**
 * @memberof Snow
 * init
 * @param {number} width - canvasの幅
 * @param {number} height - canvasの高さ
 * @param {number} ratio - 拡大比率
 * @param {string} id - canvasのid
 */
Snow.init = function(width, height, ratio, id) {
  document.getElementById(id).width = width;
  document.getElementById(id).height = height;
  let vx = 3 * ratio;
  let vy = 5 * ratio;
  Snow.simulator = new Snow.Simulator(width, height, id);
  Snow.simulator.makeSnows(40, 4 * ratio, vx, vy, 'rgb(160, 160, 160)');
  Snow.simulator.makeSnows(30, 10 * ratio, vx, vy, 'rgb(192, 192, 192)');
  Snow.simulator.makeSnows(20, 16 * ratio, vx, vy, 'rgb(224, 224, 224)');
  Snow.simulator.makeSnows(10, 22 * ratio, vx, vy, 'rgb(255, 255, 255)');
  Snow.timer = setInterval(Snow.run, Snow.simulator.MS);
}

// -----------------------------------------------------------------------------
/**
 * @memberof Snow
 * stopTimer
 */
Snow.stopTimer = function() {
  if (Snow.timer) {
    clearInterval(Snow.timer);
  }
}
