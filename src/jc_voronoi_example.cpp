// Contribution by: Abe Tusk https://github.com/abetusk
// To compile:
// gcc -Wall -Weverything -Wno-float-equal src/examples/simple.c -Isrc -o simple
//
// About:
//
// This example outputs 10 random 2D coordinates, and all the generated edges,
// to standard output. Note that the edges have duplicates, but you can easily
// filter them out.
//

#include "my_types.h"
#include "pch.hpp"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define JC_VORONOI_IMPLEMENTATION
// If you wish to use doubles
// #define JCV_REAL_TYPE double
// #define JCV_FABS fabs
// #define JCV_ATAN2 atan2
// #define JCV_CEIL ceil
// #define JCV_FLOOR floor
// #define JCV_FLT_MAX 1.7976931348623157E+308
#include "jc_voronoi.h"

#define NPOINT 10

using gui2one::Cell;
using gui2one::Diagram;
using gui2one::Edge;
using gui2one::Vertex;

extern "C" {

gui2one::Diagram *jvc_voronoi_example(int argc, char **argv) {
  (void)argc;
  (void)argv;

  int i;
  jcv_rect bounding_box = {{0.0f, 0.0f}, {1.0f, 1.0f}};
  jcv_diagram diagram;
  jcv_point points[NPOINT];
  const jcv_site *sites;
  jcv_graphedge *graph_edge;

  memset(&diagram, 0, sizeof(jcv_diagram));

  srand(0);
  for (i = 0; i < NPOINT; i++) {
    points[i].x = ((float)rand() / (1.0f + (float)RAND_MAX));
    points[i].y = ((float)rand() / (1.0f + (float)RAND_MAX));
  }

  printf("# Seed sites\n");
  for (i = 0; i < NPOINT; i++) {
    printf("%f %f\n", (double)points[i].x, (double)points[i].y);
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
    std::vector<Vertex> vertices;
    int inc = 0;
    while (graph_edge) {
      // This approach will potentially print shared edges twice
      Vertex v0;
      v0.x = (double)graph_edge->pos[0].x;
      v0.y = (double)graph_edge->pos[0].y;
      vertices.push_back(v0);
      printf("%f %f\n", (double)graph_edge->pos[0].x,
             (double)graph_edge->pos[0].y);
      printf("%f %f\n", (double)graph_edge->pos[1].x,
             (double)graph_edge->pos[1].y);
      graph_edge = graph_edge->next;
      inc++;
    }
    cell.vertices = gui2one::WasmArray<Vertex>::fromVector(vertices);
    printf("cell vertices num : %d\n", cell.vertices.length);
    // cell.vertices.alloc(vertices.size());
    // for (int j = 0; j < vertices.size(); j++) {
    //   cell.vertices[j] = vertices[j];
    // }
    result->cells[i] = cell;
  }

  jcv_diagram_free(&diagram);

  return result;
}
};