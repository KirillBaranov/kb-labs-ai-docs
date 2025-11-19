# Package Architecture Audit: @kb-labs/ai-docs-plugin

**Date**: 2025-11-16  
**Package Version**: 0.1.0

## 1. Package Purpose & Scope

CLI/REST/Studio plugin для AI Docs: декларация поверх `ai-docs-core`, отвечает за manifest, setup и интеграцию с платформой.

---

## 9. CLI Commands Audit

### 9.1 Product-level help

- `pnpm kb ai-docs --help`:
  - продукт `ai-docs` отображается;
  - доступны команды:
    - `ai-docs:audit`
    - `ai-docs:generate`
    - `ai-docs:init`
    - `ai-docs:plan`.

- `pnpm kb ai-docs-plugin --help`:
  - продукт `ai-docs-plugin` отображается;
  - доступны setup-команды:
    - `ai-docs-plugin:setup`
    - `ai-docs-plugin:setup:rollback`.

### 9.2 Статус команд (уровень help)

| Product           | Command IDs                                      | Status        | Notes                                   |
|-------------------|--------------------------------------------------|---------------|-----------------------------------------|
| `ai-docs`         | `ai-docs:audit`, `:generate`, `:init`, `:plan`   | **OK (help)** | Все видны в `kb ai-docs --help`         |
| `ai-docs-plugin`  | `ai-docs-plugin:setup`, `:setup:rollback`        | **OK (help)** | Видны в `kb ai-docs-plugin --help`      |

В этом проходе проверялась только доступность/отображение команд; поведение handler’ов не тестировалось.


