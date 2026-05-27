$ErrorActionPreference = 'Stop'

# CLI args (Unix-style: --long, -short, all lowercase):
#   --profile <name>   Compose profile to tear down (default: all)
#   -p <name>          Alias for --profile
$Profile = 'all'
for ($i = 0; $i -lt $args.Count; $i++) {
    switch -CaseSensitive ($args[$i]) {
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

$composeFile = 'linux-containers/docker-compose.yml'
docker compose --project-directory $PSScriptRoot -f $composeFile --profile $Profile down
