#include "voronoi_diagram.h"

using boost::polygon::construct_voronoi;
using boost::polygon::point_data;
using boost::polygon::voronoi_diagram;

namespace gui2one {

void print_hello(const char *name) {
  std::cout << "Hello, " << name << "! from c++" << std::endl;
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

#ifdef __EMSCRIPTEN__

void print_hello_wrapper(emscripten::val name) {
  print_hello(to_vector<char>(name).data());
}

Diagram build_diagram_wrapper(emscripten::val points) {
  auto fpoints = to_vector<float>(points);
  return build_diagram(fpoints);
}

EMSCRIPTEN_BINDINGS(Foo) {
  emscripten::register_vector<float>("VectorFloat");
  emscripten::register_vector<size_t>("VectorSizeT");

  emscripten::value_object<Point>("Point")
      .field("x", &Point::x)
      .field("y", &Point::y);
  emscripten::value_object<Diagram>("Diagram").field("cells", &Diagram::cells);
  ;
  emscripten::function("print_hello", &print_hello_wrapper);
  emscripten::function("build_diagram", &build_diagram_wrapper);
}
#endif
} // namespace gui2one