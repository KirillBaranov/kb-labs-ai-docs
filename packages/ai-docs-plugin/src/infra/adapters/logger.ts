import type { LoggerPort } from '../../application/types.js';

export interface ConsoleLoggerOptions {
  scope?: string;
}

export function createConsoleLogger(options: ConsoleLoggerOptions = {}): LoggerPort {
  const scope = options.scope ?? 'ai-docs';

  return {
    log(level, message, meta) {
      const payload = {
        scope,
        level,
        message,
        ...meta
      };
      if (level === 'error') {
        console.error(payload);
      } else if (level === 'warn') {
        console.warn(payload);
      } else {
        console.log(payload);
      }
    }
  };
}

