ifeq ($(DOCKER),true)
    AZTEC_CLI = docker run --rm -v $(shell pwd):/work -w /work aztecprotocol/cli
else
    AZTEC_CLI = aztec-cli
endif

.PHONY: gen-artifacts

gen-artifacts:
	$(AZTEC_CLI) \
	compile --typescript ../../src/artifacts \
			-o ../../../artifacts \
			./contract/contract/numer0n

	$(AZTEC_CLI) \
	compile --typescript ../../src/artifacts \
			-o ../../../artifacts \
			./contract/contract/registry

	cp -r ./contract/src/artifacts/* ./frontend/src/artifacts/
