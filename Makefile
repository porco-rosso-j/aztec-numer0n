ifeq ($(DOCKER),true)
    AZTEC_CLI = docker run --rm --network host -v $(shell pwd):/work -w /work aztecprotocol/cli
else
    AZTEC_CLI = aztec-cli
endif

ifeq ($(PROD),true)
	DEPLOY_FLAG = -u http://212.227.240.189:8080
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
	./artifacts/Registry.json

deploy:
	$(AZTEC_CLI) \
	deploy $(DEPLOY_FLAG) \
	./artifacts/Registry.json