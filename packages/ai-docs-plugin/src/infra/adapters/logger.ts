/**
 * @module Logger adapter for AI Docs plugin
 * Wrapper around @kb-labs/core-sys/logging
 */

import { getLogger, type Logger as CoreLogger } from '@kb-labs/core-sys/logging';
import type { LoggerPort } from '../../application/types.js';

export interface ConsoleLoggerOptions {
  scope?: string;
}

/**
 * Create console logger adapter
 * Uses new unified logging system
 */
export function createConsoleLogger(options: ConsoleLoggerOptions = {}): LoggerPort {
  const scope = options.scope ?? 'ai-docs';
  const coreLogger = getLogger(`ai-docs:${scope}`);

  return {
    log(level, message, meta) {
      switch (level) {
        case 'debug':
          coreLogger.debug(message, meta);
          break;
        case 'info':
          coreLogger.info(message, meta);
          break;
        case 'warn':
          coreLogger.warn(message, meta);
          break;
        case 'error':
          coreLogger.error(message, meta);
          break;
      }
    }
  };
}

