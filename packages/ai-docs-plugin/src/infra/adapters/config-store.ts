import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createDefaultConfig, validateConfig } from '../../domain/config.js';
import type { ConfigStorePort } from '../../application/types.js';

const CONFIG_PATH = 'kb.config.json';

interface StoredConfig {
  aiDocs?: unknown;
  [key: string]: unknown;
}

export function createConfigStore(): ConfigStorePort {
  return {
    async load() {
      if (!existsSync(CONFIG_PATH)) {
        return null;
      }
      const content = await readFile(CONFIG_PATH, 'utf8');
      const parsed: StoredConfig = JSON.parse(content);
      if (!parsed.aiDocs) {
        return createDefaultConfig();
      }
      const validation = validateConfig(parsed.aiDocs);
      if (!validation.ok) {
        throw new Error(`Invalid aiDocs config: ${validation.issues.join(', ')}`);
      }
      return validation.value;
    },

    async save(config) {
      const stored = (await readCurrent()) ?? {};
      const next: StoredConfig = {
        ...stored,
        aiDocs: config
      };
      await writeFile(CONFIG_PATH, `${JSON.stringify(next, null, 2)}\n`);
    },

    async ensureSection(config) {
      const stored = (await readCurrent()) ?? {};
      if (stored.aiDocs) {
        return;
      }
      const next: StoredConfig = {
        ...stored,
        aiDocs: config
      };
      await writeFile(CONFIG_PATH, `${JSON.stringify(next, null, 2)}\n`);
    }
  };
}

async function readCurrent(): Promise<StoredConfig | null> {
  if (!existsSync(CONFIG_PATH)) {
    return null;
  }
  const content = await readFile(CONFIG_PATH, 'utf8');
  return JSON.parse(content) as StoredConfig;
}

