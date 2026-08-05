.PHONY: dev build install lint

install:
	npm install

dev:
	npm run dev -w packages/web

build:
	npm run build -w packages/web

lint:
	npm run lint
