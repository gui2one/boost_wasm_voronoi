#pragma once
#ifndef MY_TYPES_H
#define MY_TYPES_H

#include "pch.hpp"

namespace gui2one {
template <typename T> struct WasmArray {
  size_t length;
  T *data;

  WasmArray() : length(0), data(nullptr) {}

  void alloc(size_t size) {
    length = size;
    data = new T[size];
  }
  void free() { delete[] data; }

  T &operator[](size_t index) { return data[index]; }
};
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
  WasmArray<Vertex> vertices;
};

struct Diagram {
  WasmArray<Vertex> vertices;
  WasmArray<Edge> edges;
  WasmArray<Cell> cells;
};

}; // namespace gui2one

#endif // MY_TYPES_H