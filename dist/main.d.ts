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
}
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
export declare class ColorWithAlpha {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
    static from_hex_string(str: string): ColorWithAlpha;
    to_string(): string;
}
export declare function BuildDiagram(_sites: Vertex[], _bounds?: number[]): BoostDiagram;
export declare function display_vertices(vertices: Vertex[], ctx: CanvasRenderingContext2D, color?: ColorWithAlpha, size?: number): void;
export declare function display_edges(edges: Edge[], ctx: CanvasRenderingContext2D): void;
export declare function display_cells(cells: Cell[], ctx: CanvasRenderingContext2D): void;
export declare function FindContours(image_data: ImageData): void;
