console.log("test_module.js");

import { BuildDiagram, display_cells } from "../main.js";

let canvas = document.createElement("canvas");

let mouse_down = false;
canvas.width = 512;
canvas.height = 512;
let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
let coords = [];
for (let i = 0; i < 15; i++) {
  coords.push(Math.random() * 512);
  coords.push(Math.random() * 512);
}
function add_point(x, y) {
  coords.push(x);
  coords.push(y);
}

function init() {
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

// document.addEventListener("click", () => {
//   console.clear();
//   init();
// });

window.addEventListener("resize", () => {
  init();
});

canvas.addEventListener("mousedown", (e) => {
  mouse_down = true;
});

canvas.addEventListener("mouseup", (e) => {
  mouse_down = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (!mouse_down) return;
  add_point(e.offsetX, e.offsetY);
  init();
});
