# @kb-labs/ai-docs-contracts

Contracts for the AI Docs plugin: artifacts, commands, workflows, API payloads, plus the semver'd version of these promises.

## Vision & Purpose

**@kb-labs/ai-docs-contracts** provides contracts for KB Labs AI Docs. It describes guaranteed artifacts, commands, workflows, API payloads, and the version of these promises.

### Core Goals

- **Contract Definition**: Define public contracts for AI Docs
- **Schema Validation**: Zod schemas for validation
- **Type Safety**: TypeScript types derived from schemas
- **Versioning**: SemVer-based contract versioning

## Package Status

- **Version**: 0.0.1
- **Stage**: Stable
- **Status**: Production Ready ✅

## Architecture

### High-Level Overview

```
AI Docs Contracts
    │
    ├──► Contract Manifest
    ├──► Zod Schemas
    ├──► TypeScript Types
    └──► Helper Parsers
```

### Key Components

1. **Contract Manifest** (`contract.ts`): Plugin contracts manifest
2. **Schemas** (`schema/`): Zod validation schemas
3. **Types** (`types.ts`): TypeScript type definitions
4. **Parsers** (`schema.ts`): Helper parsers

## ✨ Features

- **Contract Manifest**: Canonical manifest with artifact + command/workflow metadata
- **Zod Schemas**: Validation schemas for config, plan, generation results, drift reports
- **TypeScript Types**: Type definitions for command inputs/outputs
- **Helper Parsers**: `parsePluginContracts` for runtime validation
- **Versioning**: SemVer-based contract versioning

## 📦 API Reference

### Main Exports

#### Contract Manifest

- `pluginContractsManifest`: Canonical manifest with artifact + command/workflow metadata
- `contractsVersion`: SemVer version for contract coordination
- `contractsSchemaId`: Schema ID for contract validation

#### Schemas

- `parsePluginContracts`: Parse plugin contracts
- `pluginContractsSchema`: Plugin contracts schema

#### Types

- `PluginContracts`: Plugin contracts type
- `ArtifactDecl`: Artifact declaration type
- `CommandDecl`: Command declaration type

## 🔧 Configuration

### Configuration Options

No configuration needed - pure contract definitions.

## 🔗 Dependencies

### Runtime Dependencies

- `zod` (`^3.23.8`): Schema validation

### Development Dependencies

- `@kb-labs/devkit` (`link:../../../kb-labs-devkit`): DevKit presets
- `@types/node` (`^20.16.10`): Node.js types
- `tsup` (`^8.1.0`): TypeScript bundler
- `typescript` (`^5.6.3`): TypeScript compiler
- `vitest` (`^3.2.4`): Test runner

## 🧪 Testing

### Test Structure

```
tests/
└── contracts.manifest.test.ts
```

### Test Coverage

- **Current Coverage**: ~60%
- **Target Coverage**: 90%

## 📈 Performance

### Performance Characteristics

- **Time Complexity**: O(1) for type operations, O(n) for schema validation
- **Space Complexity**: O(1)
- **Bottlenecks**: Schema validation for large payloads

## 🔒 Security

### Security Considerations

- **Schema Validation**: Input validation via Zod schemas
- **Type Safety**: TypeScript type safety

### Known Vulnerabilities

- None

## 🐛 Known Issues & Limitations

### Known Issues

- None currently

### Limitations

- **Schema Validation**: Basic validation only

### Future Improvements

- **Enhanced Validation**: More validation rules

## 🔄 Migration & Breaking Changes

### Versioning Rules

- **MAJOR** — breaking changes to artifacts/commands (rename/remove fields)
- **MINOR** — backward-compatible additions (new sections, optional fields)
- **PATCH** — metadata/docs adjustments without schema changes

### Breaking Changes in Future Versions

- None planned

## 📚 Examples

### Example 1: Use Contract Manifest

```typescript
import { pluginContractsManifest } from '@kb-labs/ai-docs-contracts';

const planArtifactId = pluginContractsManifest.artifacts['ai-docs.plan'].id;
```

### Example 2: Parse Plugin Contracts

```typescript
import { parsePluginContracts } from '@kb-labs/ai-docs-contracts';

const contracts = parsePluginContracts(rawManifest);
```

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT © KB Labs
