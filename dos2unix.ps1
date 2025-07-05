Get-ChildItem -Path "C:\development\dev\ol-api" -Filter "*.*" -Recurse | ForEach-Object {
    $content = Get-Content -Raw -Path $_.FullName
    $content -replace "`r`n", "`n" | Set-Content -Path $_.FullName -NoNewline
}