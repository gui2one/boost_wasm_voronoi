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
Diagram *build_diagram(const float *points, size_t len) {
  std::vector<Vertex> vertices;
  std::vector<Edge> edges;
  std::vector<Cell> cells;

  for (size_t i = 0; i + 1 < len; i += 2) {
    vertices.push_back({points[i], points[i + 1]});
    cells.push_back({(size_t)(i / 2)});
  }

  for (size_t i = 0; i + 3 < len; i += 4) {
    edges.push_back(
        {{points[i], points[i + 1]}, {points[i + 2], points[i + 3]}});
  }

  auto diagram = (Diagram *)std::malloc(sizeof(Diagram));
  diagram->num_vertices = vertices.size();
  diagram->vertices = (Vertex *)std::malloc(sizeof(Vertex) * vertices.size());
  std::memcpy(diagram->vertices, vertices.data(),
              sizeof(Vertex) * vertices.size());

  diagram->num_edges = edges.size();
  diagram->edges = (Edge *)std::malloc(sizeof(Edge) * edges.size());
  std::memcpy(diagram->edges, edges.data(), sizeof(Edge) * edges.size());

  diagram->num_cells = cells.size();
  diagram->cells = (Cell *)std::malloc(sizeof(Cell) * cells.size());
  std::memcpy(diagram->cells, cells.data(), sizeof(Cell) * cells.size());

  std::cout << "num_vertices : " << diagram->num_vertices << std::endl;
  std::cout << "num_edges : " << diagram->num_edges << std::endl;
  std::cout << "num_cells : " << diagram->num_cells << std::endl;
  std::cout << "C++ ---------------------------------" << std::endl;
  return diagram;
}
}

} // namespace gui2one