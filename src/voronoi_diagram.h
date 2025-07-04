#pragma once
#ifndef VORONOI_DIAGRAM_H
#define VORONOI_DIAGRAM_H

#include <iostream>
#include <memory>

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
};

class Diagram {
public:
  Diagram() { std::cout << "Diagram Constructor Called !!!" << std::endl; };
  ~Diagram() { std::cout << "Diagram Destructor Called !!!" << std::endl; };

public:
  size_t num_vertices;
  Vertex *vertices;
  size_t num_cells;
  Cell *cells;
  size_t num_edges;
  Edge *edges;
};

extern "C" {

void print_hello(const char *name);

Diagram *build_diagram(const float *points, size_t length);
}

} // namespace gui2one

#endif