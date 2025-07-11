#pragma once
#ifndef CONTOUR_FINDER_H
#define CONTOUR_FINDER_H

#include "pch.hpp"

extern "C" {
EMSCRIPTEN_KEEPALIVE
std::vector<std::vector<cv::Point>>
process_alpha_contours(uint8_t *pixelData, int width, int height);
}
#endif // CONTOUR_FINDER_H