[CmdletBinding()]
param(
    [switch]$Init,
    [switch]$Rebuild
)

$ErrorActionPreference = 'Stop'

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
    & (Join-Path $PSScriptRoot 'linux-containers/tools/mkcert.ps1') -sanList "alaris.local","*.alaris.local"
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

$composeArgs = @('compose', '--project-directory', $PSScriptRoot, '-f', $composeFile, 'up', '-d')
if ($Rebuild) { $composeArgs += '--build' }

Write-Host "Starting stack..." -ForegroundColor Cyan
docker @composeArgs
docker compose --project-directory $PSScriptRoot -f $composeFile ps
Write-Host ""
Write-Host "Site:        https://alaris.local"            -ForegroundColor Green
Write-Host "Mockingbird: https://mockingbird.alaris.local" -ForegroundColor Green
Write-Host "Traefik UI:  http://localhost:18080"                       -ForegroundColor Green