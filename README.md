# Numer0n

Numer0n is a number-guessing game like a "Hit & Blow". It's built on Aztec, as both players' secret numbers should be stored privately on smart contract.

## Develoyments

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

## Demo

[https://aztec-numer0n.netlify.app/](https://aztec-numer0n.netlify.app/)

#### common error

- `POST http://212.227.240.189:8080/ net::ERR_CONNECTION_TIMED_OUT`

\*if you face the following error, it means the sandbox hosted at `http://212.227.240.189:8080/` is down.

In this case, please follow the #development section above to run the app locally.
