console.log("test_module.js");

import {
  BuildDiagram,
  display_cells,
  display_vertices,
  Vertex,
} from "../main.js";

let canvas = document.createElement("canvas");

let mouse_down = false;
let add_sample = true;
canvas.width = 512;
canvas.height = 512;
let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
let coords = [];
let sites: Vertex[] = [];
for (let i = 0; i < 3; i++) {
  sites.push({ x: Math.random() * 512, y: Math.random() * 512 });
  // coords.push(Math.random() * 512);
  // coords.push(Math.random() * 512);
}
function add_point(x, y) {
  sites.push({ x: x, y: y });
  // coords.push(x);
  // coords.push(y);
}

function init() {
  console.clear();
  let diagram = BuildDiagram(sites);
  // console.log(diagram);
  if (ctx === null) {
    console.error("Rendering context is null");
    return;
  }
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  display_cells(diagram.cells, ctx);
  // display_vertices(diagram.vertices, ctx);
  display_coords(coords, ctx);
}
init();

function display_coords(coords, ctx) {
  // ctx?.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  for (let i = 0; i < coords.length; i += 2) {
    // console.log(coords[i], coords[i + 1);
    ctx?.fillRect(coords[i] - 1, coords[i + 1] - 1, 3, 3);
  }
}
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
  if (add_sample) {
    setTimeout(() => {
      add_point(e.offsetX, e.offsetY);
      init();
      add_sample = true;
    }, 30);
  }

  // reset
  add_sample = false;
});
