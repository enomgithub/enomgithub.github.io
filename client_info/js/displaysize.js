/**
 * @license MIT
 * @author enom
 */
"use strict";

// DisplaySize ================================================================
/**
 * @namespace
 */
let DisplaySize = {};


// DisplaySizeの関数 ===========================================================
/**
 * @memberof DisplaySize
 * showDisplaySize
 */
DisplaySize.showDisplaySize = function() {
  let width = window.parent.screen.width;
  let height = window.parent.screen.height;
  document.getElementById("display").textContent = width + " X " + height;
}

// -----------------------------------------------------------------------------
/**
 * @memberof DisplaySize
 * init
 */
DisplaySize.init = function() {
  DisplaySize.showDisplaySize();
}

// 実行部 ======================================================================
DisplaySize.init();
