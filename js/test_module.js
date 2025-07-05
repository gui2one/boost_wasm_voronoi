console.log("test_module.js");

import { BuildDiagram } from "../main.js";

let canvas = document.createElement("canvas");

canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);

let coords = [];
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    coords.push(i * 100 + Math.random() * 10);
    coords.push(j * 100 + Math.random() * 10);
  }
}
BuildDiagram(canvas, coords);
