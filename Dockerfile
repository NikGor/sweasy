# ── Stage 1: Build frontend ──
FROM node:20-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ── Stage 2: Python app ──
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.7.1 \
    POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

RUN pip install --no-cache-dir "poetry==$POETRY_VERSION" gunicorn

COPY pyproject.toml poetry.lock /app/
RUN poetry install --no-interaction --no-ansi --no-dev

COPY . /app

# Copy built frontend into Django static
COPY --from=frontend /app/frontend/dist /app/frontend/dist

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && gunicorn sweasy.wsgi:application --bind 0.0.0.0:${PORT:-8000}"]
