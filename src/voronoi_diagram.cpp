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
Diagram *build_diagram(float *points, size_t len) {
  std::vector<point_data<double>> vertices;

  for (size_t i = 0; i + 1 < len; i += 2) {
    vertices.push_back({points[i], points[i + 1]});

    // std::cout << "vertex: " << points[i] << ", " << points[i + 1] <<
    // std::endl;
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

  for (size_t i = 0; i < diagram->num_vertices; i++) {
    Vertex my_vertex;
    my_vertex.x = vd.vertices()[i].x();
    my_vertex.y = vd.vertices()[i].y();
    diagram->vertices[i] = my_vertex;

    // std::cout << diagram->vertices[i].x << ", " << diagram->vertices[i].y
    //           << std::endl;
  }

  for (size_t i = 0; i < vd.num_edges(); i++) {
    Edge my_edge;
    const auto &vtx0 = vd.edges()[i].vertex0();
    const auto &vtx1 = vd.edges()[i].vertex1();
    my_edge.vertex0.x = vtx0->x();
    my_edge.vertex0.y = vtx0->y();

    my_edge.vertex1.x = vtx1->x();
    my_edge.vertex1.y = vtx1->y();

    // std::cout << "vtx0: " << my_edge.vertex0.x << ", " << my_edge.vertex0.y
    //           << std::endl;
    diagram->edges[i] = my_edge;
  }

  // std::cout << "returning diagram to JS" << std::endl;
  std::cout << "num vertices (cpp): " << diagram->num_vertices << std::endl;
  std::cout << "num edges (cpp): " << diagram->num_edges << std::endl;
  std::cout << "num cells (cpp): " << diagram->num_cells << std::endl;
  return diagram;
}
}

} // namespace gui2one