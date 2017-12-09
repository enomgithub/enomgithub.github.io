/**
 * @license MIT
 * @author enom
 */
"use strict";

// BrowserName ================================================================
/**
 * @namespace
 */
let BrowserName = {};

// BrowserNameの関数 ===========================================================
/**
 * @memberof BrowserName
 * showBrowserName
 */
BrowserName.showBrowserName = function() {
  let userAgent = window.navigator.userAgent.toLowerCase();
  let browserName = "";
  if (userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1) {
    browserName = "Internet Explorer";
  } else if (userAgent.indexOf("edge") != -1) {
    browserName = "Edge";
  } else if (userAgent.indexOf("chrome") != -1) {
    browserName = "Chrome";
  } else if (userAgent.indexOf("safari") != -1) {
    browserName = "Safari";
  } else if (userAgent.indexOf("firefox") != -1) {
    browserName = "Firefox";
  } else if (userAgent.indexOf("opera") != -1) {
    browserName = "Opera";
  } else if (userAgent.indexOf("iphone") != -1) {
    browserName = "iPhone";
  } else if (userAgent.indexOf("iPad") != -1) {
    browserName = "iPad";
  } else if (userAgent.indexOf("android") != -1) {
    browserName = "Android";
  } else {
    browserName = "Others";
  }
  document.getElementById("browser").textContent = browserName;
}

// -----------------------------------------------------------------------------
/**
 * @memberof BrowserName
 * init
 */
BrowserName.init = function() {
  BrowserName.showBrowserName();
}

// 実行部 ======================================================================
BrowserName.init();
