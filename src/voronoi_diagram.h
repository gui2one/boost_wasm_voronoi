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
  ~Diagram() {

    cells.clear();
    vertices.clear();
    edges.clear();

    std::cout << "Diagram Destructor Called !!!" << std::endl;
  };

public:
  std::vector<Cell> cells;
  std::vector<Vertex> vertices;
  std::vector<Edge> edges;
};

extern "C" {

void print_hello(const char *name);

Diagram build_diagram(double *ptr, size_t length);
}

} // namespace gui2one

#endif