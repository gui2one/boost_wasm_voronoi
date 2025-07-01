#include <iostream>

#include <boost/polygon/voronoi.hpp>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <string>
#include <vector>

using namespace boost::polygon;

struct Diagram {
  std::vector<point_data<float>> points;
  std::vector<std::vector<int>> cells;
};

void print_hello(int num) {

  std::cout << "Hello, " << num << "! from c++" << std::endl;

  std::vector<point_data<float>> points;
  points.emplace_back(0.0f, 0.0f);
  points.emplace_back(1.0f, 0.0f);
  points.emplace_back(0.0f, 1.0f);
  points.emplace_back(1.0f, 1.0f);

  voronoi_diagram<double> vd;
  construct_voronoi(points.begin(), points.end(), &vd);

  for (const auto &cell : vd.cells()) {
    std::cout << "Cell: site " << cell.source_index() << "\n";
  }
}

int *buid_diagram(float *fpoints, size_t size) {
  std::vector<point_data<float>> points;
  for (size_t i = 0; i < size; i += 2) {
    points.emplace_back(fpoints[i], fpoints[i + 1]);
  }
  voronoi_diagram<double> vd;
  construct_voronoi(points.begin(), points.end(), &vd);

  for (const auto &cell : vd.cells()) {
    std::cout << "Cell: site " << cell.source_index() << "\n";
  }
  return nullptr;
}

void set_data(float *data, size_t size) {
  std::cout << "get_data size : " << size << std::endl;
  for (size_t i = 0; i < size; i++) {
    std::cout << data[i] << " ";
  }
  std::cout << std::endl;
}

// A wrapper that extracts the data pointer and size from a JS typed array
void set_data_wrapper(emscripten::val typedArray) {
  const size_t size = typedArray["length"].as<size_t>();
  std::vector<float> data(size);

  // Copy JS Float32Array into C++ vector
  emscripten::val memoryView{emscripten::typed_memory_view(size, data.data())};
  memoryView.call<void>("set", typedArray);

  // Call the original function
  set_data(data.data(), size);
}

EMSCRIPTEN_BINDINGS(Foo) {
  emscripten::function("set_data", &set_data_wrapper);
}