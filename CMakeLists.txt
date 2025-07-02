cmake_minimum_required(VERSION 3.13)


set (CMAKE_CXX_STANDARD 20)

project(boost_voronoi)


add_definitions(-D_CRT_SECURE_NO_WARNINGS)

include_directories(
    D:/Boost/include/boost-1_88
    C:/Users/Sprayfly/AppData/Local/emsdk/upstream/emscripten
)
add_executable(${PROJECT_NAME}
    src/main.cpp
    src/voronoi_diagram.cpp
)

target_include_directories(
    ${PROJECT_NAME} PUBLIC
    D:/Boost/include/boost-1_88
    C:/Users/Sprayfly/AppData/Local/emsdk/upstream/emscripten
)

# Detect compiler and disable warnings accordingly
if(MSVC)
    # Disable warnings for MSVC
    target_compile_options(${PROJECT_NAME} PRIVATE /w)
else()
    # Disable warnings for GCC, Clang, or Emscripten (which uses Clang)
    target_compile_options(${PROJECT_NAME} PRIVATE -w)
endif()


if(EMSCRIPTEN)


set(CMAKE_CXX_FLAGS "-O3")

target_compile_options(
    ${PROJECT_NAME} PUBLIC
    "-sSHARED_MEMORY=1"
    
    
    )
    
    target_link_options(
        ${PROJECT_NAME} PUBLIC
        "-sWASM=1"
        "-lembind"
        "-sEXPORT_ES6=1"
        "-sMODULARIZE=1"
        "-sEXPORT_NAME=Voronoi"
        "-sALLOW_MEMORY_GROWTH=1"
        "-sEXPORTED_FUNCTIONS=_malloc,_free"
        "-sASSERTIONS"
)


# add_compile_options("SHELL:-s USE_PTHREADS -pthread")
# add_link_options("SHELL:-s USE_PTHREADS -pthread")

endif()