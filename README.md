# Sweasy

AI-powered landing page for a Swiss travel guide. Parses an Instagram archive, generates page content via GPT-4.1 Structured Output, upscales the hero image to 4K via Gemini, and renders everything in a React frontend.

## Architecture

```
Instagram Archive ──> page_generator.py ──> page.json ──> React SPA
                        │                     │
                        ├─ GPT-4.1            └─ /public/media/ (local images)
                        └─ Gemini (hero 4K upscale)
```

**Backend (Django + Python):**
- `sweasy/parsers/instagram.py` — Instagram Graph API scraper
- `sweasy/parsers/page_models.py` — Pydantic models for all page sections
- `sweasy/parsers/page_generator.py` — AI pipeline: archive -> GPT-4.1 -> page.json + Gemini upscale
- `sweasy/management/commands/parse_instagram.py` — scrape Instagram into local archive
- `sweasy/management/commands/generate_page.py` — generate landing page from archive

**Frontend (React + Vite + TypeScript + Tailwind):**
- Single-page app, fully data-driven from `/page.json`
- Sections: Hero, MoodBar, LiveFeed, Tours, Facts (carousel), CTA
- Material Design 3 color tokens, "The Alpine Curator" design system

## Quick Start

### 1. Install dependencies

```bash
poetry install
cd frontend && npm install
```

### 2. Set up environment

Create `.env` in the project root:

```
INSTA_TOKEN=<Instagram Graph API token>
OPENAI_API_KEY=<OpenAI API key>
GEMINI_API_KEY=<Google Gemini API key>
```

### 3. Parse Instagram

```bash
poetry run python manage.py parse_instagram --token $INSTA_TOKEN
```

This creates `instagram_archive/` with profile data and all posts.

### 4. Generate the landing page

```bash
poetry run python manage.py generate_page
```

This will:
- Copy post images to `frontend/public/media/`
- Call GPT-4.1 to generate `page.json` (navbar, hero, feed, tours, facts, CTA, footer)
- Upscale hero image to 4K via Gemini

### 5. Run the frontend

```bash
cd frontend && npm run dev
```

Open http://localhost:3000

## Generated Sections

| Section | Source | Count |
|---------|--------|-------|
| Hero | Best post image, upscaled to 4K | 1 |
| MoodBar | AI-inferred mood from latest posts | 1 |
| LiveFeed | Recent posts with punchy captions | 4 cards |
| Tours | Extracted/invented from post locations | 3 cards |
| Facts | Swiss facts derived from post content | 9 cards (carousel) |
| CTA | AI-generated headline | 1 |

## Tech Stack

- **Python 3.10+**, Django 5, Pydantic 2
- **OpenAI GPT-4.1** — page content generation (Structured Output)
- **Google Gemini** — hero image 4K upscale
- **Instagram Graph API** — content parsing
- **React 19**, Vite, TypeScript, Tailwind CSS
