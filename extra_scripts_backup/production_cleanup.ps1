# Production Ready Cleanup Script
# This script moves temporary/test files to a 'backups' directory to keep the root folder clean for deployment.

$backupDir = "backups_prep_production"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# List of patterns to move (matching the .gitignore logic)
$patterns = @(
    "*cleaned.html",
    "*fixed*.html",
    "*test.html",
    "*restored*.html",
    "*new.html",
    "final_*.ps1",
    "update_*.ps1",
    "cleanup_*.ps1",
    "fix_*.py",
    "clean_*.py",
    "fix_*.ps1",
    "de_squash.ps1",
    "mass_de_squash.*",
    "deep_restore.ps1",
    "ultimate_*.ps1",
    "ultra_restore.ps1",
    "run_backup.ps1",
    "set_content_fix.ps1",
    "line_by_line_fix.ps1",
    "*-fixed.html",
    "NAVBAR_DESIGN.md",
    "NAVIGATION_DEBUG_REPORT.md",
    "VIEW_MY_SITE.html",
    "CLEAR_CACHE_INSTRUCTIONS.md"
)

foreach ($pattern in $patterns) {
    Get-ChildItem -Path $pattern | ForEach-Object {
        Write-Host "Moving $($_.Name) to $backupDir"
        Move-Item -Path $_.FullName -Destination "$backupDir\" -Force
    }
}

Write-Host "Cleanup complete! Your root directory is now ready for deployment."
