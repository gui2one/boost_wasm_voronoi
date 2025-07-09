console.log("test_module.js");

import { BuildDiagram, display_cells } from "../main.js";

let canvas = document.createElement("canvas");

canvas.width = 512;
canvas.height = 512;
let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
let coords = [];

function add_point(x, y) {
  coords.push(x);
  coords.push(y);
}

function init() {
  // for (let i = 0; i < 15; i++) {
  //   for (let j = 0; j < 15; j++) {
  //     coords.push(Math.random() * 512);
  //     coords.push(Math.random() * 512);
  //   }
  // }
  let diagram = BuildDiagram(coords);
  console.log(diagram);
  if (ctx === null) {
    console.error("Rendering context is null");
    return;
  }
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  display_cells(diagram.cells, ctx);
}
init();

document.addEventListener("click", () => {
  console.clear();
  init();
});

window.addEventListener("resize", () => {
  init();
});

canvas.addEventListener("click", (e) => {
  add_point(e.offsetX, e.offsetY);
  init();
});
