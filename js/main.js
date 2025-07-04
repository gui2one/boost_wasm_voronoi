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
  const numPoints = 10;
  const coords = new Float32Array(numPoints * 2);
  for (let i = 0; i < coords.length; i++) {
    coords[i] = Math.random() * 256;
    // coords[i] = i;
  }
  console.log(coords);

  // Allocate memory in WASM heap
  const bytes = coords.length * coords.BYTES_PER_ELEMENT;
  const ptr = voronoi._malloc(bytes);

  // Copy JS data to WASM heap
  voronoi.HEAPF32.set(coords, ptr / 4); // divide by coords.BYTES_PER_ELEMENT ?!!

  // Call the raw binding
  const diagram = voronoi._build_diagram(ptr, coords.length);

  // Read fields using getValue
  const numVertices = voronoi.getValue(diagram, "i64"); // offset +0
  const vertices = voronoi.getValue(diagram + 8, "*"); // offset +8
  const numEdges = voronoi.getValue(diagram + 16, "i64"); // offset +24
  const edgesPtr = voronoi.getValue(diagram + 24, "*"); // offset +16
  // const cellsPtr = voronoi.getValue(diagram + 32, "*"); // offset +32
  // const numCells = voronoi.getValue(diagram + 40, "i64"); // offset +40

  console.log("numVertices : ", numVertices);
  console.log("vertices : ", vertices);
  console.log("numEdges : ", numEdges);
  // console.log("numCells : ", numCells);

  console.log(voronoi);

  // Free memory
  voronoi._free(ptr);
}

init();

document.addEventListener("click", () => {
  console.clear();
  init();
});
