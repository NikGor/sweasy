---
name: task-formulator
description: >
  Expands a short, informal task request into a detailed, technically-grounded
  task description for the Archie AI Agent project. Identifies affected modules,
  describes technical details, defines acceptance criteria and testing approach
  based on the project's architecture (3-stage SGR pipeline, FastAPI, Pydantic,
  asyncio). Use whenever the user describes a task briefly and wants a full
  formulation. Trigger on: "сформулируй задачу", "уточни задание", "задача:",
  "нужно сделать", "expand task", "elaborate task", "formulate task",
  "describe the task", "задание:", "write up the task".
argument-hint: "[short task description]"
---

# Task Formulator

Turns a brief request into a structured task description suitable for JIRA
and for handoff to implementation. Accounts for project architecture, code
style, and workflow.

## Process

### 1. Parse the short request

If an argument is provided via `$ARGUMENTS` — use it as the input task.
If not provided — ask the user to describe the task in one or two sentences.

From the short description extract:
- **Action verb** — what needs to be done (add, fix, refactor, migrate, optimize, etc.)
- **Object** — what exactly (module, function, behaviour, API endpoint)
- **Motivation** — why (if mentioned)

### 2. Explore the affected code

Use grep/glob/LSP to find and read the affected files. Understanding the current
implementation is essential for writing a precise task description, not an
abstract one.

Use the project layer map to orient:

| Layer | Path | Key files |
|-------|------|-----------|
| Orchestration | `app/agent/` | `agent_factory.py`, `prompt_builder.py` |
| Tools | `app/tools/` | `tool_factory.py`, `create_output_tool.py` |
| Utilities | `app/utils/` | `llm_parser.py`, `tool_executor.py`, `provider_utils.py` |
| Models | `app/models/` | `orchestration_sgr.py`, `output_models.py`, `state_models.py` |
| Backend | `app/backend/` | `state_service.py` and clients |
| Config | `app/` | `config.py` |

If the task spans multiple layers, describe each layer's role.

### 3. Apply project context

When formulating, account for:

**Architecture:**
- Stage 1 (Command): `_make_command_call` → `DecisionResponse` (`function_call` / `parameters_request` / `final_response`)
- Stage 2 (Execution): `tool_executor.execute_tool_calls` with `asyncio.gather`
- Stage 3 (Output): `create_output_tool.create_output` → formatted per `response_format`
- Dashboard/Widget formats skip Stage 1 and go directly to Stage 3

**Code style (mention when relevant):**
- Python 3.11+, type annotations everywhere, `|` for union types
- Pydantic: `BaseModel`, `Field(description=...)`, `model_dump()` / `model_validate()`
- All I/O via `async/await`, concurrent calls via `asyncio.gather`
- No `print()`, only `logger`; no hardcoded values — use `config.py` or env vars
- Naming conventions: `get_`, `create_`, `update_`, `execute_`, `parse_` prefixes
- Module suffixes: `*_tool.py`, `*_service.py`, `*_utils.py`, `*_client.py`

**Testing:**
- Unit tests: no LLM calls, mock external dependencies, run via `./execute_tests.sh -m "not llm"`
- Smoke tests: require real API keys, run via `./execute_tests.sh -m llm`
- Quick manual check: `make api-test`

### 4. Output the formulated task

Produce the structured description using the template below.

---

## Output Template

```
## Task: [Short JIRA-style title — verb + object]

### Description
[2–4 sentences: what, why, what problem it solves or what feature it adds]

### Affected Modules
- `app/path/to/file.py` — [what specifically changes in this file]
- `app/path/to/file2.py` — [this file's role in the task]

### Technical Details
[Concrete description of the changes: which classes/functions to add/modify,
which model fields, new dependencies, how it fits into the pipeline.
Note architectural constraints if any.]

### Acceptance Criteria
- [ ] [Specific, verifiable outcome]
- [ ] [Another criterion]
- [ ] Code follows project code style (type annotations, async, no print)
- [ ] [Test criterion: unit test / smoke test / manual check via make api-test]

### Edge Cases and Risks
- [What could go wrong, what to watch out for]
- [Backward compatibility concerns, if relevant]

### Testing
- **Unit:** [what to mock, what to assert]
- **Smoke:** [how to verify end-to-end, if needed]
```

---

## Rules

- **Don't invent details** — if something is unclear from the code and the
  request, mark it as an open question in "Technical Details" or "Risks".
  False confidence is worse than explicit uncertainty.

- **Use concrete names, not abstractions** — write `agent_factory._make_command_call`,
  not "a function in the agent factory". The reader should know exactly where
  to go.

- **Scale matches the task** — don't inflate a small task (fix typo, add field).
  Describe a large task (new provider, new response type) in detail. Use
  judgment.

- **Language** — if the user wrote in Russian, formulate in Russian. If in
  English — in English. Technical names (classes, methods, paths) are always
  in English.

- **No implementation steps** — this is a task formulation, not an
  implementation plan. The task describes WHAT and WHY, not HOW step by step.
