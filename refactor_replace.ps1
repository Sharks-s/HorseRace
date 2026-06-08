$ErrorActionPreference = "Stop"
$basePath = "c:\Users\PC 2024\Desktop\IdeaProjects\swd\HorseRace\be\src\main\java\com\example\be"
$files = Get-ChildItem -Path $basePath -Recurse -Filter *.java

Write-Host "Updating packages and imports in $($files.Count) files..."

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw

    # 1. Update Package Declaration based on directory structure
    $relativePath = $f.FullName.Substring($basePath.Length + 1)
    $dirName = [System.IO.Path]::GetDirectoryName($relativePath)
    $newPackageStr = $dirName -replace '\\', '.'
    # Root BeApplication.java has no sub-package under com.example.be
    if ($newPackageStr -eq "") {
        $newPackageLine = "package com.example.be;"
    } else {
        $newPackageLine = "package com.example.be.$newPackageStr;"
    }
    
    # Replace 'package com.example.be.something;' with new package.
    # Note: be careful not to replace 'package com.example.be;' if it's the root app
    if ($newPackageStr -ne "") {
        $content = $content -replace 'package com\.example\.be(\.[a-zA-Z0-9_\.]+)*;', $newPackageLine
    }

    # 2. Update Imports
    # Common
    $content = $content -replace 'import com\.example\.be\.config', 'import com.example.be.common.config'
    $content = $content -replace 'import com\.example\.be\.exception', 'import com.example.be.common.exception'
    $content = $content -replace 'import com\.example\.be\.dto\.response\.ApiResponse', 'import com.example.be.common.dto.response.ApiResponse'
    $content = $content -replace 'import com\.example\.be\.controller\.HealthController', 'import com.example.be.common.controller.HealthController'
    
    # Auth module
    $content = $content -replace 'import com\.example\.be\.controller\.AuthController', 'import com.example.be.module.auth.controller.AuthController'
    $content = $content -replace 'import com\.example\.be\.dto\.request', 'import com.example.be.module.auth.dto.request'
    $content = $content -replace 'import com\.example\.be\.dto\.response\.AuthResponse', 'import com.example.be.module.auth.dto.response.AuthResponse'
    $content = $content -replace 'import com\.example\.be\.model', 'import com.example.be.module.auth.model'
    $content = $content -replace 'import com\.example\.be\.repository', 'import com.example.be.module.auth.repository'
    $content = $content -replace 'import com\.example\.be\.service', 'import com.example.be.module.auth.service'

    Set-Content -Path $f.FullName -Value $content
}

Write-Host "Replacements complete!"
