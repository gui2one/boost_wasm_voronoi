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
  voronoi.HEAPF32.set(coords, ptr / 2);

  // Call the raw binding
  const diagram = voronoi._build_diagram(ptr, coords.length);

  // Read fields using getValue
  const verticesPtr = voronoi.getValue(ptr, "*"); // offset +0
  const numVertices = voronoi.getValue(ptr + 4, "i32"); // offset +4
  const edgesPtr = voronoi.getValue(ptr + 8, "*"); // offset +8
  const numEdges = voronoi.getValue(ptr + 12, "i32"); // offset +12
  const cellsPtr = voronoi.getValue(ptr + 16, "*"); // offset +16
  const numCells = voronoi.getValue(ptr + 20, "i32"); // offset +20

  console.log("numVertices : ", numVertices);
  console.log("numEdges : ", numEdges);
  console.log("numCells : ", numCells);

  // Free memory
  voronoi._free(ptr);
}

init();

document.addEventListener("click", () => {
  console.clear();
  init();
});
