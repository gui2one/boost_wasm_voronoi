#include <iostream>

#include <boost/polygon/voronoi.hpp>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <string>
#include <vector>

using namespace boost::polygon;
template <typename T> std::vector<T> to_vector(emscripten::val array) {
  size_t size = array["length"].as<size_t>();
  std::vector<T> result(size);
  emscripten::val memoryView{
      emscripten::typed_memory_view(size, result.data())};
  memoryView.call<void>("set", array);
  return result;
}
struct Diagram {

  std::vector<size_t> cells;
};

void print_hello(char *name) {
  std::cout << "Hello, " << name << "! from c++" << std::endl;
}

void print_hello_wrapper(emscripten::val name) {
  print_hello(to_vector<char>(name).data());
}

Diagram build_diagram(std::vector<float> fpoints) {
  std::vector<point_data<float>> points;
  for (size_t i = 0; i < fpoints.size(); i += 2) {
    points.emplace_back(fpoints[i], fpoints[i + 1]);
  }
  voronoi_diagram<double> vd;
  construct_voronoi(points.begin(), points.end(), &vd);

  auto cells = vd.cells();
  auto edges = vd.edges();

  Diagram diagram;

  for (const auto &cell : vd.cells()) {
    std::cout << "Cell: site " << cell.source_index() << "\n";
    diagram.cells.push_back(cell.source_index());
  }
  return diagram;
}

Diagram build_diagram_wrapper(emscripten::val points) {
  auto fpoints = to_vector<float>(points);
  return build_diagram(fpoints);
}

void set_data(std::vector<float> data) {
  std::cout << "get_data size : " << data.size() << std::endl;
  for (size_t i = 0; i < data.size(); i++) {
    std::cout << data[i] << " ";
  }
  std::cout << std::endl;
}

// A wrapper that extracts the data pointer and size from a JS typed array
void set_data_wrapper(emscripten::val typedArray) {
  auto values = to_vector<float>(typedArray);
  set_data(values);
}

EMSCRIPTEN_BINDINGS(Foo) {
  emscripten::register_vector<float>("VectorFloat");
  emscripten::register_vector<size_t>("VectorSizeT");
  emscripten::value_object<Diagram>("Diagram").field("cells", &Diagram::cells);
  emscripten::function("set_data", &set_data_wrapper);
  emscripten::function("print_hello", &print_hello_wrapper);
  emscripten::function("build_diagram", &build_diagram_wrapper);
}