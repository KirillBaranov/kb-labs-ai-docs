export const AI_DOCS_PLUGIN_ID = '@kb-labs/ai-docs';

export const DOCS_DEFAULT_BASE_PATH = 'docs/ai-docs';
export const AI_DOCS_ROOT = '.kb/ai-docs';
export const PLAN_FILE = `${AI_DOCS_ROOT}/plan.json`;
export const DRIFT_JSON_FILE = `${AI_DOCS_ROOT}/drift.json`;
export const DRIFT_MARKDOWN_FILE = `${AI_DOCS_ROOT}/drift.md`;
export const METADATA_DIR = `${AI_DOCS_ROOT}/metadata`;
export const ARTIFACTS_SUGGESTIONS_DIR = '.kb/artifacts/ai-docs/suggestions';
export const AI_DOCS_BACKUP_DIR = `${AI_DOCS_ROOT}/backups`;

export const AI_DOCS_COMMANDS = {
  init: 'ai-docs:init',
  plan: 'ai-docs:plan',
  generate: 'ai-docs:generate',
  audit: 'ai-docs:audit'
} as const;

export type AiDocsCommandId = (typeof AI_DOCS_COMMANDS)[keyof typeof AI_DOCS_COMMANDS];

