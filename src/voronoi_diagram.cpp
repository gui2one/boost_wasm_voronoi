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
  std::vector<point_data<double>> vertices;

  for (size_t i = 0; i + 1 < len; i += 2) {
    vertices.push_back({(double)points[i], (double)points[i + 1]});
  }

  voronoi_diagram<double> vd;
  construct_voronoi(vertices.begin(), vertices.end(), &vd);

  Diagram *diagram = new Diagram();

  diagram->num_cells = vd.num_cells();
  diagram->cells = new Cell[vd.num_cells()];

  diagram->num_vertices = vd.num_vertices();
  diagram->vertices = new Vertex[vd.num_vertices()];

  diagram->num_edges = vd.num_edges();
  diagram->edges = new Edge[vd.num_edges()];

  for (size_t i = 0; i < vd.num_cells(); i++) {
    Cell my_cell;
    // std::cout << "source index : " << vd.cells()[i].source_index() <<
    // std::endl;
    my_cell.source_index = vd.cells()[i].source_index();
    diagram->cells[i] = my_cell;
  }

  for (size_t i = 0; i < vertices.size(); i++) {
    Vertex my_vertex;
    my_vertex.x = vertices[i].x();
    my_vertex.y = vertices[i].y();
    diagram->vertices[i] = my_vertex;
  }

  // diagram.num_cells = vd.num_cells();
  // diagram.vertices = vd.vertices();
  // diagram.num_vertices = vd.num_vertices();
  // diagram.edges = vd.edges();
  // diagram.num_edges = vd.num_edges();

  std::cout << "returning diagram to JS" << std::endl;
  std::cout << "num vertices (cpp): " << diagram->num_vertices << std::endl;
  return diagram;
}
}

} // namespace gui2one