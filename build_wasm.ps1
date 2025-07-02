Import-Module $PSScriptRoot/powershell/utils.psm1 -Force

$build_dir = "./build_wasm"
$httpdocs_dir = "./httpdocs"

# actual build !!
emmake make -C $build_dir -j8

# copy build files to httpdocs
ClearFolderContent $httpdocs_dir
CreateFolder $httpdocs_dir  $false
Copy-Item -Path $build_dir/* -Include *.js, *.ts, *.wasm -Destination ./httpdocs
Copy-Item -Path ./js/* -Destination $httpdocs_dir
Copy-Item -Path ./index.html -Destination $httpdocs_dir
