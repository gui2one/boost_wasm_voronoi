#pragma once
#ifndef CONTOUR_FINDER_H
#define CONTOUR_FINDER_H

#include "pch.hpp"

struct ContourVertex {
  double x;
  double y;
};

struct Contour {
  size_t num_pts;
  ContourVertex *pts;
};

extern "C" {
Contour *find_contours(uint8_t *pixelData, size_t width, size_t height);
}
#endif // CONTOUR_FINDER_H