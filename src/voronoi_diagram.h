#pragma once
#ifndef VORONOI_DIAGRAM_H
#define VORONOI_DIAGRAM_H

#include <iostream>
#include <memory>

#include <boost/polygon/polygon.hpp>
#include <boost/polygon/voronoi.hpp>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>
#endif
#include <string>
#include <vector>

using boost::polygon::construct_voronoi;
using boost::polygon::point_data;
using boost::polygon::voronoi_cell;
using boost::polygon::voronoi_diagram;
using boost::polygon::voronoi_edge;

using namespace boost::polygon;
typedef voronoi_diagram<double> VD;
typedef VD::cell_type::source_index_type source_index_type;
typedef double coordinate_type;
typedef VD::cell_type::source_category_type source_category_type;
typedef rectangle_data<coordinate_type> rect_type;
typedef point_data<coordinate_type> Point;
namespace gui2one {

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
  size_t num_vertices;
  Vertex *vertices;
};

struct Diagram {
  size_t num_vertices;
  size_t num_edges;
  size_t num_cells;
  Vertex *vertices;
  Edge *edges;
  Cell *cells;
};

extern "C" {
// rect_type compute_bounding_rect(const std::vector<Point> &points);
rect_type compute_bounding_rect(Vertex *points, int size);
Diagram *build_diagram(float *points, size_t length);
}

} // namespace gui2one

#endif