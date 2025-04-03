# ESLint Configuration Guide

## Unused Variables Warning

This project has been configured to warn about unused variables through both ESLint and TypeScript compiler options.

### Configuration Details

1. **ESLint Configuration**:

   - Using `eslint.config.js` (ESLint v9+ flat config format) with the `@typescript-eslint/no-unused-vars` rule set to 'warn'
   - Installed necessary ESLint plugins and dependencies

2. **TypeScript Configuration**:
   - Added `noUnusedLocals: true` to tsconfig.json
   - Added `noUnusedParameters: true` to tsconfig.json

### How to Use

#### Running ESLint

To check your code for unused variables and other issues:

```bash
npm run lint
```

This will run ESLint on all JavaScript and TypeScript files in your project.

#### During Development

If you're using VS Code or another IDE with ESLint integration, you'll see warnings directly in your editor when you have unused variables.

### Benefits

- Helps identify dead code
- Improves code readability
- Prevents potential bugs from unused declarations
- Makes the codebase more maintainable

### Customizing Rules

If you need to adjust the severity of unused variable warnings or modify other ESLint rules, you can edit the `eslint.config.js` file.

## ESLint v9 Migration

This project has been migrated from the legacy `.eslintrc.js` configuration format to the new flat config format (`eslint.config.js`) required by ESLint v9.0.0+.

### Key Changes

- Configuration is now in `eslint.config.js` instead of `.eslintrc.js`
- Uses the new ESLint flat config format
- Added required dependencies: `@eslint/js` and `typescript-eslint`
- All previous linting rules and settings have been preserved

### Migration Resources

If you need to make further changes to the ESLint configuration, refer to the official migration guide:

https://eslint.org/docs/latest/use/configure/migration-guide
