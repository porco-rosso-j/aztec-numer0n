ifeq ($(DOCKER),true)
    AZTEC_CLI = docker run --rm --network host -v $(shell pwd):/work -w /work aztecprotocol/cli
else
    AZTEC_CLI = aztec-cli
endif

.PHONY: gen-artifacts

gen-artifacts:
	$(AZTEC_CLI) \
	compile --typescript ../../src/artifacts \
			-o ../../../artifacts \
			./aztec-contracts/contracts/numer0n

	$(AZTEC_CLI) \
	compile --typescript ../../src/artifacts \
			-o ../../../artifacts \
			./aztec-contracts/contracts/registry

	cp -r ./aztec-contracts/src/artifacts/* ./frontend/src/artifacts/

deploy-registry:
	$(AZTEC_CLI) \
	deploy ./aztec-contracts/contracts/numer0n