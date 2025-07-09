/*
code for clipping infinite edges found here :
https://www.boost.org/doc/libs/1_55_0/libs/polygon/example/voronoi_visualizer.cpp
*/

#include "voronoi_diagram.h"

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

namespace gui2one {
extern "C" {

point_data<double>
retrieve_point(const voronoi_cell<double> &cell,
               const std::vector<point_data<double>> &point_data_) {
  source_index_type index = cell.source_index();
  source_category_type category = cell.source_category();
  if (category == boost::polygon::SOURCE_CATEGORY_SINGLE_POINT) {
    return point_data_[index];
  }
  index -= point_data_.size();
  return point_data_[index];
  // if (category == boost::polygon::SOURCE_CATEGORY_SEGMENT_START_POINT) {
  //   return low(segment_data_[index]);
  // } else {
  //   return high(segment_data_[index]);
  // }
}

void clip_infinite_edge(const voronoi_edge<double> &edge,
                        std::vector<point_data<double>> &clipped_edge,
                        rect_type &brect_,
                        std::vector<point_data<double>> &point_data_) {
  const voronoi_cell<double> &cell1 = *edge.cell();
  const voronoi_cell<double> &cell2 = *edge.twin()->cell();
  point_data<double> origin, direction;
  // Infinite edges could not be created by two segment sites.
  if (cell1.contains_point() && cell2.contains_point()) {
    point_data<double> p1 = retrieve_point(cell1, point_data_);
    point_data<double> p2 = retrieve_point(cell2, point_data_);
    origin.x((p1.x() + p2.x()) * 0.5);
    origin.y((p1.y() + p2.y()) * 0.5);
    direction.x(p1.y() - p2.y());
    direction.y(p2.x() - p1.x());
  } // else {
    //  origin = cell1.contains_segment() ? retrieve_point(cell2)
    //                                    : retrieve_point(cell1);
    //  segment_type segment = cell1.contains_segment() ?
    //  retrieve_segment(cell1)
    //                                                  :
    //                                                  retrieve_segment(cell2);
    //  coordinate_type dx = high(segment).x() - low(segment).x();
    //  coordinate_type dy = high(segment).y() - low(segment).y();
    //  if ((low(segment) == origin) ^ cell1.contains_point()) {
    //    direction.x(dy);
    //    direction.y(-dx);
    //  } else {
    //    direction.x(-dy);
    //    direction.y(dx);
    //  }
  //}
  coordinate_type side = xh(brect_) - xl(brect_);
  coordinate_type koef =
      side / (std::max)(fabs(direction.x()), fabs(direction.y()));
  if (edge.vertex0() == NULL) {
    clipped_edge.push_back(point_data<double>(
        origin.x() - direction.x() * koef, origin.y() - direction.y() * koef));
  } else {
    clipped_edge.push_back(
        point_data<double>(edge.vertex0()->x(), edge.vertex0()->y()));
  }
  if (edge.vertex1() == NULL) {
    clipped_edge.push_back(point_data<double>(
        origin.x() + direction.x() * koef, origin.y() + direction.y() * koef));
  } else {
    clipped_edge.push_back(
        point_data<double>(edge.vertex1()->x(), edge.vertex1()->y()));
  }
}

EMSCRIPTEN_KEEPALIVE
Diagram *build_diagram(float *points, size_t len) {
  std::vector<point_data<double>> vertices;

  for (size_t i = 0; i + 1 < len; i += 2) {
    vertices.push_back({points[i], points[i + 1]});

    // std::cout << "vertex: " << points[i] << ", " << points[i + 1] <<
    // std::endl;
  }

  VD vd;
  construct_voronoi(vertices.begin(), vertices.end(), &vd);

  Diagram *diagram = new Diagram();

  diagram->num_cells = vd.num_cells();
  diagram->cells = new Cell[vd.num_cells()];

  diagram->num_vertices = vd.num_vertices();
  diagram->vertices = new Vertex[vd.num_vertices()];

  diagram->num_edges = vd.num_edges();
  diagram->edges = new Edge[vd.num_edges()];

  rect_type brect_2 =
      boost::polygon::construct<rect_type>(-2048, -2048, 2048, 2048);
  for (size_t i = 0; i < vd.num_cells(); i++) {
    // std::cout << "cell: " << i << std::endl;
    const auto &cell = vd.cells()[i];
    Cell my_cell;
    std::vector<Vertex> vertices_vector;

    const auto *edge = cell.incident_edge();
    const auto *start = edge;

    do {

      edge = edge->next();
      if (edge->is_infinite()) {
        std::vector<point_data<double>> clipped_edge;
        clip_infinite_edge(*edge, clipped_edge, brect_2, vertices);
        // Add both endpoints of clipped infinite edge
        for (const auto &pt : clipped_edge) {
          vertices_vector.push_back({pt.x(), pt.y()});
        }
      } else {
        if (edge->vertex0()) {
          vertices_vector.push_back(
              {edge->vertex0()->x(), edge->vertex0()->y()});
        }
        // You can also choose to add edge->vertex1() for completeness
      }

    } while (edge != start);

    my_cell.source_index = cell.source_index();
    my_cell.num_vertices = vertices_vector.size();
    my_cell.vertices = new Vertex[vertices_vector.size()];
    for (size_t j = 0; j < vertices_vector.size(); j++) {
      my_cell.vertices[j] = vertices_vector[j];
    }

    diagram->cells[i] = my_cell;
  }
  for (size_t i = 0; i < diagram->num_vertices; i++) {
    Vertex my_vertex;
    my_vertex.x = vd.vertices()[i].x();
    my_vertex.y = vd.vertices()[i].y();
    diagram->vertices[i] = my_vertex;
  }

  rect_type brect_ = boost::polygon::construct<rect_type>(-0, -0, 100, 100);

  for (size_t i = 0; i < vd.num_edges(); i++) {
    Edge my_edge;

    if (vd.edges()[i].is_infinite()) {
      std::vector<point_data<double>> clipped_edge;

      clip_infinite_edge(vd.edges()[i], clipped_edge, brect_, vertices);
      my_edge.vertex0.x = clipped_edge[0].x();
      my_edge.vertex0.y = clipped_edge[0].y();
      my_edge.vertex1.x = clipped_edge[1].x();
      my_edge.vertex1.y = clipped_edge[1].y();

    } else {

      const auto &vtx0 = vd.edges()[i].vertex0();
      const auto &vtx1 = vd.edges()[i].vertex1();
      my_edge.vertex0.x = vtx0->x();
      my_edge.vertex0.y = vtx0->y();

      my_edge.vertex1.x = vtx1->x();
      my_edge.vertex1.y = vtx1->y();

      double dist = (vtx1->x() - vtx0->x()) * (vtx1->x() - vtx0->x()) +
                    (vtx1->y() - vtx0->y()) * (vtx1->y() - vtx0->y());
    }

    diagram->edges[i] = my_edge;
  }

  std::cout << "num vertices (cpp): " << diagram->num_vertices << std::endl;
  std::cout << "num edges (cpp): " << diagram->num_edges << std::endl;
  std::cout << "num cells (cpp): " << diagram->num_cells << std::endl;
  return diagram;
}
}

} // namespace gui2one