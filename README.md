# Numer0n

Numer0n is a strategic number-guessing game in which two players compete to guess the opponent's 3-digit secret numbers first. It's built on [Aztec Sandbox](https://docs.aztec.network/developers/sandbox/main). Both players' secret numbers are stored privately on smart contracts.

Play on [demo app](https://aztec-numer0n.netlify.app/).  
Want to learn how to play? check [Rule Book](https://github.com/porco-rosso-j/aztec-numer0n/blob/main/RuleBook.md).

## Local Developments

#### compile

```bash
make gen-artifacts
```

#### deploy

```bash
 make deploy-registry
```

copy&paste the first output address into `registryAddress` in `frontend/src/scripts/constants.ts`

#### start frontend

create .env

```shell
cp ./frontend/.env.example ./frontend/.env
```

start frontend

```shell
cd frontend
yarn dev
```
