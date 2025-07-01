Import-Module $PSScriptRoot/powershell/utils.psm1 -Force

$build_dir = "./build_wasm"


emmake make -C $build_dir -j8

CreateFolder("./httpdocs")
# copy build files to httpdocs
Copy-Item -Path $build_dir/* -Include *.js, *.ts, *.wasm -Destination ./httpdocs
Copy-Item -Path ./js/* -Destination ./httpdocs
Copy-Item -Path ./index.html -Destination ./httpdocs


# RemoveFolderIfExists("./httpdocs/Resources")

# Copy-Item -Path ./Resources -Destination ./httpdocs -Force -Recurse