$ErrorActionPreference = 'Stop'

# CLI args (Unix-style: --long, -short, all lowercase):
#   --init             Generate the mkcert TLS cert and exit
#   --rebuild          Pass --build to docker compose up
#   --profile <name>   Compose profile to activate (default: all)
#   -p <name>          Alias for --profile
$Init = $false
$Rebuild = $false
$Profile = 'all'
for ($i = 0; $i -lt $args.Count; $i++) {
    switch -CaseSensitive ($args[$i]) {
        '--init'    { $Init = $true }
        '--rebuild' { $Rebuild = $true }
        '--profile' {
            if ($i + 1 -ge $args.Count) { throw "--profile requires a value" }
            $i++; $Profile = $args[$i]
        }
        '-p' {
            if ($i + 1 -ge $args.Count) { throw "-p requires a value" }
            $i++; $Profile = $args[$i]
        }
        default { throw "Unknown argument: $($args[$i])" }
    }
}

function Test-HostsWritable {
    # Docker Desktop translates Windows ACLs to Linux mode bits via the
    # BUILTIN\Users (or Everyone) ACE. The hostswriter container can only
    # write when one of those identities has Modify/Write on the hosts file.
    $hostsPath = Join-Path $env:SystemRoot 'System32\drivers\etc\hosts'
    try {
        $acl = Get-Acl -Path $hostsPath -ErrorAction Stop
    } catch {
        return $false
    }
    $writeMask = [System.Security.AccessControl.FileSystemRights]::Write
    foreach ($ace in $acl.Access) {
        if ($ace.AccessControlType -ne 'Allow') { continue }
        $name = $ace.IdentityReference.Value
        if ($name -ieq 'Everyone' -or $name -ieq 'BUILTIN\Users' -or $name -ieq 'NT AUTHORITY\Authenticated Users') {
            if (($ace.FileSystemRights -band $writeMask) -ne 0) { return $true }
        }
    }
    return $false
}

