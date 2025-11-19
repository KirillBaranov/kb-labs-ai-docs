import { mkdir, writeFile, rm, readFile, access, copyFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import type { DocsFsPort } from '../../application/types.js';
import {
  METADATA_DIR,
  PLAN_FILE,
  DRIFT_JSON_FILE,
  DRIFT_MARKDOWN_FILE,
  ARTIFACTS_SUGGESTIONS_DIR,
  AI_DOCS_BACKUP_DIR
} from '../../shared/constants.js';

export function createDocsFs(): DocsFsPort {
  return {
    async writeSkeleton(_basePath, files) {
      const created: string[] = [];
      for (const [absPath, content] of Object.entries(files)) {
        const resolvedPath = resolvePath(absPath);
        await ensureDir(dirname(resolvedPath));
        await writeFile(resolvedPath, content, 'utf8');
        created.push(resolvedPath);
      }
      return created;
    },

    async savePlan(plan, targetPath = PLAN_FILE) {
      const resolved = resolvePath(targetPath);
      await ensureDir(dirname(resolved));
      await writeFile(resolved, JSON.stringify(plan, null, 2), 'utf8');
      return resolved;
    },

    async loadPlan(planPath) {
      const resolved = resolvePath(planPath);
      if (!(await pathExists(resolved))) {
        return null;
      }
      const content = await readFile(resolved, 'utf8');
      return JSON.parse(content);
    },

    async fileExists(path) {
      const resolved = resolvePath(path);
      return pathExists(resolved);
    },

    async writeDoc(targetPath, content, options = {}) {
      const resolved = resolvePath(targetPath);
      await ensureDir(dirname(resolved));

      const shouldBackup = options.backup ?? true;
      if (shouldBackup && (await pathExists(resolved))) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const relativePath = relative(process.cwd(), resolved).replace(/^\.\.(\/|\\)/g, '');
        const backupPath = resolvePath(join(AI_DOCS_BACKUP_DIR, timestamp, relativePath));
        await ensureDir(dirname(backupPath));
        await copyFile(resolved, backupPath);
      }

      await writeFile(resolved, content, 'utf8');
    },

    async saveMetadata(metadata) {
      const dir = resolvePath(METADATA_DIR);
      await ensureDir(dir);
      const filePath = join(dir, `metadata-${Date.now()}.json`);
      await ensureDir(dirname(filePath));
      await writeFile(filePath, JSON.stringify(metadata, null, 2), 'utf8');
      return filePath;
    },

    async saveDrift(report, markdown) {
      const driftJsonPath = resolvePath(DRIFT_JSON_FILE);
      const driftMarkdownPath = resolvePath(DRIFT_MARKDOWN_FILE);
      await ensureDir(dirname(driftJsonPath));
      await writeFile(driftJsonPath, JSON.stringify(report, null, 2), 'utf8');
      await writeFile(driftMarkdownPath, markdown, 'utf8');
      return {
        jsonPath: driftJsonPath,
        markdownPath: driftMarkdownPath
      };
    },

    async writeSuggestions(sectionId, content) {
      const dir = resolvePath(ARTIFACTS_SUGGESTIONS_DIR);
      await ensureDir(dir);
      const suggestionPath = join(dir, `${sectionId}.md`);
      await writeFile(suggestionPath, content, 'utf8');
      return suggestionPath;
    },

    async cleanupSuggestions() {
      const dir = resolvePath(ARTIFACTS_SUGGESTIONS_DIR);
      if (await pathExists(dir)) {
        await rm(dir, { recursive: true, force: true });
      }
    }
  };
}

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function resolvePath(pathLike: string): string {
  return resolve(process.cwd(), pathLike);
}
