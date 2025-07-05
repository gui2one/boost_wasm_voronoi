// @ts-nocheck
import Voronoi from "build_wasm/boost_voronoi.js";

let voronoi = await Voronoi();

export function BuildDiagram(canvas) {
  let ctx = canvas.getContext("2d");
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  console.log(data);
  // display_coords(coords);
  // display_vertices(data.vertices);
  // display_edges(data.edges);
  display_cells(data.cells, ctx);
}

function display_coords(coords, ctx) {
  // ctx?.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  for (let i = 0; i < coords.length; i += 2) {
    // console.log(coords[i], coords[i + 1]);
    ctx?.fillRect(coords[i] - 1, coords[i + 1] - 1, 3, 3);
  }
}

function display_vertices(vertices, ctx) {
  ctx.fillStyle = "green";
  for (let i = 0; i < vertices.length; i++) {
    // console.log(coords[i], coords[i + 1]);
    ctx?.fillRect(vertices[i].x - 1, vertices[i].y - 1, 3, 3);
  }
}

function display_edges(edges, ctx) {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  for (let i = 0; i < edges.length; i++) {
    ctx.moveTo(edges[i].vertex0.x, edges[i].vertex0.y);
    ctx.lineTo(edges[i].vertex1.x, edges[i].vertex1.y);
  }
  ctx.closePath();
  ctx.stroke();
}

function display_cells(cells, ctx) {
  for (let cell of cells) {
    ctx.beginPath();
    ctx.moveTo(cell.vertices[0].x, cell.vertices[0].y);
    for (let vtx of cell.vertices) {
      ctx.lineTo(vtx.x, vtx.y);
    }

    ctx.closePath();
    ctx.stroke();
  }
}

function getMeshData(meshPtr) {
  const HEAPU32 = voronoi.HEAPU32;
  const HEAPF64 = voronoi.HEAPF64;

  const baseU32 = meshPtr >> 2;

  const num_vertices = HEAPU32[baseU32 + 0];
  const num_edges = HEAPU32[baseU32 + 1];
  const num_cells = HEAPU32[baseU32 + 2];

  const verticesPtr = HEAPU32[baseU32 + 3];
  const edgesPtr = HEAPU32[baseU32 + 4];
  const cellsPtr = HEAPU32[baseU32 + 5];

  // Read top-level vertices
  const vertices = [];
  const vertexBase = verticesPtr >> 3;
  for (let i = 0; i < num_vertices; ++i) {
    const base = vertexBase + i * 2;
    vertices.push({
      x: HEAPF64[base],
      y: HEAPF64[base + 1],
    });
  }

  // Read edges
  const edges = [];
  const edgeSizeInDoubles = 4; // 2 Vertex structs, each with x and y (2 doubles)
  const edgeBase = edgesPtr >> 3;
  for (let i = 0; i < num_edges; ++i) {
    const base = edgeBase + i * edgeSizeInDoubles;
    edges.push({
      vertex0: { x: HEAPF64[base], y: HEAPF64[base + 1] },
      vertex1: { x: HEAPF64[base + 2], y: HEAPF64[base + 3] },
    });
  }

  // Read cells
  const cells = [];
  const cellSizeInU32 = 3; // size_t source_index + size_t num_vertices + Vertex* pointer
  const cellBase = cellsPtr >> 2;
  for (let i = 0; i < num_cells; ++i) {
    const offset = cellBase + i * cellSizeInU32;
    const source_index = HEAPU32[offset];
    const num_cell_vertices = HEAPU32[offset + 1];
    const cellVerticesPtr = HEAPU32[offset + 2];

    const verts = [];
    const vertexPtr64 = cellVerticesPtr >> 3;
    for (let j = 0; j < num_cell_vertices; ++j) {
      const base = vertexPtr64 + j * 2;
      verts.push({
        x: HEAPF64[base],
        y: HEAPF64[base + 1],
      });
    }

    cells.push({
      source_index,
      vertices: verts,
    });
  }

  return {
    vertices,
    edges,
    cells,
  };
}

// init();

// document.addEventListener("click", () => {
//   console.clear();
//   init();
// });
