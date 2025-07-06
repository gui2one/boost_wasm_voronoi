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
export declare function BuildDiagram(_coords: number[]): BoostDiagram;
export declare function display_vertices(vertices: Vertex[], ctx: CanvasRenderingContext2D): void;
export declare function display_edges(edges: Edge[], ctx: CanvasRenderingContext2D): void;
export declare function display_cells(cells: Cell[], ctx: CanvasRenderingContext2D): void;
