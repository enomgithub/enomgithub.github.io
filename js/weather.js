/**
 * @license MIT
 * @author enom
 */
"use strict";

const WIDTH = 960;
const CANVAS_ID = "weather";
const SNOW_ID = "snow";
const RAIN_ID = "rain";
const CLOUD_ID = "cloud";
const LAYER = 3;
const N = 50;

let width;
let height;
let ratio;
let n = Math.floor(Math.random() * 3);

let getCanvasSize = function() {
  width = document.body.clientWidth;
  height = Math.floor(width / 6);
  ratio = width / WIDTH;
}

getCanvasSize();

if (n == 0) {
  document.getElementById(SNOW_ID).checked = true;
  Snow.init(width, height, ratio, CANVAS_ID);
} else if (n == 1) {
  document.getElementById(RAIN_ID).checked = true;
  Rain.init(width, height, ratio, CANVAS_ID);
} else {
  document.getElementById(CLOUD_ID).checked = true;
  Cloud.init(width, height, ratio, LAYER, N, CANVAS_ID);
}

document.getElementById(SNOW_ID).addEventListener("change", function() {
  if (document.getElementById(SNOW_ID).checked) {
    Cloud.stopTimer();
    Rain.stopTimer();
    Snow.init(width, height, ratio, CANVAS_ID);
  }
}, false);

document.getElementById(RAIN_ID).addEventListener("change", function() {
  if (document.getElementById(RAIN_ID).checked) {
    Cloud.stopTimer();
    Snow.stopTimer();
    Rain.init(width, height, ratio, CANVAS_ID);
  }
}, false);

document.getElementById(CLOUD_ID).addEventListener("change", function() {
  if (document.getElementById(CLOUD_ID).checked) {
    Snow.stopTimer();
    Rain.stopTimer();
    Cloud.init(width, height, ratio, LAYER, N, CANVAS_ID);
  }
}, false);

window.addEventListener("resize", function() {
  getCanvasSize();
  if (document.getElementById(SNOW_ID).checked) {
    Snow.stopTimer();
    Snow.init(width, height, ratio, CANVAS_ID);
  } else if (document.getElementById(RAIN_ID).checked) {
    Rain.stopTimer();
    Rain.init(width, height, ratio, CANVAS_ID);
  } else {
    Cloud.stopTimer();
    Cloud.init(width, height, ratio, LAYER, N, CANVAS_ID);
  }
}, false);
