Import-Module $PSScriptRoot/powershell/utils.psm1 -Force

$build_dir = "./build"


cmake --build $build_dir -j8

$executable = "$build_dir/Release/boost_voronoi.exe"

& $executable
