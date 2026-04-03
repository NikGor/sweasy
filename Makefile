PYTHON := poetry run python
MANAGE := $(PYTHON) manage.py

.PHONY: install run migrate makemigrations check test

install:
	poetry install

run:
	$(MANAGE) runserver 0.0.0.0:8000

migrate:
	$(MANAGE) migrate

makemigrations:
	$(MANAGE) makemigrations

check:
	$(MANAGE) check

test:
	$(MANAGE) test
