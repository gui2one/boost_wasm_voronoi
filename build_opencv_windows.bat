@REM configure
cmake .. ^
  -DCMAKE_BUILD_TYPE=Release ^
  -DBUILD_SHARED_LIBS=OFF ^
  -DBUILD_opencv_js=OFF ^
  -DBUILD_opencv_world=ON ^
  -DBUILD_TESTS=OFF ^
  -DBUILD_PERF_TESTS=OFF ^
  -DBUILD_opencv_ts=OFF


@REM build
cmake --build . --config=Release -j

@REM install
@REM make install