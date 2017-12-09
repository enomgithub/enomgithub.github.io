/**
 * @license MIT
 * @author enom
 */
"use strict";

// BodySize ===================================================================
/**
 * @namespace
 */
let BodySize = {};

// BodySizeの関数 ==============================================================
/**
 * @memberof BodySize
 * showBodySize
 */
BodySize.showBodySize = function() {
  let width = document.body.clientWidth;
  let height = document.body.clientHeight;
  document.getElementById("body").textContent = width + " X " + height;
}

// -----------------------------------------------------------------------------
/**
 * @memberof BodySize
 * init
 */
BodySize.init = function() {
  BodySize.showBodySize();
  window.addEventListener("resize", function() {
    BodySize.showBodySize();
  }, false);
}

// 実行部 ======================================================================
BodySize.init();
