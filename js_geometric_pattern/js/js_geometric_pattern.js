/**
 * @license MIT
 * @author enom
 */
"use strict";

// GeometricPattern ============================================================
/**
 * @namespace
 */
let GeometricPattern = {};

// GeometricPattern.GeometricPattern ===========================================
/**
 * @memberof GeometricPattern
 * @constructor
 * @param {number} centerx
 * @param {number} centery
 */
GeometricPattern.GeometricPattern = function(centerx, centery) {
  this.D_THETA_MAX = 20;
  this.DEG = 360;
  this.D_PHI = 1;

  this.centerx = centerx;
  this.centery = centery;
  this.r = Math.floor(0.8 * Math.min(this.centerx, this.centery) / 3);
  this.a = Math.floor(0.8 * 2 * Math.min(this.centerx, this.centery) / 3);
  this.phi = 0;
  this.c = 146;
  this.dTheta = 1;
}

// -----------------------------------------------------------------------------
/**
 * changeParameter
 * @param {number} centerx
 * @param {number} centery
 * @param {number} r
 * @param {number} a
 */
GeometricPattern.GeometricPattern.prototype.changeParameter =
function(centerx, centery, r, a) {
  this.centerx = centerx;
  this.centery = centery;
  this.r = r;
  this.a = a;
}

// -----------------------------------------------------------------------------
/**
 * decR - Rの値を減らす
 */
GeometricPattern.GeometricPattern.prototype.decR = function() {
  this.r -= 1;
  if (this.r < 1) {
    this.r = 1;
  }
}

// -----------------------------------------------------------------------------
/**
 * incR - Rの値を増やす
 */
GeometricPattern.GeometricPattern.prototype.incR = function() {
  if (this.r + this.a < Math.min(this.centerx, this.centery)) {
    this.r += 1;
  }
}

// -----------------------------------------------------------------------------
/**
 * decA - Aの値を減らす
 */
GeometricPattern.GeometricPattern.prototype.decA = function() {
  this.a -= 1;
  if (this.a < 1) {
    this.a = 1;
  }
}

// -----------------------------------------------------------------------------
/**
 * incA - Aの値を増やす
 */
GeometricPattern.GeometricPattern.prototype.incA = function() {
  if (this.r + this.a < Math.min(this.centerx, this.centery)) {
    this.a += 1;
  }
}

// -----------------------------------------------------------------------------
/**
 * decC - Cの値を減らす
 */
GeometricPattern.GeometricPattern.prototype.decC = function() {
  this.c -= 1;
  if (this.c < 0) {
    this.c += this.DEG;
  }
}

// -----------------------------------------------------------------------------
/**
 * incC - Cの値を増やす
 */
GeometricPattern.GeometricPattern.prototype.incC = function() {
  this.c += 1;
  if (this.c >= this.DEG) {
    this.c %= this.DEG;
  }
}

// -----------------------------------------------------------------------------
/**
 * decdTheta - dThetaの値を減らす
 */
GeometricPattern.GeometricPattern.prototype.decdTheta = function() {
  this.dTheta -= 1;
  if (this.dTheta < 1) {
    this.dTheta = 1;
  }
}

// -----------------------------------------------------------------------------
/**
 * incdTheta - dThetaの値を増やす
 */
GeometricPattern.GeometricPattern.prototype.incdTheta = function() {
  this.dTheta += 1;
  if (this.dTheta > this.D_THETA_MAX) {
    this.dTheta = this.D_THETA_MAX;
  }
}

// -----------------------------------------------------------------------------
/**
 * decPhi - phiの値を減らす
 */
GeometricPattern.GeometricPattern.prototype.incPhi = function() {
  this.phi += 1;
  if (this.phi >= this.DEG) {
    this.phi %= this.DEG;
  }
}

// -----------------------------------------------------------------------------
/**
 * incPhi - phiの値を増やす
 */
GeometricPattern.GeometricPattern.prototype.getPoints = function() {
  this.points = [];
  for (let theta = 0; theta < this.DEG; theta += this.dTheta) {
    this.points.push([
      Math.floor(this.centerx + this.r*Math.cos(Math.PI * theta / 180)
                 + this.a*Math.cos(Math.PI * (this.phi + theta*this.c) / 180)),
      Math.floor(this.centery + this.r*Math.sin(Math.PI * theta / 180)
                 + this.a*Math.sin(Math.PI * (this.phi + theta*this.c) / 180))
    ]);
  }
  this.points.push(this.points[0]);
}

// GeometricPattern.Simulator ==================================================
/**
 * @memberof GeometricPattern
 * @classdec Simulator - 幾何学模様のアニメーションをシミュレートするクラス
 * @param {number} width - canvasの幅
 * @param {number} height - canvasの高さ
 * @param {string} id - canvasのid
 */
GeometricPattern.Simulator = function(width, height, id) {
  this.MS = 16;

  this.width = width;
  this.height = height;

  this.ctx = document.getElementById(id).getContext("2d");
  this.textR = document.getElementById("r");
  this.textA = document.getElementById("a");
  this.textC = document.getElementById("c");
  this.textdTheta = document.getElementById("dTheta");
  this.textXFormula = document.getElementById("x-formula");
  this.textYFormula = document.getElementById("y-formula");

  this.centerx = Math.floor(width / 2);
  this.centery = Math.floor(height / 2);

  this.gp = new GeometricPattern.GeometricPattern(this.centerx, this.centery);
}

