console.log("test_module.js");

import { BuildDiagram } from "./main.js";

let canvas = document.createElement("canvas");

canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);
// let ctx = canvas.getContext("2d");
BuildDiagram(canvas);
