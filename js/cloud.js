/**
 * @license MIT
 * @author enom
 */
"use strict";

// Cloud =======================================================================
/**
 * @namespace
 */
let Cloud = {};

// Cloudの変数 =================================================================
/**
 * @memberof Cloud
 */
Cloud.timer = null;
Cloud.simulator;

// Cloudの関数 =================================================================
/**
 * @memberof Cloud
 * isCollided - 円同士が接触しているか判定する
 * @param {number} x1 - 1つ目の円のx座標
 * @param {number} y1 - 1つ目の円のy座標
 * @param {number} size1 - 1つ目の円の直径
 * @param {number} x2 - 2つ目の円のx座標
 * @param {number} y2 - 2つ目の円のy座標
 * @param {number} size2 - 2つ目の円の直径
 * @return {bool}
 */
Cloud.isCollided = function(x1, y1, size1, x2, y2, size2) {
  let distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  if (distance <= (size1 + size2) / 2) {
    return true;
  } else {
    return false;
  }
}

// -----------------------------------------------------------------------------
/**
 * @memberof Cloud
 * getAverage - 数値の配列の平均を返す
 * @param {Array.number} array
 * @return {number}
 */
Cloud.getAverage = function(array) {
  let counter = 0;
  for (let item of array) {
    counter += item;
  }
  return counter / array.length;
}

// Cloud.Particle ==============================================================
/**
 * @memberof Cloud
 * @classdesc Particle - 雲を構成する粒子のクラス
 * @constructor
 * @param {number} x - x座標の初期値
 * @param {number} y - y座標の初期値
 * @param {number} size - 雲のサイズ
 */
Cloud.Particle = function(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
}

// -----------------------------------------------------------------------------
/**
 * move - Particleを相対的に移動させる
 * @param {number} dx - x方向の移動量
 * @param {number} dy - y方向の移動量
 */
Cloud.Particle.prototype.move = function(dx, dy) {
  this.x += dx;
  this.y += dy;
}

// -----------------------------------------------------------------------------
/**
 * moveAbs - particleを絶対座標で移動させる
 * @param {number} x - x座標
 * @param {number} y - y座標
 */
Cloud.Particle.prototype.moveAbs = function(x, y) {
  this.x = x;
  this.y = y;
}

// Cloud.Cloud =================================================================
/**
 * @memberof Cloud
 * @classdesc Cloud - 雲のクラス
 * @param {number} vx
 * @param {number} vy
 * @param {string} colorTop - Particleが描く円の上端の色
 * @param {string} colorBottom - Particleが描く円の下端の色
 */
Cloud.Cloud = function(particles, vx, vy, colorTop, colorBottom) {
  this.particles = particles;
  this.vx = vx;
  this.vy = vy;
  this.colorTop = colorTop;
  this.colorBottom = colorBottom;
}

// Cloud.Simulator =============================================================
/**
 * @memberof Cloud
 * @classdesc Simulator - 雲のアニメーションをシミュレートするクラス
 * @constructor
 * @param {number} width - canvasの幅
 * @param {number} height - canvasの高さ
 * @param {string} id - canvasのid
 * @param {number} bgcolor - canvasの背景色
 */
Cloud.Simulator = function(width, height, id, bgcolor, ratio) {
  this.MS = 16;

  this.width = width;
  this.height = height;

  this.ctx = document.getElementById(id).getContext('2d');
  this.bgcolor = bgcolor;
  this.clouds = [];
}

// -----------------------------------------------------------------------------
/**
 * getCounters - Particle同士の重なりの数を配列で返す
 * @param {Array.<Particle>} particles
 * @return {Array.number}
 */
Cloud.Simulator.prototype.getCounters = function(particles) {
  let counters = [];
  for (let i = 0; i < particles.length; i += 1) {
    let counter = 0;
    for (let j = 0; j < particles.length; j += 1) {
      if (Cloud.isCollided(particles[i].x, particles[i].y, particles[i].size,
                          particles[j].x, particles[j].y, particles[j].size)) {
        counter += 1;
      }
    }
    counters.push(counter);
  }
  return counters;
}

// -----------------------------------------------------------------------------
/**
 * changeSize - Particle同士の重なりの数によってParticleのsizeを変更する
 * 多く重なっているほどsizeを大きくする
 * @param {Array.<Particle>} particles
 */
Cloud.Simulator.prototype.changeSize = function(particles) {
  let counters = this.getCounters(particles);
  let counterAverage = Cloud.getAverage(counters);
  for (let i = 0; i < particles.length; i += 1) {
    particles[i].size = particles[i].size * counters[i] / counterAverage;
  }
}

// -----------------------------------------------------------------------------
/**
 * makeCloud - n個のParticleオブジェクトを持つCloudオブジェクトを
 * this.clouds配列に追加する
 * @param {number} n - 作成するCloudオブジェクトの数
 * @param {number} size - 雲のサイズ
 * @param {string} colorTop - Particleの上端の色（RGBで指定）
 * @param {string} colorBottom - Particleの下端の色（RGBで指定）
 */
