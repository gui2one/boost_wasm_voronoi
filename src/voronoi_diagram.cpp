#include "voronoi_diagram.h"

using boost::polygon::construct_voronoi;
using boost::polygon::point_data;
using boost::polygon::voronoi_diagram;

namespace gui2one {

EMSCRIPTEN_KEEPALIVE
void print_hello(const char *name) {
  std::cout << "Hello, " << name << "! from c++" << std::endl;
}

EMSCRIPTEN_KEEPALIVE
Diagram build_diagram(emscripten::val emfpoints) {
  auto fpoints = to_vector<double>(emfpoints);
  std::vector<point_data<double>> points;
  for (size_t i = 0; i < fpoints.size(); i += 2) {
    points.push_back({fpoints[i], fpoints[i + 1]});
  }

  voronoi_diagram<double> vd;
  construct_voronoi(points.begin(), points.end(), &vd);
  points.clear();

  auto cells = vd.cells();
  auto edges = vd.edges();

  Diagram diagram;

  for (const auto &cell : vd.cells()) {

    Cell my_cell = {cell.source_index()};

    diagram.cells.push_back(my_cell);
  }
  for (auto &edge : vd.edges()) {

    Edge my_edge;
    my_edge.vertex0 = {(double)edge.vertex0()->x(),
                       (double)edge.vertex0()->y()};
    my_edge.vertex1 = {(double)edge.vertex1()->x(),
                       (double)edge.vertex1()->y()};
    diagram.edges.push_back(my_edge);
  }

  for (const auto &vertex : vd.vertices()) {
    Vertex my_vertex = {vertex.x(), vertex.y()};
    diagram.vertices.push_back(my_vertex);
  }

  cells.clear();
  edges.clear();
  vd.clear();
  return diagram;
}

#ifdef __EMSCRIPTEN__

EMSCRIPTEN_KEEPALIVE
void print_hello_wrapper(emscripten::val name) {
  print_hello(to_vector<char>(name).data());
}

EMSCRIPTEN_KEEPALIVE
// std::shared_ptr<Diagram> build_diagram_wrapper(emscripten::val points) {
//   auto fpoints = to_vector<double>(points);

//   auto shared = std::make_shared<Diagram>(build_diagram(fpoints));

//   return shared;
// }

EMSCRIPTEN_BINDINGS(Voronoi) {
  emscripten::class_<Vertex>("Vertex")
      .property("x", &Vertex::x)
      .property("y", &Vertex::y);
  emscripten::class_<Edge>("Edge")
      .property("vertex0", &Edge::vertex0)
      .property("vertex1", &Edge::vertex1);
  emscripten::class_<Cell>("Cell").property("source_index",
                                            &Cell::source_index);
  emscripten::class_<Diagram>("Diagram")
      .constructor()
      .smart_ptr<std::shared_ptr<Diagram>>("Diagram")
      .property("cells", &Diagram::cells)
      .property("vertices", &Diagram::vertices)
      .property("edges", &Diagram::edges);

  emscripten::register_vector<float>("VectorFloat");
  emscripten::register_vector<size_t>("VectorSizeT");
  emscripten::register_vector<Cell>("VectorCell");
  emscripten::register_vector<Vertex>("VectorVertex");
  emscripten::register_vector<Edge>("VectorEdge");

  emscripten::function("print_hello", &print_hello_wrapper);
  emscripten::function("build_diagram", &build_diagram);
}
#endif
} // namespace gui2one