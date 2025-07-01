Import-Module $PSScriptRoot/powershell/utils.psm1 -Force

$build_dir = "./build_wasm"
CreateFolder($build_dir)

# $em_root = "C:\Users\Sprayfly\AppData\Local\emsdk\upstream\emscripten\"
emcmake cmake -B $build_dir

