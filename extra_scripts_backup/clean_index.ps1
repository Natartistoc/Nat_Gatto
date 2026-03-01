
$file = "c:\Users\web\.gemini\antigravity\scratch\Nat_Gatto\index.html"
$content = Get-Content -Path $file -Raw -Encoding UTF8

# Fix squashed text in index.html specifically
$content = $content -replace "senio3D", "Senior 3D Artist"
$content = $content -replace "senior3D", "Senior 3D Artist"
$content = $content -replace "Senior 3D &middot; LEAD 3D &middot; ART DIRECTOR", "SENIOR 3D ARTIST &middot; ART DIRECTOR"
$content = $content -replace "SENIOR 3D &middot; LEAD 3D &middot; ART DIRECTOR", "SENIOR 3D ARTIST &middot; ART DIRECTOR"
$content = $content -replace "artdirector", "Art Director"
$content = $content -replace "ArtDirector", "Art Director"
$content = $content -replace "LEAD 3D &middot; ", ""
$content = $content -replace " &middot; LEAD 3D", ""
$content = $content -replace "Senior/LEAD 3D Artist", "Senior 3D Artist"

# Fix Footer
$content = $content -replace "Let'sCreateTogether", "Let's Create Together"

# Fix Contact Section Case (Very Important for CSS)
$content = $content -replace "CONTACT-container", "contact-container"
$content = $content -replace "CONTACT-text", "contact-text"
$content = $content -replace "CONTACT-form-wrapper", "contact-form-wrapper"
$content = $content -replace "CONTACT-form", "contact-form"
$content = $content -replace "CONTACT-input", "contact-input"

# Fix About Section Squashed Text
$content = $content -replace "SENIOR 3D Artist&ART DIRECTORwith10\+ years", "Senior 3D Artist & Art Director with 10+ years"
$content = $content -replace "across games,", "across games, "
$content = $content -replace "high-quality 3D assetsfromconcepttofinalrender", "high-quality 3D assets from concept to final render"
$content = $content -replace "coveringthefull production pipeline", "covering the full production pipeline"
$content = $content -replace "AISoftware&APIIntegration", "AI Software & API Integration"

# Fix Demo Reel Visibility (Safety check for opacity)
# Ensure the video container and elements are cleaned up
$content = $content -replace 'id="hero-video" autoplay loop muted playsinline class="hero-video"', 'id="hero-video" autoplay loop muted playsinline class="hero-video" style="opacity: 1;"'

Set-Content -Path $file -Value $content -Encoding UTF8
