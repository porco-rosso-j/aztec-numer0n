# Numer0n

Numer0n is a number-guessing game in which two persons are against each other. It's built on Aztec, as both players' secret numbers should be stored privately.

## Develoyments

#### compile

compile numer0n contract:

```shell
cd aztec-contracts/contract/numer0n
aztec-cli compile ./ --typescript ../../src/artifacts
```

compile registry contract:

```shell
cd ..
cd registry
aztec-cli compile ./ --typescript ../../src/artifacts
```
