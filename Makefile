include n.Makefile

TEST_HOST := "ft-beacon-v2-branch-${CIRCLE_BUILD_NUM}"
YAML_WARNING= "Note: If the dashboard configuration files fail YAML verification, (a) make sure you have a new line at the end of the file; and (b) use only spaces (not tabs) for indentation."

clean:
	git clean -fxd

verify:
	@echo $(YAML_WARNING)
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
