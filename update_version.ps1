Get-ChildItem -Filter *.html | ForEach-Object {
    $content = Get-Content $_.FullName
    $newContent = $content -replace 'main.js\?v=\d+\.\d+', 'main.js?v=32.0'
    $newContent | Set-Content $_.FullName
}
