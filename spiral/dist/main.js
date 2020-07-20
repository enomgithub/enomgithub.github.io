(function (p5) {
    'use strict';

    p5 = p5 && Object.prototype.hasOwnProperty.call(p5, 'default') ? p5['default'] : p5;

    /// <reference types="p5/global" />
    var sketch = function (p5) {
        var width = 480;
        var height = 480;
        var centerX = width / 2;
        var centerY = height / 2;
        var radius = centerX / 2;
        var minRadius = 1;
        var maxRadius = centerX * 2 / 3;
        var expandRadius = true;
        var pi = Math.PI;
        var radian = pi / 180;
        var circleNum = 7;
        var angle = 360 / circleNum;
        var theta = 0;
        var colors = [];
        for (var i = 0; i < circleNum; i++) {
            colors.push([
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255),
                // 32
                255
            ]);
        }
        var size = 40;
        var minSize = 1;
        var maxSize = 80;
        var expandSize = true;
        var mode = 0;
        var modeNum = 2;
        // type ToggleKey = (code: number) => void;
        // const toggleKey: ToggleKey = (code) => {
        //   switch(code) {
        //     case 75:
        //       mode++;
        //       mode %= modeNum;
        //       break;
        //     case 74:
        //       mode--;
        //       if (mode < 0) { 
        //         mode += modeNum;
        //       }
        //       break;
        //   }
        // };
        // window.addEventListener("keydown", (event) => {
        //   toggleKey(event.keyCode)
        // }, false);
        p5.setup = function () {
            var canvas = p5.createCanvas(width, height);
            canvas.parent("app");
            // p5.background("#2d7190");
            p5.background("white");
            p5.noStroke();
        };
        p5.draw = function () {
            for (var i = 0; i < circleNum; i++) {
                var _a = colors[i], r = _a[0], g = _a[1], b = _a[2], a = _a[3];
                p5.fill(r, g, b, a);
                p5.ellipse(centerX + radius * Math.cos(((theta + angle * i) % 360) * radian), centerY + radius * Math.sin(((theta + angle * i) % 360) * radian), size, size);
            }
            // p5.ellipse(width / 2, height / 2, size, size);
            if (mode === 0) {
                if (expandRadius) {
                    if (radius < maxRadius) {
                        radius++;
                    }
                    else {
                        expandRadius = false;
                    }
                }
                else {
                    if (radius > minRadius) {
                        radius--;
                    }
                    else {
                        expandRadius = true;
                    }
                }
                size = maxSize * Math.sin(theta * radian) + 1;
            }
            else if (mode === 1) {
                if (expandSize) {
                    if (size < maxSize * radius / 100) {
                        size++;
                    }
                    else {
                        expandSize = false;
                    }
                }
                else {
                    if (size > minSize * radius / 100) {
                        size--;
                    }
                    else {
                        expandSize = true;
                    }
                }
            }
            theta++;
            theta %= 360;
            if (theta % 19 === 0) {
                mode++;
                mode %= modeNum;
            }
        };
    };
    new p5(sketch);

}(p5));
