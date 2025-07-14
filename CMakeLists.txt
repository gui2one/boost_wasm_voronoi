cmake_minimum_required(VERSION 3.13)


set (CMAKE_CXX_STANDARD 20)
set(OpenCV_DIR "D:\\dev\\opencv\\build_emscripten\\install")  # or path to OpenCVConfig.cmake

project(boost_voronoi)


add_definitions(-D_CRT_SECURE_NO_WARNINGS)

set(INCLUDE_DIRS
    D:/Boost/include/boost-1_88
    C:/Users/Sprayfly/AppData/Local/emsdk/upstream/emscripten
    vendor/glm
    "${OpenCV_DIR}\\include\\opencv4")
include_directories(
    ${INCLUDE_DIRS}
)

add_executable(${PROJECT_NAME}
    src/main.cpp
    src/voronoi_diagram.cpp
    src/contour_finder.cpp
    src/algorithms/PoissonDiscSampling.cpp
    src/algorithms/RNDGenerator.cpp
)
target_precompile_headers(${PROJECT_NAME} PUBLIC src/pch.hpp)

target_include_directories(${PROJECT_NAME} PUBLIC "${OpenCV_DIR}\\include\\opencv4")
target_link_directories(${PROJECT_NAME} PUBLIC 
    ${OpenCV_DIR}\\lib
)
target_link_libraries(${PROJECT_NAME} libopencv_world.a)
# Detect compiler and disable warnings accordingly
if(MSVC)
    # Disable warnings for MSVC
    target_compile_options(${PROJECT_NAME} PUBLIC /w)
else()
    # Disable warnings for GCC, Clang, or Emscripten (which uses Clang)
    target_compile_options(${PROJECT_NAME} PUBLIC -w)
endif()


if(EMSCRIPTEN)


set(CMAKE_CXX_FLAGS "-O3")
target_precompile_headers(
    ${PROJECT_NAME} PUBLIC
    src/pch.hpp)
target_compile_options(
    ${PROJECT_NAME} PUBLIC
    "-sSHARED_MEMORY=0" 
)
    
target_link_options(
    ${PROJECT_NAME} PUBLIC
    "-sWASM=1"
    "-sEXPORT_ES6=1"
    "-sMODULARIZE=1"
    "-sEXPORT_NAME=Voronoi"
    "-sALLOW_MEMORY_GROWTH=1"
    "-sASSERTIONS=2"
    "-sENVIRONMENT=web"
    "-sINITIAL_MEMORY=64MB"
    "-sNO_DISABLE_EXCEPTION_CATCHING"
    "-sEXPORTED_FUNCTIONS=_malloc,_free, _build_diagram, _find_contours"
    "-sEXPORTED_RUNTIME_METHODS=['ccall','cwrap','getValue','setValue']"
)


endif()