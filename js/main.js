// @ts-ignore
import Voronoi from "./boost_voronoi.js";

import { string_to_u8array } from "./utils.js";

let voronoi = await Voronoi();
let name = "master";
const chars = string_to_u8array(name);
voronoi.print_hello(chars);

const points = new Float32Array([1.0, 2.0, 3.0, 4.0]);
voronoi.set_data(points);
let diagram = voronoi.build_diagram(points);
console.log(diagram.cells.size());
for (let i = 0; i < diagram.cells.size(); i++) {
  console.log(diagram.cells.get(i));
}
