ifeq ($(DOCKER),true)
    AZTEC_CLI = docker run --rm --network host -v $(shell pwd):/work -w /work aztecprotocol/cli:0.16.7
else
    AZTEC_CLI = aztec-cli
endif

ifeq ($(PROD),true)
	DEPLOY_FLAG = -u https://aztec-pxe.abstract-crypto.com
endif

.PHONY: gen-artifacts

gen-artifacts:
	$(AZTEC_CLI) \
	compile --typescript ../../src/artifacts \
			-o ../../../artifacts \
			./aztec-contracts/contracts/numer0n

	cp -r ./aztec-contracts/src/artifacts/* ./frontend/src/artifacts/

deploy-registry:
	$(AZTEC_CLI) \
	deploy $(DEPLOY_FLAG) \
	./artifacts/registry_contract-Registry.json