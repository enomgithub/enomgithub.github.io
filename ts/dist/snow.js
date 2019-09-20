"use strict";
var Snow;
(function (Snow_1) {
    var Snow = /** @class */ (function () {
        function Snow(x, y, vx, vy, size) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.size = size;
        }
        Snow.prototype.move = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        Snow.prototype.moveAbs = function (x, y) {
            this.x = x;
            this.y = y;
        };
        return Snow;
    }());
    var Simulator = /** @class */ (function () {
        function Simulator(width, height, id) {
            this.ms = 16;
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
            this.snows = [];
        }
        Simulator.prototype.makeSnows = function (n, size, vx, vy, color) {
            var snows = [];
            for (var i = 0; i < n; i += 1) {
                var x = (Math.random() * this.width) | 0;
                var y = (Math.random() * this.height) | 0;
                snows.push(new Snow(x, y, vx, vy, size));
            }
            this.snows.push({ "snows": snows, "color": color });
        };
        Simulator.prototype.moveSnows = function (snows) {
            for (var _i = 0, snows_1 = snows; _i < snows_1.length; _i++) {
                var snow = snows_1[_i];
                var x = ((Math.random() * snow.vx) + 1) | 0;
                var y = ((Math.random() * snow.vy) + 1) | 0;
                snow.move(x, y);
                if (snow.x >= this.width) {
                    snow.moveAbs(0, snow.y);
                }
                if (snow.y >= this.height) {
                    snow.moveAbs(snow.x, 0);
                }
            }
        };
        Simulator.prototype.drawSnows = function (snows, color) {
            this.ctx.fillStyle = color;
            for (var _i = 0, snows_2 = snows; _i < snows_2.length; _i++) {
                var snow = snows_2[_i];
                this.ctx.beginPath();
                this.ctx.arc(snow.x, snow.y, snow.size / 2, 0, Math.PI * 2, true);
                this.ctx.fill();
            }
        };
        Simulator.prototype.draw = function () {
            this.ctx.fillStyle = "rgb(13, 0, 21)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            for (var _i = 0, _a = this.snows; _i < _a.length; _i++) {
                var snows = _a[_i];
                this.drawSnows(snows["snows"], snows["color"]);
            }
        };
        Simulator.prototype.loop = function () {
            this.draw();
            for (var _i = 0, _a = this.snows; _i < _a.length; _i++) {
                var snows = _a[_i];
                this.moveSnows(snows["snows"]);
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
        var vx = 3 * ratio;
        var vy = 5 * ratio;
        simulator = new Simulator(width, height, id);
        simulator.makeSnows(40, 4 * ratio, vx, vy, "rgb(160, 160, 160");
        simulator.makeSnows(30, 10 * ratio, vx, vy, "rgb(192, 192, 192");
        simulator.makeSnows(20, 16 * ratio, vx, vy, "rgb(224, 224, 224");
        simulator.makeSnows(10, 22 * ratio, vx, vy, "rgb(255, 255, 255");
        timer = setInterval(run, simulator.ms);
    }
    Snow_1.init = init;
    function stopTimer() {
        if (timer) {
            clearInterval(timer);
        }
    }
    Snow_1.stopTimer = stopTimer;
})(Snow || (Snow = {}));
