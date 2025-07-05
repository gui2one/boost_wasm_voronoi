#pragma once
#ifndef VORONOI_DIAGRAM_H
#define VORONOI_DIAGRAM_H

#include <iostream>
#include <memory>

#include <boost/polygon/polygon.hpp>
#include <boost/polygon/voronoi.hpp>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>
#endif
#include <string>
#include <vector>

namespace gui2one {

struct Vertex {
  double x;
  double y;
};

struct Edge {
  Vertex vertex0;
  Vertex vertex1;
};
struct Cell {
  size_t source_index;
  size_t num_vertices;
  Vertex *vertices;
};

struct Diagram {
  size_t num_vertices;
  size_t num_edges;
  size_t num_cells;
  Vertex *vertices;
  Edge *edges;
  Cell *cells;
};

extern "C" {

Diagram *build_diagram(float *points, size_t length);
}

} // namespace gui2one

#endif