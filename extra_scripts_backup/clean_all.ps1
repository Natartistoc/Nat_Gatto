
$files = Get-ChildItem "*.html"
foreach ($file in $files) {
    Write-Host "Re-Cleaning and fixing spaces for $($file.Name)..."
    $content = Get-Content $file.FullName -Raw
    
    # Remove bullets if any remain
    $cleaned = $content -replace " &bull; ", ""
    $cleaned = $cleaned -replace "&bull; ", ""
    $cleaned = $cleaned -replace " &bull;", ""
    $cleaned = $cleaned -replace "&bull;", ""
    
    # Fix the accidental spaces I introduced
    $cleaned = $cleaned -replace "re l=", "rel="
    $cleaned = $cleaned -replace "hre f=", "href="
    $cleaned = $cleaned -replace "metanam e=", "meta name="
    $cleaned = $cleaned -replace "metacharse t=", "meta charset="
    $cleaned = $cleaned -replace "point s=", "points="
    $cleaned = $cleaned -replace "viewBo x=", "viewBox="
    $cleaned = $cleaned -replace "source src=", "source src="
    $cleaned = $cleaned -replace "i d=", "id="
    $cleaned = $cleaned -replace "clas s=", "class="
    $cleaned = $cleaned -replace "htmllan g=", "html lang="
    $cleaned = $cleaned -replace "DOCTYPEhtml", "DOCTYPE html"
    $cleaned = $cleaned -replace "re st", "rest"
    
    # More precise attribute spacing
    # Match word followed by attribute= (no space)
    # e.g. <linkrel="...
    $cleaned = $cleaned -replace "<([a-z0-9]+)([a-z]+)=", "<$1 $2="
    
    # Match quote followed by attribute= (no space)
    # e.g. "href="...
    $cleaned = $cleaned -replace "`"([a-z]+)=", "`" $1="
    
    # Specific fixes for common squashed pairs
    $cleaned = $cleaned -replace "playsinline", " playsinline "
    $cleaned = $cleaned -replace "autoplay", " autoplay "
    $cleaned = $cleaned -replace "loop", " loop "
    $cleaned = $cleaned -replace "muted", " muted "
    
    # Clean up double spaces
    while ($cleaned -match "  ") { $cleaned = $cleaned -replace "  ", " " }
    $cleaned = $cleaned -replace "> <", "><"
    
    Set-Content -Path $file.FullName -Value $cleaned -Encoding UTF8
}
