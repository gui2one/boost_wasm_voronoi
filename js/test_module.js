console.log("test_module.js");

import { BuildDiagram, display_cells } from "../main.js";

let canvas = document.createElement("canvas");

canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);

function init() {
  let coords = [];
  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 30; j++) {
      coords.push(i * 20 + Math.random() * 5);
      coords.push(j * 20 + Math.random() * 5);
    }
  }
  let diagram = BuildDiagram(coords);
  console.log(diagram);

  display_cells(diagram.cells, canvas.getContext("2d"));
}
init();

document.addEventListener("click", () => {
  console.clear();
  init();
});
