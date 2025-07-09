#pragma once
#ifndef LIB_DEPS_H
#define LIB_DEPS_H

#include <boost/polygon/polygon.hpp>
#include <boost/polygon/voronoi.hpp>

#include <iostream>
#include <memory>
#include <string>
#include <vector>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>
#endif

#endif