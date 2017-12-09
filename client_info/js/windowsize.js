/**
 * @license MIT
 * @author enom
 */
"use strict";

// WindowSize ================================================================
/**
 * @namespace
 */
let WindowSize = {};

// WindowSizeの関数 ===========================================================
/**
 * @memberof WindowSize
 * showWindowSize
 */
WindowSize.showWindowSize = function() {
  document.getElementById("window-outer").textContent = (
    window.outerWidth + " X " + window.outerHeight
  );
  document.getElementById("window-inner").textContent = (
    window.innerWidth + " X " + window.innerHeight
  );
}

// -----------------------------------------------------------------------------
/**
 * @memberof WindowSize
 * init
 */
WindowSize.init = function() {
  WindowSize.showWindowSize();
  window.addEventListener("resize", function() {
    WindowSize.showWindowSize();
  }, false);
}

// 実行部 ======================================================================
WindowSize.init();
