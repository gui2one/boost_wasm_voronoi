// @ts-ignore
import Voronoi from "./boost_voronoi.js";

import { string_to_u8array } from "./utils.js";

let voronoi = await Voronoi();
let pts = [];
let canvas = document.createElement("canvas");
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

function init() {
  pts = [];
  for (let i = 0; i < 200; i++) {
    pts.push(Math.random() * 256);
    pts.push(Math.random() * 256);
  }

  const points = new Float32Array(pts);

  let diagram = voronoi.build_diagram(points);
  // console.log(diagram);
  console.log(diagram.cells.size() + " cells");
  console.log(diagram.edges.size() + " edges");
  console.log(diagram.vertices.size() + " vertices");

  canvas.width = 512;
  canvas.height = 512;
  if (!ctx) {
    console.log("no context");
    throw new Error("no context");
  }

  ctx.clearRect(0, 0, 512, 512);
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "white";
  let num_vertices = diagram.vertices.size();
  let num_edges = diagram.edges.size();
  let num_cells = diagram.cells.size();
  ctx.fillText(`${num_vertices} vertices`, 10, 20);
  ctx.fillText(`${num_edges} edges`, 10, 40);
  ctx.fillText(`${num_cells} cells`, 10, 60);
  for (let i = 0; i < num_vertices; i++) {
    let vtx = diagram.vertices.get(i);
    ctx.fillRect(vtx.x - 1, vtx.y - 1, 3, 3);

    vtx.delete();
  }

  diagram.vertices.delete();
  for (let i = 0; i < num_edges; i++) {
    let edge = diagram.edges.get(i);
    ctx.beginPath();
    ctx.moveTo(edge.vertex0.x, edge.vertex0.y);
    ctx.lineTo(edge.vertex1.x, edge.vertex1.y);
    ctx.stroke();

    edge.delete();
  }

  // diagram.edges.delete();
  // diagram.cells.delete();
  diagram.delete();
}

init();

document.addEventListener("click", () => {
  // console.clear();
  init();
});
