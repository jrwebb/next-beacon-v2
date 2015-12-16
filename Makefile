TEST_HOST := "ft-beacon-branch-${CIRCLE_BUILD_NUM}"

.PHONY: test

install:
	obt install --verbose

clean:
	git clean -fxd

verify:
	nbt verify --skip-layout-checks

test: verify

run:
	nbt run --local

build:
	nbt build --dev

build-production:
	nbt build

watch:
	nbt build --dev --watch

tidy:
	nbt destroy ${TEST_HOST}

provision:
	nbt provision ${TEST_HOST}
	nbt configure ft-next-stream-page ${TEST_HOST} --overrides "NODE_ENV=branch"
	nbt deploy-hashed-assets
	nbt deploy ${TEST_HOST} --skip-enable-preboot --skip-logging

deploy:
	nbt configure
	nbt deploy-hashed-assets
	nbt deploy --skip-logging
	nbt scale
