export function BuildDiagram(_coords: any): {
    vertices: {
        x: any;
        y: any;
    }[];
    edges: {
        vertex0: {
            x: any;
            y: any;
        };
        vertex1: {
            x: any;
            y: any;
        };
    }[];
    cells: {
        source_index: any;
        vertices: {
            x: any;
            y: any;
        }[];
    }[];
};
export function display_vertices(vertices: any, ctx: any): void;
export function display_edges(edges: any, ctx: any): void;
export function display_cells(cells: any, ctx: any): void;
