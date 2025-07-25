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
/**
 *
 * @param {Array} vertices
 * @param {RenderingContext} ctx
 */
export declare function display_vertices(vertices: any, ctx: any): void;
/**
 *
 * @param {Array} edges
 * @param {RenderingContext} ctx
 */
export declare function display_edges(edges: any, ctx: any): void;
/**
 *
 * @param {Array} cells
 * @param {RenderingContext} ctx
 */
export declare function display_cells(cells: any, ctx: any): void;
