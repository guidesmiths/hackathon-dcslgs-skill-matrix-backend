

ensure-dependencies:
	@echo "Ensuring docker is installed..."
	@docker info

brand:
	@echo "Creating our skill-matrix manifest file..."
	@node_modules/make-manifest/bin/make-manifest
	@cat ./manifest.json

package:
	@echo "Building our skill-matrix docker image..."
	@docker build --tag skill-matrix .
	@docker images

qa:
	@echo "Checking that our skill-matrix tests dont fail..."
	@npm run qa