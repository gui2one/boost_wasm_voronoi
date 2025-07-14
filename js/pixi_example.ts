import { Application, Graphics, Point } from "pixi.js";

import { BoostDiagram, FindContours, BuildDiagram, Vertex } from "../main.js";

class CellGraphics extends Graphics {
  cell_id: number;
}

let app = new Application();

let points: Vertex[] = [];

async function init() {
  await app.init({
    preference: "webgpu",
    antialias: true,
    backgroundColor: "blue",
  });
  document.body.appendChild(app.canvas);

  for (let i = 0; i < 3000; i++) {
    points.push({
      x: Math.random() * app.screen.width,
      y: Math.random() * app.screen.height,
    });
  }

  // app.canvas.addEventListener("click", (e) => {
  //   points.push({
  //     x: e.offsetX,
  //     y: e.offsetY,
  //   });
  //   build_diagram(app);
  // });

  build_diagram(app);
  contours_test();
}

function build_diagram(app: Application) {
  let diagram = BuildDiagram(points, [
    0,
    0,
    app.screen.width,
    app.screen.height,
  ]);
  //   console.log(diagram);

  display_cells(app, diagram);
}
function display_cells(app: Application, diagram: BoostDiagram) {
  app.stage.removeChildren();
  for (let cell of diagram.cells) {
    // let clockwise = isClockwise(cell.vertices);
    // if (!clockwise) {
    //   cell.vertices.reverse();
    // }
    let g = new CellGraphics();
    g.interactive = true;
    g.cell_id = cell.source_index;
    g.setFillStyle({ color: 0xffffff, alpha: 1.0 });
    g.setStrokeStyle({ width: 1, color: 0x000000 });
    g.poly(cell.vertices.map((v) => new Point(v.x, v.y)))
      .fill()
      .stroke();

    app.stage.addChild(g);

    g.addEventListener("mousedown", (e: Event) => {
      let g = e.target as CellGraphics;
      g.tint = 0xff0000;
      console.log(cell);
    });

    g.addEventListener("mouseup, mouseout", (e: Event) => {
      let g = e.target as CellGraphics;
      g.tint = 0xffffff;
    });
  }
}

function isClockwise(pts: Vertex[]) {
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    sum += (p2.x - p1.x) * (p2.y + p1.y);
  }
  return sum > 0;
}

function contours_test() {
  let canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  document.body.appendChild(canvas);
  let ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Rendering context is null");
    return;
  }
  ctx.fillStyle = "white";
  ctx?.fillRect(5, 5, 10, 10);

  let image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  FindContours(image_data);
}
init();
