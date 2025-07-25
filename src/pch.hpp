#pragma once
#ifndef LIB_DEPS_H
#define LIB_DEPS_H

#include "glm/glm.hpp"

// #include <boost/polygon/polygon.hpp>
// #include <boost/polygon/voronoi.hpp>

#include <opencv2/core.hpp>
// #include <opencv2/imgcodecs.hpp>
#include <opencv2/imgproc.hpp>

#include <iostream>
#include <memory>
#include <random>
#include <string>
#include <vector>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>
#endif

#endif