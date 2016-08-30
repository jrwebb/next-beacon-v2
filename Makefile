include n.Makefile

TEST_HOST := "ft-beacon-v2-branch-${CIRCLE_BUILD_NUM}"
YAML_WARNING= "Note: If the dashboard configuration files fail YAML verification, (a) make sure you have a new line at the end of the file; and (b) use only spaces (not tabs) for indentation."

test: verify
	@echo $(YAML_WARNING)
	@find ./dashboards -path '**/*.yml' -exec cat {} \;| js-yaml -t > /dev/null

run:
	nht run --local

run-bot:
	nht run --procfile

provision:
	nht provision ${TEST_HOST}
	nht configure ft-next-beacon-v2 ${TEST_HOST} --overrides "NODE_ENV=branch"
	nht deploy-hashed-assets
	nht deploy ${TEST_HOST}

deploy:
	nht configure
	nht deploy-hashed-assets
	nht deploy
	nht scale

tidy:
	nht destroy ${TEST_HOST}
