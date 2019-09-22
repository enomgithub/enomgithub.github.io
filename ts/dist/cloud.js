"use strict";
var Cloud;
(function (Cloud_1) {
    var timer;
    var simulator;
    function isCollided(x1, y1, size1, x2, y2, size2) {
        var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        if (distance <= (size1 + size2) / 2) {
            return true;
        }
        else {
            return false;
        }
    }
    function getAverage(array) {
        return array.reduce(function (accumulator, currentValue) { return accumulator + currentValue; }) / array.length;
    }
    var Particle = /** @class */ (function () {
        function Particle(x, y, size) {
            this.x = x;
            this.y = y;
            this.size = size;
        }
        Particle.prototype.move = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        Particle.prototype.moveAbs = function (x, y) {
            this.x = x;
            this.y = y;
        };
        return Particle;
    }());
    var Cloud = /** @class */ (function () {
        function Cloud(particles, vx, vy, colorTop, colorBottom) {
            this.particles = particles;
            this.vx = vx;
            this.vy = vy;
            this.colorTop = colorTop;
            this.colorBottom = colorBottom;
        }
        return Cloud;
    }());
    var Simulator = /** @class */ (function () {
        function Simulator(width, height, id, bgcolor) {
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
            this.bgcolor = bgcolor;
            this.clouds = [];
        }
        Simulator.prototype.isCollided = function (particle1, particle2) {
            return isCollided(particle1.x, particle1.y, particle1.size, particle2.x, particle2.y, particle2.size);
        };
        Simulator.prototype.getCounters = function (particles) {
            var counters = [];
            for (var i = 0; i < particles.length; i += 1) {
                var counter = 0;
                for (var j = 0; j < particles.length; j += 1) {
                    if (this.isCollided(particles[i], particles[j])) {
                        counter += 1;
                    }
                }
                counters.push(counter);
            }
            return counters;
        };
        Simulator.prototype.changeSize = function (particles) {
            var counters = this.getCounters(particles);
            var counterAverage = getAverage(counters);
            for (var i = 0; i < particles.length; i += 1) {
                particles[i].size = particles[i].size * counters[i] / counterAverage;
            }
        };
        Simulator.prototype.makeCloud = function (n, size, colorTop, colorBottom) {
            if (n <= 0) {
                return;
            }
            var particles = [];
            var x = Math.random() * this.width;
            var y = Math.random() * this.height;
            var v = size / 64;
            particles.push(new Particle(x, y, size));
            // 雲のまとまり感を出すために、作成済みのParticleの近くに新しいParticleを作成する
            for (var i = 1; i < n; i += 1) {
                var choice = particles[Math.floor(Math.random() * particles.length)];
                var x_1 = choice.x + Math.random() * 2 * size - size;
                var y_1 = choice.y + (Math.random() * 2 * size - size) / 2;
                particles.push(new Particle(x_1, y_1, size));
            }
            // 雲の端部の不自然さの解消と、雲のボリューム感を出すために、
            // Particle同士の重なり具合によって、各Particleのsizeを調整する。
            this.changeSize(particles);
            this.clouds.push(new Cloud(particles, v, 0, colorTop, colorBottom));
        };
        Simulator.prototype.moveCloud = function (cloud) {
            for (var _i = 0, _a = cloud.particles; _i < _a.length; _i++) {
                var particle = _a[_i];
                particle.move(cloud.vx, cloud.vy);
                if (particle.x >= this.width) {
                    particle.moveAbs(particle.x % this.width, particle.y);
                }
                if (particle.y >= this.height) {
                    particle.moveAbs(particle.x, particle.y % this.height);
                }
            }
        };
        Simulator.prototype.drawCloud = function (cloud) {
            for (var _i = 0, _a = cloud.particles; _i < _a.length; _i++) {
                var particle = _a[_i];
                var grad = this.ctx.createLinearGradient(particle.x, particle.y - particle.size / 2, particle.x, particle.y + particle.size / 2);
                grad.addColorStop(0, cloud.colorTop);
                grad.addColorStop(1, cloud.colorBottom);
                this.ctx.fillStyle = grad;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2, true);
                this.ctx.fill();
            }
        };
        Simulator.prototype.draw = function () {
            this.ctx.fillStyle = this.bgcolor;
            this.ctx.fillRect(0, 0, this.width, this.height);
            for (var _i = 0, _a = this.clouds; _i < _a.length; _i++) {
                var cloud = _a[_i];
                this.drawCloud(cloud);
            }
        };
        Simulator.prototype.loop = function () {
            this.draw();
            for (var _i = 0, _a = this.clouds; _i < _a.length; _i++) {
                var cloud = _a[_i];
                this.moveCloud(cloud);
            }
        };
        return Simulator;
    }());
    function run() {
        simulator.loop();
    }
    function init(width, height, ratio, layer, n, id) {
        if (ratio === void 0) { ratio = 1; }
        if (layer === void 0) { layer = 4; }
        if (n === void 0) { n = 20; }
        var canvas = document.getElementById(id);
        if (canvas !== null) {
            canvas.width = width;
            canvas.height = height;
        }
        else {
            throw new Error("Did not get Canvas element. Maybe, " + id + " is not Canvas element id.");
        }
        var bgcolor = "rgba(44, 169, 225, 1.0";
        var colorTop = "rgba(247, 252, 254, 0.1";
        var colorBottom = "rgba(133, 185, 203, 0.1";
        simulator = new Simulator(width, height, id, bgcolor);
        for (var i = 0; i < layer; i += 1) {
            var quantity = (i + 1) * n;
            var size = (36 - (layer - i) * 6) * ratio;
            for (var j = 0; j < layer - i; j += 1) {
                simulator.makeCloud(quantity, size, colorTop, colorBottom);
            }
        }
        timer = setInterval(run, simulator.ms);
    }
    Cloud_1.init = init;
    function stopTimer() {
        if (timer) {
            clearInterval(timer);
        }
    }
    Cloud_1.stopTimer = stopTimer;
})(Cloud || (Cloud = {}));