Cloud.Simulator.prototype.makeCloud = function(n, size, colorTop, colorBottom) {
  if (n <= 0) {
    return;
  }

  let particles = [];
  let x = Math.random() * this.width;
  let y = Math.random() * this.height;
  let v = size / 64;
  particles.push(new Cloud.Particle(x, y, size));

  // 雲のまとまり感を出すために、作成済みのParticleの近くに新しいParticleを作成する
  for (let i = 1; i < n; i += 1) {
    let choice = particles[Math.floor(Math.random() * particles.length)];
    x = choice.x + Math.random() * 2 * size - size;
    y = choice.y + (Math.random() * 2 * size - size) / 2;
    particles.push(new Cloud.Particle(x, y, size));
  }

  // 雲の端部の不自然さの解消と、雲のボリューム感を出すために、
  // Particle同士の重なり具合によって、各Particleのsizeを調整する。
  this.changeSize(particles);

  this.clouds.push(new Cloud.Cloud(particles, v, 0, colorTop, colorBottom));
}

// -----------------------------------------------------------------------------
/**
 * moveCloud - 雲の移動。Particleがcanvasの領域をはみ出したらループする
 */
Cloud.Simulator.prototype.moveCloud = function(cloud) {
  for (let particle of cloud.particles) {
    particle.move(cloud.vx, cloud.vy);

    if (particle.x >= this.width) {
      particle.moveAbs(particle.x % this.width, particle.y);
    }
    if (particle.y >= this.height) {
      particle.moveAbs(particle.x, particle.y % this.height);
    }
  }
}

// -----------------------------------------------------------------------------
/**
 * drawCloud - 雲の描画
 * @param {<Cloud>} cloud
 */
Cloud.Simulator.prototype.drawCloud = function(cloud) {
  for (let particle of cloud.particles) {
    // 真上から光が当たっているように描画する
    let grad = this.ctx.createLinearGradient(
      particle.x, particle.y - particle.size / 2,
      particle.x, particle.y + particle.size / 2
    );
    grad.addColorStop(0, cloud.colorTop);
    grad.addColorStop(1, cloud.colorBottom);
    this.ctx.fillStyle = grad;

    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size / 2,
                 0, Math.PI * 2, true);
    this.ctx.fill();
  }
}

// -----------------------------------------------------------------------------
/**
 * draw - 背景とそれぞれの雲の描画
 */
Cloud.Simulator.prototype.draw = function() {
  this.ctx.globalAlpha = 1;
  this.ctx.fillStyle = this.bgcolor;
  this.ctx.fillRect(0, 0, this.width, this.height);

  this.ctx.globalAlpha = 0.1;
  for (let cloud of this.clouds) {
    this.drawCloud(cloud);
  }
}

// -----------------------------------------------------------------------------
/**
 * loop - アニメーションのメインループ
 */
Cloud.Simulator.prototype.loop = function() {
  this.draw();
  for (let cloud of this.clouds) {
    this.moveCloud(cloud);
  }
}


// Cloudの関数 =================================================================
/**
 * @memberof Cloud
 * run - アニメーションを行う
 */
Cloud.run = function() {
  Cloud.simulator.loop();
}

// -----------------------------------------------------------------------------
/**
 * @memberof Cloud
 * init
 * @param {number} width - canvasの幅
 * @param {number} height - canvasの高さ
 * @param {number} ratio - 拡大比率
 * @param {number} layer - 層の数
 * @param {number} n - Particleの個数
 * @param {string} id - canvasのid
 */
Cloud.init = function(width, height, ratio=1, layer=4, n=20, id) {
  document.getElementById(id).width = width;
  document.getElementById(id).height = height;

  let bgcolor = 'rgb(44, 169, 225)';         // 天色
  let colorTop = 'rgb(247, 252, 254)';       // 卯の花色
  let colorBottom = 'rgb(132, 185, 203)';    // 浅縹
  Cloud.simulator = new Cloud.Simulator(width, height, id, bgcolor, ratio);

  // 描画しやすくするため、奥の雲から作成していく
  // また、処理を軽くするため、奥の雲ほどParticleの数を少なくする
  for (let i = 0; i < layer; i += 1) {
    let quantity = (i + 1) * n;
    let size = (36 - (layer - i) * 6) * ratio;
    for (let j = 0; j < layer - i; j += 1) {
      Cloud.simulator.makeCloud(quantity, size, colorTop, colorBottom);
    }
  }
  Cloud.timer = setInterval(Cloud.run, Cloud.simulator.MS);
}

// -----------------------------------------------------------------------------
/**
 * @memberof Cloud
 * stopTimer - アニメーションを停止する
 */
Cloud.stopTimer = function() {
  if (Cloud.timer) {
    clearInterval(Cloud.timer);
  }
}
