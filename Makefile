TEST_HOST := "ft-beacon-v2-branch-${CIRCLE_BUILD_NUM}"
YAML_WARNING= \e[5mIf dashboard config fails make sure you have a newline at the end of the file and use only spaces fro indentation\e[25m
.PHONY: test

install:
	obt install --verbose

clean:
	git clean -fxd

verify:
	@echo -e $(YAML_WARNING)
	@find ./dashboards -path '**/*.yml' -exec cat {} \;| js-yaml -t > /dev/null
	nbt verify --skip-layout-checks

test: verify

run:
	nbt run --local

run-bot:
	nbt run --procfile

build:
	nbt build --dev --worker

build-production:
	nbt build --worker

watch:
	nbt build --dev --watch

tidy:
	nbt destroy ${TEST_HOST}

provision:
	nbt provision ${TEST_HOST}
	nbt configure ft-next-beacon-v2 ${TEST_HOST} --overrides "NODE_ENV=branch"
	nbt deploy-hashed-assets
	nbt deploy ${TEST_HOST} --skip-enable-preboot --skip-logging

deploy:
	nbt configure
	nbt deploy-hashed-assets
	nbt deploy --skip-logging
	nbt scale
