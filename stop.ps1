$ErrorActionPreference = 'Stop'
$composeFile = 'linux-containers/docker-compose.yml'
docker compose --project-directory $PSScriptRoot -f $composeFile down