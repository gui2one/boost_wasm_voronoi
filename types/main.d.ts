/**
 *
 * @export
 * @param {number[]} _coords
 * @returns {{ vertices: []; edges: []; cells: []; }}
 */
export function BuildDiagram(_coords: number[]): {
    vertices: [];
    edges: [];
    cells: [];
};
/**
 *
 * @param {Array} vertices
 * @param {RenderingContext} ctx
 */
export function display_vertices(vertices: any[], ctx: RenderingContext): void;
/**
 *
 * @param {Array} edges
 * @param {RenderingContext} ctx
 */
export function display_edges(edges: any[], ctx: RenderingContext): void;
/**
 *
 * @param {Array} cells
 * @param {RenderingContext} ctx
 */
export function display_cells(cells: any[], ctx: RenderingContext): void;
