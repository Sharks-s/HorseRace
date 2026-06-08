$ErrorActionPreference = "Stop"
$basePath = "c:\Users\PC 2024\Desktop\IdeaProjects\swd\HorseRace\be\src\main\java\com\example\be"

Write-Host "Creating directories..."
New-Item -ItemType Directory -Force -Path "$basePath\common\config" | Out-Null
New-Item -ItemType Directory -Force -Path "$basePath\common\controller" | Out-Null
New-Item -ItemType Directory -Force -Path "$basePath\common\dto\response" | Out-Null
New-Item -ItemType Directory -Force -Path "$basePath\common\exception" | Out-Null

New-Item -ItemType Directory -Force -Path "$basePath\module\auth\controller" | Out-Null
New-Item -ItemType Directory -Force -Path "$basePath\module\auth\dto\request" | Out-Null
New-Item -ItemType Directory -Force -Path "$basePath\module\auth\dto\response" | Out-Null
New-Item -ItemType Directory -Force -Path "$basePath\module\auth\model\entity" | Out-Null
New-Item -ItemType Directory -Force -Path "$basePath\module\auth\model\enums" | Out-Null
New-Item -ItemType Directory -Force -Path "$basePath\module\auth\repository" | Out-Null
New-Item -ItemType Directory -Force -Path "$basePath\module\auth\service\impl" | Out-Null

Write-Host "Moving common files..."
Move-Item -Path "$basePath\config\OpenApiConfig.java" -Destination "$basePath\common\config\"
Move-Item -Path "$basePath\config\SecurityConfig.java" -Destination "$basePath\common\config\"
Move-Item -Path "$basePath\controller\HealthController.java" -Destination "$basePath\common\controller\"
Move-Item -Path "$basePath\dto\response\ApiResponse.java" -Destination "$basePath\common\dto\response\"
Move-Item -Path "$basePath\exception\GlobalExceptionHandler.java" -Destination "$basePath\common\exception\"

Write-Host "Moving auth files..."
Move-Item -Path "$basePath\controller\AuthController.java" -Destination "$basePath\module\auth\controller\"
Move-Item -Path "$basePath\dto\request\LoginRequest.java" -Destination "$basePath\module\auth\dto\request\"
Move-Item -Path "$basePath\dto\request\RegisterRequest.java" -Destination "$basePath\module\auth\dto\request\"
Move-Item -Path "$basePath\dto\response\AuthResponse.java" -Destination "$basePath\module\auth\dto\response\"
Move-Item -Path "$basePath\model\entity\User.java" -Destination "$basePath\module\auth\model\entity\"
Move-Item -Path "$basePath\model\enums\Role.java" -Destination "$basePath\module\auth\model\enums\"
Move-Item -Path "$basePath\model\enums\UserStatus.java" -Destination "$basePath\module\auth\model\enums\"
Move-Item -Path "$basePath\repository\UserRepository.java" -Destination "$basePath\module\auth\repository\"
Move-Item -Path "$basePath\service\UserService.java" -Destination "$basePath\module\auth\service\"
Move-Item -Path "$basePath\service\impl\UserServiceImpl.java" -Destination "$basePath\module\auth\service\impl\"

Write-Host "Removing old empty directories..."
Remove-Item -Path "$basePath\config" -Recurse -Force
Remove-Item -Path "$basePath\controller" -Recurse -Force
Remove-Item -Path "$basePath\dto" -Recurse -Force
Remove-Item -Path "$basePath\exception" -Recurse -Force
Remove-Item -Path "$basePath\model" -Recurse -Force
Remove-Item -Path "$basePath\repository" -Recurse -Force
Remove-Item -Path "$basePath\service" -Recurse -Force

Write-Host "Move complete!"
