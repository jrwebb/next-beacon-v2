include n.Makefile

TEST_HOST := "ft-beacon-v2-branch-${CIRCLE_BUILD_NUM}"
YAML_WARNING= "Note: If the dashboard configuration files fail YAML verification, (a) make sure you have a new line at the end of the file; and (b) use only spaces (not tabs) for indentation."

run:
	nht run --local

deploy:
	nht deploy-hashed-assets
	nht ship

provision:
	nht deploy-hashed-assets
	nht float

verify:
	@echo $(YAML_WARNING)
	@find ./dashboards -path '**/*.yml' -exec cat {} \;| js-yaml -t > /dev/null

test: verify

run-bot:
	nht run --procfile


