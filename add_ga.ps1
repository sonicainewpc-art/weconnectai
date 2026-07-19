Set-Location "C:\Users\Sonia\Documents\FISCALIA antigo\WEBSITE\weconnectai"

$gaLine1 = '  <script async src="https://www.googletagmanager.com/gtag/js?id=G-7ZVM988S03"></script>'
$gaLine2 = '  <script>'
$gaLine3 = '    window.dataLayer = window.dataLayer || [];'
$gaLine4 = '    function gtag(){dataLayer.push(arguments);}'
$gaLine5 = '    gtag("js", new Date());'
$gaLine6 = '    gtag("config", "G-7ZVM988S03");'
$gaLine7 = '  </script>'

$gaCode = "`n" + $gaLine1 + "`n" + $gaLine2 + "`n" + $gaLine3 + "`n" + $gaLine4 + "`n" + $gaLine5 + "`n" + $gaLine6 + "`n" + $gaLine7

$replacement = '<head>' + $gaCode

$files = @("index.html", "privacy.html", "terms.html", "apps\compliance.html", "apps\feasibility.html", "apps\licensing.html", "apps\renovation.html", "apps\energy.html")

foreach ($f in $files) {
    $path = Join-Path (Get-Location) $f
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        if ($content -notmatch "googletagmanager.com/gtag/js") {
            $newContent = $content -replace '<head>', $replacement
            Set-Content -Path $path -Value $newContent -Encoding UTF8
            Write-Host "GA adicionado a: $f"
        } else {
            Write-Host "GA ja existe em: $f (pulado)"
        }
    } else {
        Write-Host "Ficheiro nao encontrado: $f"
    }
}