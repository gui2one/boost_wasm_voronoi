import Voronoi from "./build_wasm/voronoi.js";
import { MemoryReader } from "./js/memory_reader";
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
function float32Array_to_wasm_array(array) {
    const bytes = array.length * array.BYTES_PER_ELEMENT;
    const ptr = voronoi._malloc(bytes);
    voronoi.HEAPF32.set(array, ptr / 4); // divide by array.BYTES_PER_ELEMENT ?!!
    return { ptr, len: array.length };
}
function uint8Array_to_wasm_array(array) {
    const bytes = array.length * array.BYTES_PER_ELEMENT;
    const ptr = voronoi._malloc(bytes);
    voronoi.HEAP8.set(array, ptr / 1); // divide by array.BYTES_PER_ELEMENT ?!!
    return { ptr, len: array.length };
}
export function BuildDiagram(_sites, _bounds) {
    let coords;
    let bounds;
    coords = new Float32Array(_sites.length * 2);
    for (let i = 0; i < _sites.length; i++) {
        coords[i * 2] = _sites[i].x;
        coords[i * 2 + 1] = _sites[i].y;
    }
    bounds = new Float32Array(_bounds);
    const coords_c_array = float32Array_to_wasm_array(coords);
    const bounds_c_array = float32Array_to_wasm_array(bounds);
    const diagram = voronoi._build_diagram(coords_c_array.ptr, coords_c_array.len, bounds_c_array.ptr);
    let data2 = getMeshData(diagram);
    // Free memory
    voronoi._free_diagram(diagram);
    // voronoi._free(diagram);
    voronoi._free(coords_c_array.ptr);
    voronoi._free(bounds_c_array.ptr);
    console.log("Memory used: ", 
    // @ts-ignore
    Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), "MB");
    return data2;
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
function read_wasm_array_at_offset(base_ptr, offset, item_size_in_bytes, read_fn) {
    const reader = new MemoryReader(voronoi, base_ptr, true);
    const length = reader.readSizeT(offset);
    const data_ptr = reader.readUint32(offset + 4);
    const dataReader = new MemoryReader(voronoi, data_ptr, true);
    const result = [];
    for (let i = 0; i < length; i++) {
        const item_offset = i * item_size_in_bytes;
        const item = read_fn(dataReader, item_offset);
        result.push(item);
    }
    return result;
}
function readVertex(reader, offset) {
    const x = reader.readFloat64(offset);
    const y = reader.readFloat64(offset + 8);
    return { x, y };
}
function readEdge(reader, offset) {
    return {
        vertex0: readVertex(reader, offset), // 0 - 15
        vertex1: readVertex(reader, offset + 16), // 16 - 31
    };
}
function readCell(reader, offset) {
    const source_index = reader.readSizeT(offset);
    const vertices_length = reader.readSizeT(offset + 4);
    const vertices_data_ptr = reader.readUint32(offset + 8);
    const vertexReader = new MemoryReader(voronoi, vertices_data_ptr, true);
    const vertices = [];
    for (let i = 0; i < vertices_length; i++) {
        const vtx = readVertex(vertexReader, i * 16); // Vertex is 16 bytes
        vertices.push(vtx);
    }
    return {
        source_index,
        vertices,
    };
}
function getMeshData(meshPtr) {
    // Now read the WasmArray<T> structs
    const diagramPtr = meshPtr; // pointer to Diagram2
    const offset_vertices = 0;
    const offset_edges = offset_vertices + 8;
    const offset_cells = offset_edges + 8;
    const vertices = read_wasm_array_at_offset(diagramPtr, offset_vertices, 16, readVertex);
    const edges = read_wasm_array_at_offset(diagramPtr, offset_edges, 32, readEdge);
    const cells = read_wasm_array_at_offset(diagramPtr, offset_cells, 12, readCell);
    return { vertices, edges, cells };
}
export function FindContours(image_data) {
    let pixelData = new Uint8Array(image_data.data.buffer);
    let pixels_data = uint8Array_to_wasm_array(pixelData);
    let contours_ptr = voronoi._find_contours(pixels_data.ptr, image_data.width, image_data.height);
    // console.log(contours_ptr);
}
