#pragma once
#ifndef VORONOI_DIAGRAM_H
#define VORONOI_DIAGRAM_H

#include <iostream>

#include <boost/polygon/voronoi.hpp>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>
#endif
#include <string>
#include <vector>

namespace gui2one {

struct Point {
  float x;
  float y;
};

struct Diagram {
  std::vector<size_t> cells;
};

void print_hello(const char *name);

Diagram build_diagram(std::vector<float> fpoints);

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

Diagram build_diagram_wrapper(emscripten::val points);

#endif
} // namespace gui2one

#endif