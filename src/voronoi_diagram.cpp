#include "voronoi_diagram.h"

using boost::polygon::construct_voronoi;
using boost::polygon::point_data;
using boost::polygon::voronoi_diagram;

namespace gui2one {
extern "C" {

EMSCRIPTEN_KEEPALIVE
void print_hello(const char *name) {
  std::cout << "Hello, " << name << "! from c++" << std::endl;
}

EMSCRIPTEN_KEEPALIVE
Diagram build_diagram(double *ptr, size_t length) {
  std::vector<point_data<double>> points;
  for (size_t i = 0; i + 1 < length; i += 2) {
    points.emplace_back(ptr[i], ptr[i + 1]);
  }

  boost::polygon::voronoi_diagram<double> vd;
  construct_voronoi(points.begin(), points.end(), &vd);

  Diagram diagram;
  for (const auto &cell : vd.cells()) {
    diagram.cells.push_back({cell.source_index()});
  }

  for (const auto &edge : vd.edges()) {
    Edge e;
    if (edge.vertex0())
      e.vertex0 = {edge.vertex0()->x(), edge.vertex0()->y()};
    if (edge.vertex1())
      e.vertex1 = {edge.vertex1()->x(), edge.vertex1()->y()};
    diagram.edges.push_back(e);
  }

  for (const auto &vertex : vd.vertices()) {
    diagram.vertices.push_back({vertex.x(), vertex.y()});
  }

  return diagram;
}
}

} // namespace gui2one