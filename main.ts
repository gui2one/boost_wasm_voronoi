import Voronoi from "./build_wasm/boost_voronoi.js";
import { MemoryReader } from "./js/memory_reader";

export interface WasmMemory {
  HEAP8: Int8Array;
  HEAPU8: Uint8Array;

  HEAP16: Int16Array;
  HEAPU16: Uint16Array;
  HEAPF16: Float16Array;

  HEAP32: Int32Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;

  HEAP64: BigInt64Array;
  HEAPU64: BigUint64Array;
  HEAPF64: Float64Array;

  // Add your own exports here
}
let voronoi = await Voronoi();
console.log(typeof voronoi);
console.log(voronoi);

export type BoostDiagram = {
  vertices: Vertex[];
  edges: Edge[];
  cells: Cell[];
};

export type Vertex = {
  x: number;
  y: number;
};

export type Edge = {
  vertex0: Vertex;
  vertex1: Vertex;
};

export type Cell = {
  source_index: number;
  vertices: Vertex[];
};

export class ColorWithAlpha {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static from_hex_string(str: string) {
    const r = parseInt(str.slice(1, 3), 16);
    const g = parseInt(str.slice(3, 5), 16);
    const b = parseInt(str.slice(5, 7), 16);
    const a = parseInt(str.slice(7, 9), 16);
    return new ColorWithAlpha(r, g, b, a);
  }

  to_string() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
function float32Array_to_wasm_array(array: Float32Array): {
  ptr: number;
  len: number;
} {
  const bytes = array.length * array.BYTES_PER_ELEMENT;
  const ptr = voronoi._malloc(bytes);
  voronoi.HEAPF32.set(array, ptr / 4); // divide by array.BYTES_PER_ELEMENT ?!!
  return { ptr, len: array.length };
}

function uint8Array_to_wasm_array(array: Uint8Array): {
  ptr: number;
  len: number;
} {
  const bytes = array.length * array.BYTES_PER_ELEMENT;
  const ptr = voronoi._malloc(bytes);
  voronoi.HEAP8.set(array, ptr / 1); // divide by array.BYTES_PER_ELEMENT ?!!
  return { ptr, len: array.length };
}

export function BuildDiagram(
  _sites: Vertex[],
  _bounds?: number[]
): BoostDiagram {
  let coords;
  let bounds: Float32Array;
  if (_sites === undefined) {
    const numPoints = 500;
    coords = new Float32Array(numPoints * 2);
    for (let i = 0; i < coords.length; i++) {
      coords[i] = Math.random() * 512;
    }
  } else {
    coords = new Float32Array(_sites.length * 2);
    for (let i = 0; i < _sites.length; i++) {
      coords[i * 2] = _sites[i].x;
      coords[i * 2 + 1] = _sites[i].y;
    }
  }
  if (_bounds === undefined) {
    bounds = new Float32Array([0, 0, 512, 512]);
  } else {
    bounds = new Float32Array(_bounds);
  }
  const coords_c_array = float32Array_to_wasm_array(coords);
  const bounds_c_array = float32Array_to_wasm_array(bounds);

  const diagram = voronoi._build_diagram(
    coords_c_array.ptr,
    coords_c_array.len,
    bounds_c_array.ptr
  );

  let data = getMeshData(diagram);
  let data2 = getMeshData2(diagram);
  // Free memory
  voronoi._free(coords_c_array.ptr);

  return data;
}

export function display_vertices(
  vertices: Vertex[],
  ctx: CanvasRenderingContext2D,
  color: ColorWithAlpha = new ColorWithAlpha(255, 0, 0, 0.2),
  size: number = 10
) {
  ctx.fillStyle = color.to_string();

  for (let i = 0; i < vertices.length; i++) {
    let offset = Math.floor(size / 2);
    ctx?.fillRect(vertices[i].x - offset, vertices[i].y - offset, size, size);
  }
}

export function display_edges(edges: Edge[], ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  for (let i = 0; i < edges.length; i++) {
    ctx.moveTo(edges[i].vertex0.x, edges[i].vertex0.y);
    ctx.lineTo(edges[i].vertex1.x, edges[i].vertex1.y);
  }
  ctx.closePath();
  ctx.stroke();
}

export function display_cells(cells: Cell[], ctx: CanvasRenderingContext2D) {
  for (let cell of cells) {
    // let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}FF`;

    // ctx.fillStyle = color;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(cell.vertices[0].x, cell.vertices[0].y);
    for (let vtx of cell.vertices) {
      ctx.lineTo(vtx.x, vtx.y);
    }

    ctx.closePath();
    ctx.stroke();
    // ctx.fill();
  }
}

function getMeshData(meshPtr: number): BoostDiagram {
  /*
  BEWARE : because I am using WASM 32bit version, Array pointers are 32 bits
  */

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
  const vertices: Vertex[] = [];
  const vertexBase = verticesPtr >> 3;
  for (let i = 0; i < num_vertices; ++i) {
    const base = vertexBase + i * 2;
    vertices.push({
      x: HEAPF64[base],
      y: HEAPF64[base + 1],
    });
  }

  // Read edges
  const edges: Edge[] = [];
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
  const cells: Cell[] = [];
  const cellSizeInU32 = 3; // size_t source_index + size_t num_vertices + Vertex* pointer
  const cellBase = cellsPtr >> 2;
  for (let i = 0; i < num_cells; ++i) {
    const offset = cellBase + i * cellSizeInU32;
    const source_index = HEAPU32[offset];
    const num_cell_vertices = HEAPU32[offset + 1];
    const cellVerticesPtr = HEAPU32[offset + 2];

    const verts: Vertex[] = [];
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
function getMeshData2(meshPtr: number) {
  let reader = new MemoryReader(voronoi, meshPtr, true);

  let val = reader.readSizeT(8);
  console.log("val : ", val);
}

export function FindContours(image_data: ImageData): void {
  let pixelData = new Uint8Array(image_data.data.buffer);
  let pixels_data = uint8Array_to_wasm_array(pixelData);
  let contours_ptr = voronoi._find_contours(
    pixels_data.ptr,
    image_data.width,
    image_data.height
  );

  console.log(contours_ptr);
}
