import Voronoi from "./build_wasm/boost_voronoi.js";
let voronoi = await Voronoi();
export class ColorWithAlpha {
    r;
    g;
    b;
    a;
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    static from_hex_string(str) {
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
export function BuildDiagram(_sites) {
    let coords;
    if (_sites === undefined) {
        const numPoints = 500;
        coords = new Float32Array(numPoints * 2);
        for (let i = 0; i < coords.length; i++) {
            coords[i] = Math.random() * 512;
        }
    }
    else {
        coords = new Float32Array(_sites.length * 2);
        for (let i = 0; i < _sites.length; i++) {
            coords[i * 2] = _sites[i].x;
            coords[i * 2 + 1] = _sites[i].y;
        }
    }
    // Allocate memory in WASM heap
    const bytes = coords.length * coords.BYTES_PER_ELEMENT;
    const ptr = voronoi._malloc(bytes);
    // Copy JS data to WASM heap
    voronoi.HEAPF32.set(coords, ptr / 4); // divide by coords.BYTES_PER_ELEMENT ?!!
    const bounds_bytes = 4 * 4;
    const bounds_ptr = voronoi._malloc(bounds_bytes);
    let bounds = [0, 0, 512, 512];
    voronoi.HEAPF32.set(bounds, bounds_ptr / 4);
    const diagram = voronoi._build_diagram(ptr, coords.length, bounds_ptr);
    let data = getMeshData(diagram);
    // Free memory
    voronoi._free(ptr);
    return data;
}
export function display_vertices(vertices, ctx, color = new ColorWithAlpha(255, 0, 0, 0.2), size = 10) {
    ctx.fillStyle = color.to_string();
    for (let i = 0; i < vertices.length; i++) {
        let offset = Math.floor(size / 2);
        ctx?.fillRect(vertices[i].x - offset, vertices[i].y - offset, size, size);
    }
}
export function display_edges(edges, ctx) {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    for (let i = 0; i < edges.length; i++) {
        ctx.moveTo(edges[i].vertex0.x, edges[i].vertex0.y);
        ctx.lineTo(edges[i].vertex1.x, edges[i].vertex1.y);
    }
    ctx.closePath();
    ctx.stroke();
}
export function display_cells(cells, ctx) {
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
function getMeshData(meshPtr) {
    /*
    BEWARE : because I am using WASM 32 version, Array pointers are 32 bit
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
