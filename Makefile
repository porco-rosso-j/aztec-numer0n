ifeq ($(DOCKER),true)
    AZTEC_CLI = docker run --rm \
						   --network host \
						   -v $(shell pwd):/work \
						   -v aztec-cli-cache:/cache \
						   -w /work \
						   -u 0:0 \
						   aztecprotocol/cli:0.16.7
else
    AZTEC_CLI = aztec-cli
endif

ifeq ($(PROD),true)
	DEPLOY_FLAG = -u https://aztec.hmlab.xyz
endif

.PHONY: compile-numer0n compile-registry deploy-registry

compile-numer0n:
	$(AZTEC_CLI) \
	compile --typescript ../../src/artifacts \
			-o ../../../artifacts \
			./aztec-contracts/contracts/numer0n

	cp -r ./aztec-contracts/src/artifacts/* ./frontend/src/artifacts/

compile-registry:
	$(AZTEC_CLI) \
	compile --typescript ../../src/artifacts \
			-o ../../../artifacts \
			./aztec-contracts/contracts/registry

	cp -r ./aztec-contracts/src/artifacts/* ./frontend/src/artifacts/

deploy-registry:
	$(AZTEC_CLI) \
	deploy $(DEPLOY_FLAG) \
	./artifacts/Registry.json

