import { Application, Graphics, Point } from "pixi.js";

import { BoostDiagram, BuildDiagram } from "../main.js";

const app = new Application();

async function init() {
  await app.init();
  document.body.appendChild(app.canvas);

  let diagram = BuildDiagram(
    [
      { x: 100, y: 100 },
      { x: 300, y: 200 },
      { x: 100, y: 300 },
    ],
    [0, 0, app.screen.width, app.screen.height]
  );
  console.log(diagram);

  display_cells(app, diagram);
}

function display_cells(app: Application, diagram: BoostDiagram) {
  for (let cell of diagram.cells) {
    let g = new Graphics();
    g.setStrokeStyle({ width: 1, color: 0x000000 });
    g.poly(cell.vertices.map((v) => new Point(v.x, v.y)))
      .fill()
      .stroke();
    app.stage.addChild(g);
  }
}
init();
