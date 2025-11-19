# @kb-labs/ai-docs-plugin

CLI + workflow implementation for KB Labs AI Docs (init/plan/generate/audit).

## Vision & Purpose

**@kb-labs/ai-docs-plugin** provides CLI and workflow implementation for KB Labs AI Docs. It includes commands for initializing, planning, generating, and auditing documentation.

### Core Goals

- **Init Command**: Initialize documentation configuration
- **Plan Command**: Plan documentation generation
- **Generate Command**: Generate documentation
- **Audit Command**: Audit documentation drift

## Package Status

- **Version**: 0.0.1
- **Stage**: Stable
- **Status**: Production Ready ✅

## Architecture

### High-Level Overview

```
AI Docs Plugin
    │
    ├──► CLI Commands
    ├──► Application Layer
    ├──► Domain Layer
    ├──► Infrastructure Layer
    └──► Workflows
```

### Key Components

1. **CLI Commands** (`cli/commands/`): CLI command implementations
2. **Application Layer** (`application/`): Use cases and services
3. **Domain Layer** (`domain/`): Domain logic (config, drift, generation, plan)
4. **Infrastructure Layer** (`infra/`): Adapters (config-store, docs-fs, logger, mind-client)
5. **Workflows** (`workflows/`): Workflow implementations

## ✨ Features

- **Init Command**: Initialize documentation configuration
- **Plan Command**: Plan documentation generation
- **Generate Command**: Generate documentation
- **Audit Command**: Audit documentation drift
- **Workflow Support**: Workflow implementations for all commands

## 📦 API Reference

### Main Exports

#### CLI Commands

- `init`: Initialize documentation command
- `plan`: Plan documentation command
- `generate`: Generate documentation command
- `audit`: Audit documentation command

#### Use Cases

- `initDocs`: Initialize documentation use case
- `planDocs`: Plan documentation use case
- `generateDocs`: Generate documentation use case
- `auditDocs`: Audit documentation use case

## 🔧 Configuration

### Configuration Options

All configuration via CLI flags and kb-labs.config.json.

### CLI Flags

- `--config`: Configuration file path
- `--output`: Output directory
- `--profile`: Profile name

## 🔗 Dependencies

### Runtime Dependencies

- `@kb-labs/ai-docs-contracts` (`link:../ai-docs-contracts`): AI Docs contracts
- `@kb-labs/plugin-manifest` (`link:../../../kb-labs-plugin/packages/manifest`): Plugin manifest
- `@kb-labs/setup-operations` (`link:../../../kb-labs-setup-engine/packages/setup-operations`): Setup operations
- `zod` (`^3.25.8`): Schema validation

### Development Dependencies

- `@kb-labs/devkit` (`link:../../../kb-labs-devkit`): DevKit presets
- `@types/node` (`^20.16.10`): Node.js types
- `@types/react` (`^18.3.8`): React types
- `@types/react-dom` (`^18.3.0`): React DOM types
- `tsup` (`^8.1.0`): TypeScript bundler
- `typescript` (`^5.6.3`): TypeScript compiler
- `vitest` (`^3.2.4`): Test runner

## 🧪 Testing

### Test Structure

```
tests/
└── setup.ts
```

### Test Coverage

- **Current Coverage**: ~50%
- **Target Coverage**: 90%

## 📈 Performance

### Performance Characteristics

- **Time Complexity**: O(n) for command execution, O(1) for command registration
- **Space Complexity**: O(n) where n = documentation size
- **Bottlenecks**: Documentation generation time

## 🔒 Security

### Security Considerations

- **Input Validation**: Command input validation
- **Path Validation**: Path validation for file operations

### Known Vulnerabilities

- None

## 🐛 Known Issues & Limitations

### Known Issues

- None currently

### Limitations

- **Command Types**: Fixed command types
- **Output Formats**: Fixed output formats

### Future Improvements

- **More Commands**: Additional commands
- **Custom Output Formats**: Custom output format support

## 🔄 Migration & Breaking Changes

### Migration from Previous Versions

No breaking changes in current version (0.0.1).

### Breaking Changes in Future Versions

- None planned

## 📚 Examples

### Example 1: Initialize Documentation

```bash
kb ai-docs:init
```

### Example 2: Plan Documentation

```bash
kb ai-docs:plan
```

### Example 3: Generate Documentation

```bash
kb ai-docs:generate
```

### Example 4: Audit Documentation

```bash
kb ai-docs:audit
```

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT © KB Labs

