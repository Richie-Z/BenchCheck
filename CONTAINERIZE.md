# CONTAINERIZE - Solo/BenchCheck

Archetype: react-spa. Generated 2026-11-20T21:43:00+07:00 by .opencode/scripts/render.sh on branch chore/containerize (uncommitted).

## Generated files
- Dockerfile.generated (template: Dockerfile.spa)
- Jenkinsfile.generated (CI only; parameters REGISTRY, HARBOR_PROJECT, HARBOR_CRED_ID)
- .dockerignore.generated
- .containerize/nginx-spa.conf.template

## Local run
```sh
bash .opencode/scripts/build.sh Solo/BenchCheck
bash .opencode/scripts/smoke.sh Solo/BenchCheck
```
Manual run: podman run --rm --network=host --env-file /home/richie/Documents/Programming/Projects/.smoke.env -e PORT=<free-port> containerize/benchcheck:local

## Required env var NAMES (values never stored here)
unknown - inspect app config (do not print secret values)

## DB smoke
boot + healthcheck only (DB not smoke-tested). db_driver: unknown. Never migrate/seed/modify; DBs are live.

## Flags
- existing Dockerfile kept; wrote Dockerfile.generated
- existing Jenkinsfile kept; wrote Jenkinsfile.generated (point the Jenkins job at it)
- existing .dockerignore kept; wrote .dockerignore.generated (build.sh uses it via --ignorefile)

Smoke results: 2026-11-20T21:43:09+07:00 boot=PASS http=200 db=skipped (db_driver=unknown; boot + healthcheck only, DB not smoke-tested)
