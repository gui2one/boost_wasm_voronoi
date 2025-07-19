console.log("test_module.js");

import {
  BuildDiagram,
  display_cells,
  display_vertices,
  Vertex,
  ColorWithAlpha,
} from "../main.js";

let canvas = document.createElement("canvas");

let mouse_down = false;
let mouse_moved = false;
let enable_add_point = true;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
let vertices_color = new ColorWithAlpha(0, 0, 0, 0.9);
let sites_color = new ColorWithAlpha(0, 0, 0, 0.9);
document.body.appendChild(canvas);
let coords = [];
let sites: Vertex[] = [];
for (let i = 0; i < 3000; i++) {
  sites.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  });
}
function add_point(x, y) {
  sites.push({ x: x, y: y });
}

function init() {
  // console.clear();
  let diagram = BuildDiagram(sites, [0, 0, canvas.width, canvas.height]);

  if (ctx === null) {
    console.error("Rendering context is null");
    return;
  }
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  display_cells(diagram.cells, ctx);
  display_vertices(diagram.vertices, ctx, vertices_color, 5);
  // display_vertices(sites, ctx);
}
init();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

canvas.addEventListener("click", (e) => {
  if (mouse_moved) return;

  add_point(e.offsetX, e.offsetY);
  init();
});
canvas.addEventListener("mousedown", (e) => {
  mouse_down = true;
  mouse_moved = false;
});

canvas.addEventListener("mouseup", (e) => {
  mouse_down = false;
});

canvas.addEventListener("mousemove", (e) => {
  mouse_moved = true;
  if (!mouse_down) return;

  if (enable_add_point) {
    add_point(e.offsetX, e.offsetY);
    init();
    setTimeout(() => {
      enable_add_point = true;
    }, 30);
  }

  // reset
  enable_add_point = false;
});
