/*
code for clipping infinite edges found here :
https://www.boost.org/doc/libs/1_55_0/libs/polygon/example/voronoi_visualizer.cpp
*/
#define JC_VORONOI_IMPLEMENTATION
// If you wish to use doubles
// #define JCV_REAL_TYPE double
// #define JCV_FABS fabs
// #define JCV_ATAN2 atan2
// #define JCV_CEIL ceil
// #define JCV_FLOOR floor
// #define JCV_FLT_MAX 1.7976931348623157E+308

#include "voronoi_diagram.h"

extern "C" {

EMSCRIPTEN_KEEPALIVE
Diagram *build_diagram(float *_points, size_t len, float *bounds) {
  size_t NPOINT = (size_t)(len / 2);
  size_t i;
  jcv_rect bounding_box = {{bounds[0], bounds[1]}, {bounds[2], bounds[3]}};
  jcv_diagram diagram;
  jcv_point points[NPOINT];
  const jcv_site *sites;
  jcv_graphedge *graph_edge;

  memset(&diagram, 0, sizeof(jcv_diagram));

  for (i = 0; i < NPOINT; i++) {
    points[i].x = _points[i * 2];
    points[i].y = _points[i * 2 + 1];
  }

  jcv_diagram_generate(NPOINT, (const jcv_point *)points, &bounding_box, 0,
                       &diagram);

  Diagram *result = new Diagram();

  //   result->vertices.data = diagram.internal->sites;
  printf("# Edges\n");
  result->cells.alloc(diagram.numsites);
  sites = jcv_diagram_get_sites(&diagram);
  for (i = 0; i < diagram.numsites; i++) {

    Cell cell;
    cell.source_index = sites[i].index;
    // cell.num_vertices = sites[i].;
    graph_edge = sites[i].edges;
    std::vector<GVertex> vertices;
    int inc = 0;
    while (graph_edge) {
      // This approach will potentially print shared edges twice
      GVertex v0;
      v0.x = (double)graph_edge->pos[0].x;
      v0.y = (double)graph_edge->pos[0].y;
      vertices.push_back(v0);
      // printf("%f %f\n", (double)graph_edge->pos[0].x,
      //        (double)graph_edge->pos[0].y);
      // printf("%f %f\n", (double)graph_edge->pos[1].x,
      //        (double)graph_edge->pos[1].y);
      graph_edge = graph_edge->next;
      inc++;
    }
    cell.vertices = WasmArray<GVertex>::fromVector(vertices);
    // printf("cell vertices num : %d\n", cell.vertices.length);
    // cell.vertices.alloc(vertices.size());
    // for (int j = 0; j < vertices.size(); j++) {
    //   cell.vertices[j] = vertices[j];
    // }
    result->cells[i] = cell;
  }

  jcv_diagram_free(&diagram);

  return result;
}

EMSCRIPTEN_KEEPALIVE
void free_diagram(Diagram *diagram) {
  if (!diagram)
    return;

  // 1. Free cell vertex arrays
  for (size_t i = 0; i < diagram->cells.length; ++i) {
    diagram->cells.data[i].vertices.free(); // Each cell owns a vertex array
  }

  // 2. Free diagram-level arrays
  diagram->vertices.free(); // vertex array at Diagram level
  diagram->edges.free();    // edge array at Diagram level
  diagram->cells.free();    // array of cells

  // 3. Free the Diagram itself
  delete diagram;
  printf("freed all DATA ?\n");
}
}
