// @ts-nocheck
import Voronoi from "./boost_voronoi.js";

// import { string_to_u8array } from "./utils.js";

let voronoi = await Voronoi();

const HEAPU32 = voronoi.HEAPU32; // for size_t and pointers (4 bytes)
const HEAPF64 = voronoi.HEAPF64; // for double (8 bytes)
const HEAPU8 = voronoi.HEAPU8; // for byte-wise work (if needed)
// let pts = [];
let ctx;
let canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.width = 512;
canvas.height = 512;
function init() {
  const numPoints = 500;
  const coords = new Float32Array(numPoints * 2);
  for (let i = 0; i < coords.length; i++) {
    coords[i] = Math.random() * 512;
  }

  // Allocate memory in WASM heap
  const bytes = coords.length * coords.BYTES_PER_ELEMENT;
  const ptr = voronoi._malloc(bytes);

  // Copy JS data to WASM heap
  voronoi.HEAPF32.set(coords, ptr / 4); // divide by coords.BYTES_PER_ELEMENT ?!!

  // Call the raw binding
  const diagram = voronoi._build_diagram(ptr, coords.length);

  let data = getMeshData(diagram);
  // console.log(data);

  // Free memory
  voronoi._free(ptr);

  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  display_coords(coords);
  display_vertices(data.vertices);
  display_edges(data.edges);
}

function display_coords(coords) {
  // ctx?.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  for (let i = 0; i < coords.length; i += 2) {
    // console.log(coords[i], coords[i + 1]);
    ctx?.fillRect(coords[i] - 1, coords[i + 1] - 1, 3, 3);
  }
}

function display_vertices(vertices) {
  ctx.fillStyle = "green";
  for (let i = 0; i < vertices.length; i++) {
    // console.log(coords[i], coords[i + 1]);
    ctx?.fillRect(vertices[i].x - 1, vertices[i].y - 1, 3, 3);
  }
}

function display_edges(edges) {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  for (let i = 0; i < edges.length; i++) {
    ctx.moveTo(edges[i].vertex0.x, edges[i].vertex0.y);
    ctx.lineTo(edges[i].vertex1.x, edges[i].vertex1.y);
  }
  ctx.closePath();
  ctx.stroke();
}

function getMeshData(meshPtr) {
  const num_vertices = HEAPU32[meshPtr >> 2];
  const num_edges = HEAPU32[(meshPtr >> 2) + 1];
  const num_cells = HEAPU32[(meshPtr >> 2) + 2];

  const verticesPtr = HEAPU32[(meshPtr >> 2) + 3];
  const edgesPtr = HEAPU32[(meshPtr >> 2) + 4];
  const cellsPtr = HEAPU32[(meshPtr >> 2) + 5];

  const vertices = [];
  for (let i = 0; i < num_vertices; i++) {
    const base = (verticesPtr >> 3) + i * 2; // double-aligned
    const x = HEAPF64[base];
    const y = HEAPF64[base + 1];
    vertices.push({ x, y });
  }

  const edges = [];
  for (let i = 0; i < num_edges; i++) {
    const base = (edgesPtr >> 3) + i * 4; // 4 doubles = 32 bytes
    const vertex0 = { x: HEAPF64[base], y: HEAPF64[base + 1] };
    const vertex1 = { x: HEAPF64[base + 2], y: HEAPF64[base + 3] };
    edges.push({ vertex0, vertex1 });
  }

  const cells = [];
  for (let i = 0; i < num_cells; i++) {
    const index = (cellsPtr >> 2) + i;
    const source_index = HEAPU32[index];
    cells.push({ source_index });
  }

  return { num_vertices, num_edges, num_cells, vertices, edges, cells };
}

init();

document.addEventListener("click", () => {
  console.clear();
  init();
});
