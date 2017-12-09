/**
 * @license MIT
 * @author enom
 */
"use strict";

// Rain ========================================================================
/**
 * @namespace
 */
let Rain = {};

// Rain.Rain ===================================================================
/**
 * @memberof Rain
 * @constructor
 * @param {number} x - x座標の初期値
 * @param {number} y - y座標の初期値
 * @param {number} size - 雨滴のサイズ
 * @param {number} velocity - 雨滴の落下速度
 * @param {Array.number} xValiations - x座標の配列
 */
Rain.Rain = function(x, y, size, velocity, xValiations) {
  this.x = x;
  this.yBottom = y;
  this.size = size;
  this.yTop = this.yBottom - this.size;
  this.velocity = velocity;
  this.xValiations = xValiations;
  this.counter = 0;
}

// -----------------------------------------------------------------------------
/**
 * count - x座標の配列用のインデックスを動かす
 * @param {Array.number} maxLength - x座標の配列
 */
Rain.Rain.prototype.count = function(maxLength) {
  if (this.counter >= maxLength - 1) {
    this.counter = 0;
  } else {
    this.counter += 1;
  }
}

// -----------------------------------------------------------------------------
/**
 * move
 * @param {number} dx - x方向の移動量
 * @param {number} dy - y方向の移動量
 */
Rain.Rain.prototype.move = function(dx, dy) {
  this.x += dx;
  this.yBottom += dy;
  this.yTop += dy;
}

// -----------------------------------------------------------------------------
/**
 * moveAbs
 * @param {number} x - x座標
 * @param {number} y - y座標
 */
Rain.Rain.prototype.moveAbs = function(x, y) {
  this.x = x;
  this.yBottom = y;
  this.yTop = this.yBottom - this.size;
}

// Rain.Simulator ==============================================================
/**
 * @memberof Rain
 * @constructor
 * @param {number} width - canvasの幅
 * @param {number} height - canvasの高さ
 * @param {string} id - canvasのid
 */
Rain.Simulator = function(width, height, id, bgcolor) {
  this.MS = 16;
  this.VALIATION = 20;

  this.width = width;
  this.height = height;

  this.ctx = document.getElementById(id).getContext('2d');
  this.rains = [];
  this.bgcolor = bgcolor;
}

// -----------------------------------------------------------------------------
/**
* makeRains
* @param {number} n - 作成するRainオブジェクトの数
* @param {number} size - 雨滴のサイズ
* @param {string} color - 雨滴の色（RGBで指定）
*/
Rain.Simulator.prototype.makeRains = function(n, size, color) {
  let rains = [];
  let velocity = size / 8;
  for (let i = 0; i < n; i += 1) {
    let x = Math.random() * this.width;
    let y = Math.random() * this.height;
    let xValiations = [];
    for (let i = 0; i < this.VALIATION; i += 1) {
      xValiations.push(Math.random() * this.width);
    }
    rains.push(new Rain.Rain(x, y, size, velocity, xValiations));
  }
  this.rains.push({"rains": rains, "color": color});
}

// -----------------------------------------------------------------------------
/**
* moveRain
* @param {Array.<Rain>} rains - Rainオブジェクトの配列
*/
Rain.Simulator.prototype.moveRain = function(rains) {
  for (let rain of rains) {
    rain.move(0, rain.velocity);
    if (rain.yTop >= this.height) {
      rain.moveAbs(rain.xValiations[rain.counter], 0);
      rain.count(this.VALIATION);
    }
  }
}

// -----------------------------------------------------------------------------
/**
* drawRains
* @param {Array.<Rain>} rains - Rainオブジェクトの配列
* @param {String} color - 雨滴の色（RGBで指定）
*/
Rain.Simulator.prototype.drawRains = function(rains, color) {
  this.ctx.fillStyle = color;
  for (let rain of rains) {
    this.ctx.beginPath();
    for (let i = 10; i >= 0; i -= 1) {
      let ratio = rain.size * i / 10;
      this.ctx.arc(rain.x, rain.yTop + ratio, ratio / 2, 0, Math.PI * 2, true);
    }
    this.ctx.fill();
  }
}

// -----------------------------------------------------------------------------
/**
 * draw
 */
Rain.Simulator.prototype.draw = function() {
  this.ctx.fillStyle = this.bgcolor;
  this.ctx.fillRect(0, 0, this.width, this.height);

  for (let rains of this.rains) {
    this.drawRains(rains["rains"], rains["color"]);
  }
}

// -----------------------------------------------------------------------------
/**
 * loop
 */
Rain.Simulator.prototype.loop = function() {
  this.draw();
  for (let rains of this.rains) {
    this.moveRain(rains["rains"]);
  }
}

// Rainの変数 ==================================================================
/**
 * @memberof Rain
 */
Rain.simulator;
Rain.timer = null;

// Rainの関数 ==================================================================
/**
 * @memberof Rain
 * run
 */
Rain.run = function() {
  Rain.simulator.loop();
}

// -----------------------------------------------------------------------------
/**
 * @memberof Rain
 * init
 * @param {number} width - canvasの幅
 * @param {number} height - canvasの高さ
 * @param {string} id - canvasのid
 */
Rain.init = function(width, height, ratio, id) {
  document.getElementById(id).width = width;
  document.getElementById(id).height = height;
  Rain.simulator = new Rain.Simulator(width, height, id, 'rgb(13, 0, 21)');
  Rain.simulator.makeRains(40, 12 * ratio, 'rgb(15, 35, 80)');
  Rain.simulator.makeRains(30, 18 * ratio, 'rgb(25, 68, 142)');
  Rain.simulator.makeRains(20, 24 * ratio, 'rgb(0, 123, 187)');
  Rain.simulator.makeRains(10, 30 * ratio, 'rgb(0, 149, 217)');
  Rain.timer = setInterval(Rain.run, Rain.simulator.MS);
}

// -----------------------------------------------------------------------------
/**
 * @memberof Rain
 * stopTimer
 */
Rain.stopTimer = function() {
  if (Rain.timer) {
    clearInterval(Rain.timer);
  }
}
