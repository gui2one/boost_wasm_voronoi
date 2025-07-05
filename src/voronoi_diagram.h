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
};

class Diagram {
public:
  Diagram() { std::cout << "Diagram Constructor Called !!!" << std::endl; };
  ~Diagram() { std::cout << "Diagram Destructor Called !!!" << std::endl; };

public:
  size_t num_vertices;
  size_t num_edges;
  size_t num_cells;
  Vertex *vertices;
  Edge *edges;
  Cell *cells;
};

extern "C" {

void print_hello(const char *name);

Diagram *build_diagram(float *points, size_t length);
}

} // namespace gui2one

#endif