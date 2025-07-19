cmake_minimum_required(VERSION 3.13)

include(FetchContent)
Set(FETCHCONTENT_QUIET FALSE)
function(FetchDependencyAndMakeAvailable NAME URL TAG)
  FetchContent_Declare(
    ${NAME}
    GIT_REPOSITORY ${URL}
    GIT_TAG        ${TAG}
    GIT_PROGRESS TRUE
  )
  FetchContent_MakeAvailable(${NAME})

endfunction()



set (CMAKE_CXX_STANDARD 20)

set(OpenCV_LIBDIR "D:\\dev\\opencv\\build_emscripten\\install\\lib")
if(MSVC)
    set(OpenCV_DIR "D:\\dev\\opencv\\build\\install") 
    set(OpenCV_LIBDIR "D:\\dev\\opencv\\build\\install\\x64\\vc17\\staticlib") 
endif()
    
message(STATUS "Opencv dir: ${OpenCV_DIR}")
project(voronoi)


add_definitions(-D_CRT_SECURE_NO_WARNINGS)

set(INCLUDE_DIRS
    # D:/Boost/include/boost-1_88
    C:/Users/Sprayfly/AppData/Local/emsdk/upstream/emscripten
    ${CMAKE_CURRENT_BINARY_DIR}/_deps/jc_voronoi-src/src/
    "D:\\dev\\opencv\\build\\install\\include"
    "${OpenCV_DIR}\\include\\opencv4"
    "${OpenCV_DIR}\\include")
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

FetchDependencyAndMakeAvailable(glm "https://github.com/g-truc/glm.git" "2d4c4b4dd31fde06cfffad7915c2b3006402322f")
target_include_directories(${PROJECT_NAME} PUBLIC
$<TARGET_PROPERTY:glm,INTERFACE_INCLUDE_DIRECTORIES>
)  
FetchDependencyAndMakeAvailable(jc_voronoi "https://github.com/JCash/voronoi" "ffbfa6475c97f1bbc74c4b336667f39d83851902")

target_precompile_headers(${PROJECT_NAME} PUBLIC src/pch.hpp)

target_include_directories(${PROJECT_NAME} PUBLIC 
${INCLUDE_DIRS}
)
target_link_directories(${PROJECT_NAME} PUBLIC 
    ${OpenCV_LIBDIR}
    "D:\\dev\\opencv\\build\\install\\x64\\vc17\\staticlib"
)

# Detect compiler and disable warnings accordingly
if(MSVC)
    # Link or compile with /MT for MSVC
    target_compile_options(${PROJECT_NAME} PUBLIC /MD)

    # Disable warnings for MSVC
    target_compile_options(${PROJECT_NAME} PUBLIC /w)
else()
    # Disable warnings for GCC, Clang, or Emscripten (which uses Clang)
    target_compile_options(${PROJECT_NAME} PUBLIC -w)
endif()

if( MSVC)
    # this does not compile (MSVC)
    target_link_options(${PROJECT_NAME} PUBLIC /NODEFAULTLIB:libcmt.lib)
    target_link_libraries(${PROJECT_NAME} opencv_world4130.lib)
endif()
if(EMSCRIPTEN)

    target_link_libraries(${PROJECT_NAME} libopencv_world.a)
    set(CMAKE_CXX_FLAGS "-O3")
    target_precompile_headers(
        ${PROJECT_NAME} PUBLIC
        src/pch.hpp)
    target_compile_options(
        ${PROJECT_NAME} PUBLIC
        "-sSHARED_MEMORY=0" 
        # "-fsanitize=leak"        
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
        "-sEXPORTED_FUNCTIONS=_malloc,_free, _build_diagram, _find_contours, _free_diagram"
        "-sEXPORTED_RUNTIME_METHODS=['ccall','cwrap','getValue','setValue']"

    )


endif()