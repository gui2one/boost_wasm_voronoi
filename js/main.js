import Foo from "./boost_voronoi.js";

let foo = await Foo();

const points = new Float32Array([1.0, 2.0, 3.0, 4.0]);
// const nBytes = points.length * points.BYTES_PER_ELEMENT;
// const ptr = foo._malloc(nBytes);

// foo.HEAPF32.set(points, ptr / points.BYTES_PER_ELEMENT);
foo.set_data(points);
// foo._free(ptr);

console.log(foo);
