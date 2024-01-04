# Numer0n

Numer0n is a number-guessing game in which two persons are against each other. It's built on Aztec, as both players' secret numbers should be stored privately.

## Develoyments

#### compile

```bash
    # with aztec-cli
    make gen-artifacts
    # with docker
    DOCKER=true make gen-artifacts
```

#### deploy

```shell
 aztec-cli deploy ./artifacts/Registry.json
```
