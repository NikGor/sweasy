.PHONY: install test run

install:
	poetry install

run:
	poetry run python sweasy/app.py

lint:
	poetry run flake8 src

amend-and-push:
	git add .
	git commit --amend --no-edit
	git push --force
