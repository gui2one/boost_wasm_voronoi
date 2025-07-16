Import-Module $PSScriptRoot/powershell/utils.psm1 -Force

$build_dir = "./build"


cmake --build $build_dir --config=Release -j8

# $executable = "$build_dir/Release/boost_voronoi.exe"

# & $executable
