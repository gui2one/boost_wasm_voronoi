import { Application, Container, Graphics, Point } from "pixi.js";

import { BoostDiagram, FindContours, BuildDiagram, Vertex } from "../main.js";

class CellGraphics extends Graphics {
  cell_id: number;
}

let app = new Application();
let cells_container: Container;
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

  cells_container = new Container();
  app.stage.addChild(cells_container);
  app.canvas.addEventListener("click", (e) => {
    points.push({
      x: e.offsetX,
      y: e.offsetY,
    });
    build_diagram(app);
  });

  build_diagram(app);

  // contours_test();
}

function build_diagram(app: Application) {
  let diagram = BuildDiagram(points, [
    0,
    0,
    app.screen.width,
    app.screen.height,
  ]);
  display_cells(app, diagram);
}
function display_cells(app: Application, diagram: BoostDiagram) {
  while (cells_container.children.length > 0) {
    const child = cells_container.getChildAt(0) as Graphics;
    cells_container.removeChild(child);
    child.destroy(true);
  }
  cells_container.removeChildren();

  // cells_container = new Container();
  // cells_container = null;
  // app.stage.addChild(cells_container);
  for (let cell of diagram.cells) {
    // let clockwise = isClockwise(cell.vertices);
    // if (!clockwise) {
    //   cell.vertices.reverse();
    // }
    let g = new CellGraphics();
    // g.interactive = true;
    g.cell_id = cell.source_index;
    g.setFillStyle({ color: 0xffffff, alpha: 1.0 });
    g.setStrokeStyle({ width: 1, color: 0x000000 });
    g.poly(cell.vertices.map((v) => new Point(v.x, v.y)))
      .fill()
      .stroke();

    cells_container.addChild(g);
  }
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
