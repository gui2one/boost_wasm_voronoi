#pragma once
#ifndef VORONOI_DIAGRAM_H
#define VORONOI_DIAGRAM_H

#include "my_types.h"
#include "pch.hpp"

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
typedef segment_data<coordinate_type> Segment;

extern "C" {
// rect_type compute_bounding_rect(const std::vector<Point> &points);
rect_type compute_bounding_rect(GVertex *points, int size);

Diagram *build_diagram(float *points, size_t length, float *bounds);
void free_diagram(Diagram *diagram);
}

#endif