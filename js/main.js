// @ts-ignore
import Voronoi from "./boost_voronoi.js";

import { string_to_u8array } from "./utils.js";

let voronoi = await Voronoi();
// let name = "master";
// const chars = string_to_u8array(name);
// voronoi.print_hello(chars);

const points = new Float64Array([0, 0, 2, 2, 3, 3, 2, 3, 5, 6, 9, 8, 98, 89]);

let diagram = voronoi.build_diagram(points);
// console.log(diagram);
console.log(diagram.cells.size() + " cells");
console.log(diagram.edges.size() + " edges");
console.log(diagram.vertices.size() + " vertices");
for (let i = 0; i < diagram.edges.size(); i++) {
  console.log(diagram.edges.get(i));
}
