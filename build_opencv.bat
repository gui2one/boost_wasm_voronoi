@REM configure
emcmake cmake .. ^
  -DCMAKE_BUILD_TYPE=Release ^
  -DBUILD_SHARED_LIBS=OFF ^
  -DBUILD_opencv_js=OFF ^
  -DBUILD_opencv_world=ON ^
  -DBUILD_TESTS=OFF ^
  -DBUILD_PERF_TESTS=OFF ^
  -DBUILD_opencv_ts=OFF ^
  -DWITH_TBB=OFF ^
  -DWITH_OPENMP=OFF ^
  -DWITH_IPP=OFF ^
  -DWITH_PTHREADS_PF=OFF ^
  -DWITH_CONCURRENCY=OFF ^
  -DWITH_ITT=OFF ^
  -DWITH_EIGEN=OFF ^
  -DENABLE_PARALLEL_FOR_=OFF ^
  -DCMAKE_CXX_FLAGS="-msimd128"


@REM build
emmake make -j

@REM install
emmake make install