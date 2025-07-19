#pragma once
#ifndef MY_TYPES_H
#define MY_TYPES_H

#include "pch.hpp"

template <typename T> struct WasmArray {
  size_t length;
  T *data;

  WasmArray() : length(0), data(nullptr) {}

  void alloc(size_t size) {
    length = size;
    data = new T[size];
  }

  static WasmArray<T> fromVector(const std::vector<T> &vec) {
    WasmArray<T> arr;
    arr.alloc(vec.size());
    std::copy(vec.begin(), vec.end(), arr.data);
    return arr;
  }
  void free() {
    delete[] data;
    data = nullptr;
    length = 0;
  }

  T &operator[](size_t index) { return data[index]; }
};
struct GVertex {
  double x;
  double y;
};

struct Edge {
  GVertex vertex0;
  GVertex vertex1;
};
struct Cell {
  size_t source_index;
  WasmArray<GVertex> vertices;
};

struct Diagram {
  WasmArray<GVertex> vertices;
  WasmArray<Edge> edges;
  WasmArray<Cell> cells;
};

#endif // MY_TYPES_H