// -----------------------------------------------------------------------------
/**
 * changeArea
 * @param {number} width
 * @param {number} height
 */
GeometricPattern.Simulator.prototype.changeArea = function(width, height) {
  this.width = width;
  this.height = height;
}

// -----------------------------------------------------------------------------
/**
 * draw
 */
GeometricPattern.Simulator.prototype.draw = function() {
  // 背景色で塗りつぶす
  this.ctx.fillStyle = "rgb(48, 40, 51)";
  this.ctx.fillRect(0, 0, this.width, this.height);

  // 幾何学模様の描画
  this.ctx.strokeStyle = "rgb(251, 250, 245)";
  this.ctx.lineWidth = 1;
  this.ctx.beginPath();
  this.ctx.moveTo(this.gp.points[0][0], this.gp.points[0][1]);
  for (let point of this.gp.points){
    this.ctx.lineTo(point[0], point[1]);
  }
  this.ctx.stroke();
}

// -----------------------------------------------------------------------------
/**
 * displayParameter - 各パラメータを表示する
 */
GeometricPattern.Simulator.prototype.displayParameter = function() {
  this.textR.textContent = ("00" + this.gp.r).slice(-3);
  this.textA.textContent = ("00" + this.gp.a).slice(-3);
  this.textC.textContent = ("00" + this.gp.c).slice(-3);
  this.textdTheta.textContent = ("0" + this.gp.dTheta).slice(-2);
  this.textXFormula.textContent =
    "x = " + this.gp.r + " cos theta + "
    + this.gp.a + " cos (" + this.gp.phi +  " + " + this.gp.c + " theta)";
  this.textYFormula.textContent =
    "y = " + this.gp.r + " sin theta + "
    + this.gp.a + " sin (" + this.gp.phi +  " + " + this.gp.c + " theta)";
}

// -----------------------------------------------------------------------------
/**
 * loop
 */
GeometricPattern.Simulator.prototype.loop = function() {
  this.gp.incPhi();
  this.gp.getPoints();
  this.draw();
  this.displayParameter();
}

// GeometricPatternの変数 ======================================================
/**
 * @memberof GeometricPattern
 */
GeometricPattern.simulator;
GeometricPattern.width;
GeometricPattern.height;
GeometricPattern.timer = null;

// GeometricPatternの関数 ======================================================
/**
 * @memberof GeometricPattern
 * @param {number} code - キーボードのキーコード
 */
GeometricPattern.toggleKey = function(code) {
  switch (code) {
    case 90: GeometricPattern.simulator.gp.decR(); break;         // z key
    case 65: GeometricPattern.simulator.gp.incR(); break;         // a key
    case 88: GeometricPattern.simulator.gp.decA(); break;         // x key
    case 83: GeometricPattern.simulator.gp.incA(); break;         // s key
    case 67: GeometricPattern.simulator.gp.decC(); break;         // c key
    case 68: GeometricPattern.simulator.gp.incC(); break;         // d key
    case 86: GeometricPattern.simulator.gp.decdTheta(); break;    // v key
    case 70: GeometricPattern.simulator.gp.incdTheta(); break;    // f key
  }
}

// -----------------------------------------------------------------------------
/**
 * @memberof GeometricPattern
 * run
 */
GeometricPattern.run = function() {
  GeometricPattern.simulator.loop();
}

// -----------------------------------------------------------------------------
/**
 * @memberof GeometricPattern
 * init
 * @param {number} width
 * @param {number} height
 * @param {string} id
 */
GeometricPattern.init = function(width, height, id) {
  GeometricPattern.width = width;
  GeometricPattern.height = height;
  document.getElementById(id).width = GeometricPattern.width;
  document.getElementById(id).height = GeometricPattern.height;
  GeometricPattern.simulator = new GeometricPattern.Simulator(width, height, id);

  window.addEventListener("keydown", function (e) {
    GeometricPattern.toggleKey(e.keyCode);
  }, false);

  GeometricPattern.timer = setInterval(
    GeometricPattern.run,
    GeometricPattern.simulator.MS
  );

  window.addEventListener("resize", function() {
    let width = Math.min(500, document.body.clientWidth);
    if (width < 500 || (GeometricPattern.width < 500 && width == 500)) {
      let height = width;
      let ratio = width / GeometricPattern.width;
      let centerx = Math.floor(width / 2);
      let centery = Math.floor(height / 2);
      let r = Math.max(1, Math.floor(ratio * GeometricPattern.simulator.gp.r));
      let a = Math.max(1, Math.floor(ratio * GeometricPattern.simulator.gp.a));
      document.getElementById(id).width = width;
      document.getElementById(id).height = height;
      GeometricPattern.simulator.changeArea(width, height);
      GeometricPattern.simulator.gp.changeParameter(centerx, centery, r, a);
      GeometricPattern.width = width;
      GeometricPattern.height = height;
    }
  }, false);
}

// 実行部 ======================================================================
GeometricPattern.init(
  Math.min(500, document.body.clientWidth),
  Math.min(500, document.body.clientWidth),
  "geometric-pattern"
);
