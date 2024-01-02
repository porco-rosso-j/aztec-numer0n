# Numer0n

Numer0n is a number-guessing game in which two persons are against each other. It's built on Aztec, as both players' secret numbers should be stored privately.

## Develoyments

#### compile

```shell
cd contract/numer0n
aztec-cli compile ./ --typescript ../../src/artifacts
```

```shell
cd ..
cd contract/registry
aztec-cli compile ./ --typescript ../../src/artifacts
```
