// @ts-ignore
import Voronoi from "./boost_voronoi.js";

import { string_to_u8array } from "./utils.js";

let voronoi = await Voronoi();
let pts = [];
let canvas = document.createElement("canvas");
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;
function init() {
  const numPoints = 200;
  const coords = new Float32Array(numPoints * 2);
  for (let i = 0; i < coords.length; i++) {
    coords[i] = Math.random() * 256;
  }

  // Allocate memory in WASM heap
  const bytes = coords.length * coords.BYTES_PER_ELEMENT;
  const ptr = voronoi._malloc(bytes);

  // Copy JS data to WASM heap
  voronoi.HEAPF32.set(coords, ptr / 4);

  // Call the raw binding
  const diagram = voronoi._build_diagram(ptr, coords.length);

  // Free memory
  voronoi._free(ptr);
}

init();

document.addEventListener("click", () => {
  console.clear();
  init();
});
