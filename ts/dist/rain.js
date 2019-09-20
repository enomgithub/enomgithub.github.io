"use strict";
var Rain;
(function (Rain_1) {
    var Rain = /** @class */ (function () {
        function Rain(x, y, size, velocity, xValiations) {
            this.x = x;
            this.size = size;
            this.yBottom = y;
            this.yTop = this.yBottom - this.size;
            this.velocity = velocity;
            this.xValiations = xValiations;
            this.counter = 0;
        }
        Rain.prototype.count = function (maxLength) {
            if (this.counter >= maxLength) {
                this.counter = 0;
            }
            else {
                this.counter += 1;
            }
        };
        Rain.prototype.move = function (dx, dy) {
            this.x += dx;
            this.yBottom += dy;
            this.yTop += dy;
        };
        Rain.prototype.moveAbs = function (x, y) {
            this.x = x;
            this.yBottom = y;
            this.yTop = this.yBottom - this.size;
        };
        return Rain;
    }());
    var Simulator = /** @class */ (function () {
        function Simulator(width, height, id, bgcolor) {
            this.ms = 16;
            this.valiation = 20;
            this.width = width;
            this.height = height;
            var canvas = document.getElementById(id);
            if (canvas !== null) {
                var ctx = canvas.getContext("2d");
                if (ctx !== null) {
                    this.ctx = ctx;
                }
                else {
                    throw new Error("Something wrong");
                }
            }
            else {
                throw new Error("Something wrong");
            }
            this.rains = [];
            this.bgcolor = bgcolor;
        }
        Simulator.prototype.makeRains = function (n, size, color) {
            var rains = [];
            var velocity = size / 8;
            for (var i = 0; i < n; i += 1) {
                var x = Math.random() * this.width;
                var y = Math.random() * this.height;
                var xValiations = [];
                for (var j = 0; j < this.valiation; j += 1) {
                    xValiations.push(Math.random() * this.width);
                }
                rains.push(new Rain(x, y, size, velocity, xValiations));
            }
            this.rains.push({ "rains": rains, "color": color });
        };
        Simulator.prototype.moveRain = function (rains) {
            for (var _i = 0, rains_1 = rains; _i < rains_1.length; _i++) {
                var rain = rains_1[_i];
                rain.move(0, rain.velocity);
                if (rain.yTop >= this.height) {
                    rain.moveAbs(rain.xValiations[rain.counter], 0);
                    rain.count(this.valiation);
                }
            }
        };
        Simulator.prototype.drawRains = function (rains, color) {
            this.ctx.fillStyle = color;
            for (var _i = 0, rains_2 = rains; _i < rains_2.length; _i++) {
                var rain = rains_2[_i];
                this.ctx.beginPath();
                for (var i = 10; i >= 0; i -= 1) {
                    var ratio = rain.size * i / 10;
                    this.ctx.arc(rain.x, rain.yTop + ratio, ratio / 2, 0, Math.PI * 2, true);
                }
                this.ctx.fill();
            }
        };
        Simulator.prototype.draw = function () {
            this.ctx.fillStyle = this.bgcolor;
            this.ctx.fillRect(0, 0, this.width, this.height);
            for (var _i = 0, _a = this.rains; _i < _a.length; _i++) {
                var rains = _a[_i];
                this.drawRains(rains["rains"], rains["color"]);
            }
        };
        Simulator.prototype.loop = function () {
            this.draw();
            for (var _i = 0, _a = this.rains; _i < _a.length; _i++) {
                var rains = _a[_i];
                this.moveRain(rains["rains"]);
            }
        };
        return Simulator;
    }());
    var simulator;
    var timer;
    function run() {
        simulator.loop();
    }
    function init(width, height, ratio, id) {
        var canvas = document.getElementById(id);
        if (canvas !== null) {
            canvas.width = width;
            canvas.height = height;
        }
        else {
            throw new Error("Something wrong");
        }
        simulator = new Simulator(width, height, id, "rgb(13, 0, 21");
        simulator.makeRains(40, 12 * ratio, "rgb(15, 35, 80");
        simulator.makeRains(30, 18 * ratio, "rgb(25, 68, 142");
        simulator.makeRains(20, 24 * ratio, "rgb(0, 123, 187");
        simulator.makeRains(10, 30 * ratio, "rgb(0, 149, 217");
        timer = setInterval(run, simulator.ms);
    }
    Rain_1.init = init;
    function stopTimer() {
        if (timer) {
            clearInterval(timer);
        }
    }
    Rain_1.stopTimer = stopTimer;
})(Rain || (Rain = {}));
