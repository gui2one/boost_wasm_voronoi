// @ts-ignore
import Voronoi from "./boost_voronoi.js";

// import { string_to_u8array } from "./utils.js";

let voronoi = await Voronoi();
// let pts = [];
let canvas = document.createElement("canvas");
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;
function init() {
  const numPoints = 50;
  const coords = new Float32Array(numPoints * 2);
  for (let i = 0; i < coords.length; i++) {
    coords[i] = Math.random() * 256;
  }

  // Allocate memory in WASM heap
  const bytes = coords.length * coords.BYTES_PER_ELEMENT;
  const ptr = voronoi._malloc(bytes);

  // Copy JS data to WASM heap
  voronoi.HEAPF32.set(coords, ptr / 4); // divide by coords.BYTES_PER_ELEMENT ?!!

  // Call the raw binding
  const diagram = voronoi._build_diagram(ptr, coords.length);

  // Read fields using getValue
  const numVertices = voronoi.getValue(diagram, "i64"); // offset +0
  const numEdges = voronoi.getValue(diagram + 4, "i64"); // offset +24
  const numCells = voronoi.getValue(diagram + 8, "i64"); // offset +24

  const verticesPtr = voronoi.getValue(diagram + 12, "*");

  for (let i = 0; i < numVertices; i++) {
    const base = verticesPtr / 8 + i * 2; // double = 8 bytes
    const x = voronoi.HEAPF64[base];
    const y = voronoi.HEAPF64[base + 1];
    console.log(`Vertex ${i}: ${x}, ${y}`);
  }

  console.log("numVertices : ", numVertices);
  console.log("numEdges : ", numEdges);
  console.log("numCells : ", numCells);

  console.log(voronoi);

  // Free memory
  voronoi._free(ptr);

  display_coords(coords);
}

function display_coords(coords) {
  for (let i = 0; i < coords.length; i += 2) {
    console.log(coords[i], coords[i + 1]);
    ctx?.fillRect(coords[i], coords[i + 1], 1, 1);
  }
}

init();

document.addEventListener("click", () => {
  console.clear();
  init();
});
