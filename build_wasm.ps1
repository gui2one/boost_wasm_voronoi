Import-Module $PSScriptRoot/powershell/utils.psm1 -Force

$build_dir = "./build_wasm"
$dist_dir = "./dist"

# actual build !!
emmake make -C $build_dir -j8

# copy build files to httpdocs
ClearFolderContent $dist_dir
CreateFolder $dist_dir  $false
CreateFolder $dist_dir/build_wasm  $false
CreateFolder $dist_dir/js  $false
Copy-Item -Path $build_dir/* -Include *.js, *.ts, *.wasm -Destination $dist_dir/build_wasm
Copy-Item -Path ./js/* -Destination $dist_dir
# Copy-Item -Path ./index.html -Destination $dist_dir

# Copy-Item -Path $build_dir/* -Include *.js, *.ts, *.wasm -Destination ./preview_dist