function Test-IsAdmin {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    $p  = New-Object Security.Principal.WindowsPrincipal($id)
    return $p.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Grant-HostsWriteAccess {
    $hostsPath = Join-Path $env:SystemRoot 'System32\drivers\etc\hosts'
    if (Test-IsAdmin) {
        & icacls $hostsPath '/grant' 'BUILTIN\Users:(M)' | Out-Null
    } else {
        Write-Host "Requesting elevation to grant Modify on hosts file to BUILTIN\Users..." -ForegroundColor Yellow
        $argStr = "`"$hostsPath`" /grant `"BUILTIN\Users:(M)`""
        Start-Process icacls.exe -Verb RunAs -ArgumentList $argStr -Wait
    }
}

# Run docker compose with the repo root as the project directory so:
#   - .env auto-loads from the repo root
#   - relative paths in the compose file resolve from the repo root
#     (e.g. ./headapps/mockingbird, ./docker/traefik/certs)
$composeFile = 'linux-containers/docker-compose.yml'

if (-not (Test-Path (Join-Path $PSScriptRoot '.env'))) {
    Write-Host "Copying .env.example -> .env" -ForegroundColor Yellow
    Copy-Item (Join-Path $PSScriptRoot '.env.example') (Join-Path $PSScriptRoot '.env')
}

if ($Init) {
    Write-Host "Generating mkcert cert via linux-containers /tools/mkcert.ps1..." -ForegroundColor Cyan
    & (Join-Path $PSScriptRoot 'linux-containers/tools/mkcert.ps1') -sanList "mockingbird.local","*.location-finder.local","*.article-starter.local","*.product-listing.local","*.skate-park.local","*.basic.local"
    Write-Host "Cert generated. You can now run start.ps1 (no -Init) to bring up the stack." -ForegroundColor Green
    return
}

if (-not (Test-HostsWritable)) {
    Write-Host "Hosts file is not writable by your user - hostswriter would crash with no write access." -ForegroundColor Yellow
    Grant-HostsWriteAccess
    if (Test-HostsWritable) {
        Write-Host "Hosts file is now writable." -ForegroundColor Green
    } else {
        Write-Host "Hosts file is still not writable. hostswriter will crash-loop; add the entries to C:\Windows\System32\drivers\etc\hosts manually, or rerun and accept the UAC prompt." -ForegroundColor Red
    }
}

$composeArgs = @('compose', '--project-directory', $PSScriptRoot, '-f', $composeFile, '--profile', $Profile, 'up', '-d')
if ($Rebuild) { $composeArgs += '--build' }

Write-Host "Starting stack (profile: $Profile)..." -ForegroundColor Cyan
docker @composeArgs
if ($LASTEXITCODE -ne 0) {
    Write-Host "docker compose up failed (exit $LASTEXITCODE). Inspect failing containers with 'docker ps -a' and 'docker logs <name>'." -ForegroundColor Red
    exit $LASTEXITCODE
}

# Read COMPOSE_PROJECT_NAME from .env so we know what to inspect (default
# matches docker compose's own fallback).
$envFile = Join-Path $PSScriptRoot '.env'
$projectName = (Get-Content $envFile | Where-Object { $_ -match '^\s*COMPOSE_PROJECT_NAME\s*=' } |
    ForEach-Object { ($_ -split '=', 2)[1].Trim() } | Select-Object -First 1)
if (-not $projectName) { $projectName = Split-Path $PSScriptRoot -Leaf }
$traefik = "$projectName-traefik"

# docker compose up -d already blocks until depends_on (service_healthy)
# conditions are satisfied, so by the time we get here every rendering
# container under the active profile is healthy. Traefik still needs a few
# seconds to come up and pass its own ping — poll for that.
Write-Host "Waiting for traefik to report healthy..." -ForegroundColor Cyan
$timeoutSec = 120
$intervalSec = 2
$elapsed = 0
$lastStatus = ''
while ($elapsed -lt $timeoutSec) {
    $status = (docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' $traefik 2>$null)
    if ($LASTEXITCODE -ne 0) { $status = '(container not found)' }
    if ($status -eq 'healthy')   { break }
    if ($status -eq 'unhealthy') { Write-Host "Traefik is unhealthy. Run 'docker logs $traefik' to investigate." -ForegroundColor Red; exit 1 }
    if ($status -ne $lastStatus) { Write-Host "  traefik status: $status" -ForegroundColor DarkGray; $lastStatus = $status }
    Start-Sleep -Seconds $intervalSec
    $elapsed += $intervalSec
}
if ($elapsed -ge $timeoutSec) {
    Write-Host "Timed out after ${timeoutSec}s waiting for traefik to be healthy. Last status: $lastStatus" -ForegroundColor Red
    exit 1
}
Write-Host "  traefik: healthy" -ForegroundColor Green

docker compose --project-directory $PSScriptRoot -f $composeFile --profile $Profile ps
Write-Host ""
Write-Host "Mockingbird:           https://mockingbird.local" -ForegroundColor Green
Write-Host "Traefik UI:            http://localhost:18080"    -ForegroundColor Green
Write-Host ""

# Print URLs for only the rendering services that the active profile started.
$urlMap = [ordered]@{
    'next-location-finder'  = 'https://next.location-finder.local'
    'next-article-starter'  = 'https://next.article-starter.local'
    'next-product-listing'  = 'https://next.product-listing.local'
    'next-skate-park'       = 'https://next.skate-park.local'
    'next-basic'            = 'https://next.basic.local'
    'astro-location-finder' = 'https://astro.location-finder.local'
    'astro-article-starter' = 'https://astro.article-starter.local'
    'astro-product-listing' = 'https://astro.product-listing.local'
    'astro-skate-park'      = 'https://astro.skate-park.local'
    'astro-basic'           = 'https://astro.basic.local'
}
$activeServices = @(docker compose --project-directory $PSScriptRoot -f $composeFile --profile $Profile ps --services --filter "status=running" 2>$null)

$activeNext = @($urlMap.Keys | Where-Object { $_ -like 'next-*' -and $activeServices -contains $_ })
if ($activeNext.Count -gt 0) {
    Write-Host "Next.js apps:" -ForegroundColor Cyan
    foreach ($svc in $activeNext) { Write-Host ("  {0,-22} {1}" -f $svc, $urlMap[$svc]) }
    Write-Host ""
}

$activeAstro = @($urlMap.Keys | Where-Object { $_ -like 'astro-*' -and $activeServices -contains $_ })
if ($activeAstro.Count -gt 0) {
    Write-Host "Astro apps:" -ForegroundColor Cyan
    foreach ($svc in $activeAstro) { Write-Host ("  {0,-22} {1}" -f $svc, $urlMap[$svc]) }
    Write-Host ""
}

if ($activeNext.Count -eq 0 -and $activeAstro.Count -eq 0) {
    Write-Host "No rendering containers are running under profile '$Profile'." -ForegroundColor Yellow
    Write-Host "Valid profiles: alaris, solterra, sync, basic, location-finder, article-starter, product-listing, skate-park, basic-app, nextjs, astro, kit, minimal, all" -ForegroundColor DarkGray
}