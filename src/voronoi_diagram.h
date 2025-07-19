#pragma once
#ifndef VORONOI_DIAGRAM_H
#define VORONOI_DIAGRAM_H

#include "my_types.h"
#include "pch.hpp"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "jc_voronoi.h"

extern "C" {

EMSCRIPTEN_KEEPALIVE
Diagram *build_diagram(float *points, size_t length, float *bounds);

EMSCRIPTEN_KEEPALIVE
void free_diagram(Diagram *diagram);
}

#endif