/// <reference types="p5/global" />

import p5 from "p5"; 

const sketch = (p5: p5) => {
  const width = 480;
  const height= 480;

  const centerX = width / 2;
  const centerY = height / 2;
  let radius = centerX / 2;
  const minRadius = 1;
  const maxRadius = centerX * 2 / 3;
  let expandRadius = true;

  const pi = Math.PI;
  const radian = pi / 180;
  const circleNum = 7;
  const angle = 360 / circleNum;
  let theta = 0;

  const colors: number[][] = [];
  for (let i = 0; i < circleNum; i++) {
    colors.push([
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      // 32
      255
    ]);
  }

  let size = 40;
  const minSize = 1;
  const maxSize = 80;
  let expandSize = true;

  let mode = 0;
  const modeNum = 2;

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

  p5.setup = () => {
    const canvas = p5.createCanvas(width, height);
    canvas.parent("app");
    // p5.background("#2d7190");
    p5.background("white");
    p5.noStroke();
  };

  p5.draw = () => {
    for (let i = 0; i < circleNum; i++) {
      const [r, g, b, a] = colors[i];
      p5.fill(r, g, b, a);
      p5.ellipse(
        centerX + radius * Math.cos(((theta + angle * i) % 360) * radian),
        centerY + radius * Math.sin(((theta + angle * i) % 360) * radian),
        size,
        size
      );
    }
    // p5.ellipse(width / 2, height / 2, size, size);
    if (mode === 0) {
      if (expandRadius) {
        if (radius < maxRadius) {
          radius++;
        } else {
          expandRadius = false;
        }
      } else {
        if (radius > minRadius) {
          radius--;
        } else {
          expandRadius = true;
        }
      }
      size = maxSize * Math.sin(theta * radian) + 1;
    } else if (mode === 1) {
      if (expandSize) {
        if (size < maxSize * radius / 100) {
          size++;
        } else {
          expandSize = false;
        }
      } else {
        if (size > minSize * radius / 100) {
          size--;
        } else {
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