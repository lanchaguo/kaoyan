Get-ChildItem "d:\workbuddy-products\kaoyan\ky-api\src\controllers\exam" -Filter "*.js" | ForEach-Object {
    $content = [IO.File]::ReadAllText($_.FullName)
    if ($content -match "'../models/index'") {
        $newContent = $content -replace "'../models/index'", "'../../models/examModels'"
        [IO.File]::WriteAllText($_.FullName, $newContent)
        Write-Host "Fixed: $($_.Name)"
    }
}
