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
  // Diagram() = default;
  // ~Diagram() {

  //   cells.clear();
  //   vertices.clear();
  //   edges.clear();

  //   std::cout << "Diagram Destructor Called !!!" << std::endl;
  // };

public:
  std::vector<Cell> cells;
  std::vector<Vertex> vertices;
  std::vector<Edge> edges;
};

EMSCRIPTEN_KEEPALIVE
void print_hello(const char *name);

EMSCRIPTEN_KEEPALIVE
Diagram build_diagram(std::vector<float> &fpoints);

#ifdef __EMSCRIPTEN__
template <typename T> std::vector<T> to_vector(emscripten::val array) {
  size_t size = array["length"].as<size_t>();
  std::vector<T> result(size);
  emscripten::val memoryView{
      emscripten::typed_memory_view(size, result.data())};
  memoryView.call<void>("set", array);
  return result;
}
void print_hello_wrapper(emscripten::val name);

std::shared_ptr<Diagram> build_diagram_wrapper(emscripten::val points);

#endif
} // namespace gui2one

#endif