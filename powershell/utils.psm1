function Print([string]$message) {
    Write-Host "-----------------------------"
    Write-Host "$message"
    Write-Host "-----------------------------"
}
Export-ModuleMember -Function Print


function CreateFolder([string]$folder_path){
    if( Test-Path -Path $folder_path -PathType Container){
        Print("Folder exists already : $folder_path")
    }else{
        New-Item $folder_path -ItemType Directory
    }
}
Export-ModuleMember -Function CreateFolder


function RemoveFolderIfExists([string]$folder_path){
    if( Test-Path -Path $folder_path -PathType Container){
        Remove-Item $folder_path -Recurse -Force
        Write-Host "[build script] Successfully Remove Directory: $folder_path"
    }else{
        Write-Host "[build script] Directory not found : $folder_path"
    }
}
Export-ModuleMember -Function RemoveFolderIfExists


function RemoveFileIfExists([string]$file_path){
    if( Test-Path -Path $file_path -PathType Leaf){
        Remove-Item $file_path -Force
    }else{
        Write-Host "[build script] File not found : $file_path"
    }
}
Export-ModuleMember -Function RemoveFileIfExists

function ListCppFiles([string]$dir_path){
    Get-ChildItem -Path $dir_path -Recurse -Include *.cpp
}
Export-ModuleMember -Function ListCppFiles

function ListHeaderFiles([string]$dir_path){
    Get-ChildItem -Path $dir_path -Recurse -Include *.h,*.hpp
}
Export-ModuleMember -Function ListHeaderFiles

function ListWasmObjects([string]$dir_path){
    Get-ChildItem -Path $dir_path -Recurse -Include *.o
}
Export-ModuleMember -Function ListWasmObjects

function RemoveGitSubmodule(){
    $path = Read-Host -Prompt "relative path to the submodule to remove"

    # Remove the submodule entry from .git/config
    git submodule deinit -f $path
    
    # Remove the submodule directory from the superproject's .git/modules directory
    Remove-Item ".git/modules/$path" -Force -Recurse

    # Remove the entry in .gitmodules and remove the submodule directory located at path/to/submodule
    git rm -f $path

}
Export-ModuleMember -Function RemoveGitSubmodule