/* eslint-disable no-empty */
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'fast-glob';
import * as TJS from 'typescript-json-schema';
import * as yaml from 'js-yaml';
import * as ts from 'typescript';
import { config, packageFolder, TSDKConfig } from './config';
import { ignorePatterns } from './utils';
import { logger } from './log';

// ==========================================
// 1. Helpers & Sanitization
// ==========================================

function paramCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function applyTransformPath(pathStr: string): string {
  return `/${paramCase(pathStr)}`;
}

/**
 * Refactored Sanitization
 * Allows for generics (MyType<Sub>) to become readable (MyType_Sub)
 * while strictly adhering to OpenAPI component name standards: ^[a-zA-Z0-9\.\-_]+$
 */
function sanitizeSchemaName(name: string): string {
  if (!name) return 'Unknown';
  let clean = name;
  try {
    clean = decodeURIComponent(clean);
  } catch (e) {}

  // 1. Handle Generics specific formatting: "Wrapper<User>" -> "Wrapper_User"
  // Replace opening brackets with underscore
  clean = clean.replace(/<|\[/g, '_');
  // Replace closing brackets with empty string (or underscore if preferred, but usually looks cleaner without)
  clean = clean.replace(/>|\]/g, '');

  // 2. Replace common separators (whitespace, commas, pipes) with underscore
  clean = clean.replace(/[|&,:\s]+/g, '_');

  // 3. Remove any remaining illegal characters (OpenAPI strict mode)
  clean = clean.replace(/[^a-zA-Z0-9.\-_]/g, '');

  // 4. Dedupe underscores and trim edges
  clean = clean.replace(/_{2,}/g, '_').replace(/^_|_$/g, '');

  return clean || 'UnnamedSchema';
}

/**
 * Refactored Cleanup Logic
 * 1. Doesn't blindly delete defaultProperties.
 * 2. Uses a WeakMap to track recursion for circular references.
 */
function cleanSchemaRefs(schema: any, seen = new WeakMap<object, any>()): any {
  if (!schema || typeof schema !== 'object') return schema;

  // Return early if we've already processed this object instance to handle circular refs
  if (seen.has(schema)) return seen.get(schema);

  // Clone extraction
  const clean = Array.isArray(schema) ? [] : {};
  seen.set(schema, clean); // Register before recursing

  // Copy properties
  if (Array.isArray(schema)) {
    (clean as any[]).push(...schema.map((item) => cleanSchemaRefs(item, seen)));
    return clean;
  }

  // Object processing
  for (const [key, value] of Object.entries(schema)) {
    // 1. Remove Generator Artifacts (Only strictly invalid ones)
    if (key === '$schema') continue;

    // NOTE: 'defaultProperties' is preserved per user request.
    // If you need to map it to 'required' or 'default', do it here.

    // 2. Handle Ref Sanitization
    if (key === '$ref' && typeof value === 'string') {
      let refName = value.replace('#/definitions/', '').replace('#/components/schemas/', '');
      refName = sanitizeSchemaName(refName);
      (clean as any)[key] = `#/components/schemas/${refName}`;
      continue;
    }

    // 3. Fix Date objects turning into complex schemas
    if (key === '$ref' && (value as string).includes('Date')) {
      return { type: 'string', format: 'date-time' };
    }

    // 4. Recurse
    (clean as any)[key] = cleanSchemaRefs(value, seen);
  }

  // 5. Flatten definitions (Move nested definitions to components later)
  if ((clean as any).definitions) {
    const newDefs: any = {};
    for (const [defName, defSchema] of Object.entries((clean as any).definitions)) {
      const cleanName = sanitizeSchemaName(defName);
      newDefs[cleanName] = cleanSchemaRefs(defSchema, seen);
    }
    // We attach these temporarily to be extracted later in registerSchema
    (clean as any)._nestedDefinitions = newDefs;
    delete (clean as any).definitions;
  }

  return clean;
}

// ==========================================
// 2. Discovery & Extraction
// ==========================================

const baseDirRef = path.resolve(process.cwd(), config.packageDir, packageFolder);

interface ExtractedAPIConfig {
  name: string;
  method: string;
  path: string;
  description?: string;
  type?: string; // 'user', 'admin', 'common'
  category?: string; // The UI category/tag
  needAuth?: boolean;
  paramsInUrl?: string;
  requestTypeName?: string;
  responseTypeName?: string;
  sourceFile: string;
  successStatus?: number;
}

function discoverSourceFiles(config: TSDKConfig): string[] {
  const baseDir = path.resolve(process.cwd(), config.packageDir, packageFolder);
  if (!fs.existsSync(baseDir)) throw new Error(`Base directory not found: ${baseDir}`);

  const patterns: string[] = [`${baseDir}/**/*.ts`, `${baseDir}/**/*.tsx`];

  if (config.sharedDirs) {
    config.sharedDirs.forEach((dir) => {
      const resolvedDir = path.resolve(process.cwd(), dir);
      if (fs.existsSync(resolvedDir)) {
        patterns.push(`${resolvedDir}/**/*.ts`);
        patterns.push(`${resolvedDir}/**/*.tsx`);
      }
    });
  }

  const allFiles = new Set<string>();
  patterns.forEach((pattern) => {
    try {
      const files = glob.sync(pattern, {
        absolute: true,
        ignore: [...ignorePatterns, '**/node_modules/**'],
        onlyFiles: true,
      });
      files.forEach((file) => allFiles.add(file));
    } catch (error) {}
  });
  return Array.from(allFiles);
}

function createTypeScriptProgram(files: string[]): ts.Program {
  const tsconfigPath = ts.findConfigFile(baseDirRef, ts.sys.fileExists, 'tsconfig.json');
  let compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    noEmit: true,
    skipLibCheck: true,
  };

  if (tsconfigPath) {
    const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    if (!configFile.error) {
      const parsed = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        path.dirname(tsconfigPath)
      );
      compilerOptions = { ...compilerOptions, ...parsed.options, noEmit: true, skipLibCheck: true };
    }
  }
  const host = ts.createCompilerHost(compilerOptions);
  return ts.createProgram(files, compilerOptions, host);
}

function extractAPIConfigs(program: ts.Program, config: TSDKConfig): ExtractedAPIConfig[] {
  const apiconfExt = `.${config.apiconfExt}.ts`;
  const sourceFiles = program
    .getSourceFiles()
    .filter((sf) => sf.fileName.endsWith(apiconfExt) && !sf.fileName.includes('node_modules'));

  const configs: ExtractedAPIConfig[] = [];
  for (const sourceFile of sourceFiles) {
    configs.push(...extractFromSourceFile(sourceFile, config));
  }
  return configs;
}

function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) return false;
  const modifiers = ts.getModifiers(node);
  return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function extractFromSourceFile(
  sourceFile: ts.SourceFile,
  config: TSDKConfig
): ExtractedAPIConfig[] {
  const configs: ExtractedAPIConfig[] = [];
  const exportedTypes = new Map<string, ts.TypeAliasDeclaration>();
  const exportedInterfaces = new Map<string, ts.InterfaceDeclaration>();

  // 1. First Pass: Collect Types/Interfaces
  ts.forEachChild(sourceFile, (node) => {
    if (!hasExportModifier(node)) return;
    if (ts.isTypeAliasDeclaration(node)) exportedTypes.set(node.name.getText(sourceFile), node);
    else if (ts.isInterfaceDeclaration(node))
      exportedInterfaces.set(node.name.getText(sourceFile), node);
  });

  // 2. Second Pass: Find Config Objects
  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isVariableStatement(node) || !hasExportModifier(node)) return;

    node.declarationList.declarations.forEach((decl) => {
      if (!ts.isVariableDeclaration(decl) || !decl.initializer) return;

      const configName = decl.name.getText(sourceFile);
      if (
        !configName.endsWith('Config') &&
        !configName.endsWith('API') &&
        !configName.endsWith('Route')
      )
        return;

      const configObj = parseConfigObject(decl.initializer, config, sourceFile);
      if (!configObj || !configObj.path) return;

      const baseName = configName
        .replace(/Config$/, '')
        .replace(/API$/, '')
        .replace(/Route$/, '');

      const patterns = generateTypeNamePatterns(baseName);

      // Find Request Type
      let requestTypeName = patterns.request.find(
        (p) => exportedTypes.has(p) || exportedInterfaces.has(p)
      );
      if (requestTypeName && exportedTypes.has(requestTypeName)) {
        const typeNode = exportedTypes.get(requestTypeName);
        if (
          typeNode &&
          (typeNode.type.kind === ts.SyntaxKind.UndefinedKeyword ||
            typeNode.type.kind === ts.SyntaxKind.VoidKeyword)
        ) {
          requestTypeName = undefined;
        }
      }

      // Find Response Type
      const responseTypeName = patterns.response.find(
        (p) => exportedTypes.has(p) || exportedInterfaces.has(p)
      );

      configs.push({
        name: configName,
        method: configObj.method || 'post',
        path: configObj.path!,
        description: configObj.description,
        type: configObj.type,
        category: configObj.category, // Pass category through
        needAuth: configObj.needAuth,
        paramsInUrl: configObj.paramsInUrl,
        requestTypeName,
        responseTypeName,
        sourceFile: sourceFile.fileName,
        successStatus: configObj.successStatus,
      });
    });
  });
  return configs;
}

function generateTypeNamePatterns(baseName: string) {
  return {
    request: [`${baseName}Req`],
    response: [`${baseName}Res`],
  };
}

/**
 * FIXED: Properly separates type and category
 */
function parseConfigObject(
  node: ts.Expression,
  config: TSDKConfig,
  sourceFile: ts.SourceFile
): Partial<ExtractedAPIConfig> | null {
  if (!ts.isObjectLiteralExpression(node)) return null;
  const result: Partial<ExtractedAPIConfig> = {};

  node.properties.forEach((prop) => {
    if (!ts.isPropertyAssignment(prop)) return;
    const name = prop.name.getText(sourceFile);
    const val = prop.initializer;

    if (name === 'successStatus') {
      if (ts.isNumericLiteral(val)) result.successStatus = parseInt(val.text, 10);
    } else if (name === 'method') result.method = extractStringValue(val, sourceFile);
    // --- SEPARATED EXTRACTION START ---
    else if (name === 'type') result.type = extractStringValue(val, sourceFile);
    else if (name === 'category') result.category = extractStringValue(val, sourceFile);
    // --- SEPARATED EXTRACTION END ---
    else if (name === 'path') result.path = extractStringValue(val, sourceFile);
    else if (name === 'description') result.description = extractStringValue(val, sourceFile);
    else if (name === 'needAuth') result.needAuth = val.kind === ts.SyntaxKind.TrueKeyword;
    else if (name === 'paramsInUrl') result.paramsInUrl = extractStringValue(val, sourceFile);
  });
  return result;
}

function extractStringValue(node: ts.Expression, sourceFile: ts.SourceFile): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isAsExpression(node)) return extractStringValue(node.expression, sourceFile);
  if (ts.isCallExpression(node)) {
    if (
      node.expression.getText(sourceFile).includes('transformPath') &&
      node.arguments.length > 0
    ) {
      const rawValue = extractStringValue(node.arguments[0], sourceFile);
      if (rawValue) return applyTransformPath(rawValue);
    }
  }
  return undefined;
}

// ==========================================
// 3. OpenAPI 3.1.0 Generation
// ==========================================

function generateOpenAPISpec(
  program: ts.Program,
  configs: ExtractedAPIConfig[],
  tsdkConfig: TSDKConfig
): any {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: `${tsdkConfig.packageName} API`,
      version: '1.0.0',
      description: `Generated from tsdk source files in ${tsdkConfig.baseDir}`,
    },
    servers: [{ url: '/api', description: 'API Server' }],
    paths: {} as Record<string, any>,
    components: {
      schemas: {} as Record<string, any>,
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
    tags: [] as Array<{ name: string; description?: string }>,
  };

  const generator = TJS.buildGenerator(program as any, {
    required: true,
    noExtraProps: false,
    strictNullChecks: false,
    ignoreErrors: true,
    validationKeywords: [],
    ref: true,
    topRef: false,
    defaultProps: true,
    defaultNumberType: 'number',
    titles: true,
  });

  if (!generator) logger.warn('Warning: Could not build schema generator.');

  const registerSchema = (typeName: string) => {
    if (!generator) return null;
    const rawSchema = generator.getSchemaForSymbol(typeName);
    if (!rawSchema) return null;

    const schema = cleanSchemaRefs(rawSchema);

    if (schema._nestedDefinitions) {
      Object.entries(schema._nestedDefinitions).forEach(([key, val]) => {
        const cleanKey = sanitizeSchemaName(key);
        if (!spec.components.schemas[cleanKey]) {
          spec.components.schemas[cleanKey] = val;
        }
      });
      delete schema._nestedDefinitions;
    }

    const cleanTypeName = sanitizeSchemaName(typeName);
    spec.components.schemas[cleanTypeName] = schema;
    return cleanTypeName;
  };

  const resolveRef = (ref: string): any => {
    const cleanRef = sanitizeSchemaName(
      ref.replace('#/definitions/', '').replace('#/components/schemas/', '')
    );
    return spec.components.schemas[cleanRef];
  };

  const convertToParams = (schema: any): any[] => {
    if (!schema) return [];
    const params: any[] = [];
    if (schema.properties) {
      const required = schema.required || [];
      Object.entries(schema.properties).forEach(([name, prop]: [string, any]) => {
        params.push({
          name,
          in: 'query',
          required: required.includes(name),
          schema: prop,
          description: prop.description,
        });
      });
    }
    if (schema.allOf) schema.allOf.forEach((sub: any) => params.push(...convertToParams(sub)));
    if (schema.$ref) {
      const resolved = resolveRef(schema.$ref);
      if (resolved) params.push(...convertToParams(resolved));
    }
    return params;
  };

  // --- Main Loop Over Configs ---
  for (const config of configs) {
    const operationIdBase = config.name
      .replace(/Config$/, '')
      .replace(/API$/, '')
      .replace(/Route$/, '')
      .replace(/^([A-Z])/, (match) => match.toLowerCase());

    let targetPrefixes: string[] = [];
    if (config.type === 'common') {
      targetPrefixes = ['user', 'admin'];
    } else {
      targetPrefixes = [config.type || 'user'];
    }

    for (const prefix of targetPrefixes) {
      const isCommon = config.type === 'common';
      const operationId = isCommon
        ? `${prefix}${operationIdBase.charAt(0).toUpperCase() + operationIdBase.slice(1)}`
        : operationIdBase;

      const rawPath = config.path.startsWith('/') ? config.path : `/${config.path}`;
      let fullPath = rawPath;
      if (!rawPath.startsWith(`/${prefix}/`)) {
        fullPath = `/${prefix}${rawPath}`;
      }
      fullPath = fullPath.replace('//', '/');
      const pathKey = fullPath.replace(/:(\w+)/g, '{$1}');

      if (!spec.paths[pathKey]) spec.paths[pathKey] = {};

      // --- FIXED TAGS GENERATION ---
      const operationTags = [prefix];
      if (config.category) {
        operationTags.push(config.category);
      }
      // -----------------------------

      const operation: any = {
        operationId,
        summary: config.description || config.name,
        tags: operationTags,
        responses: {
          '200': {
            description: 'Successful response',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
          '400': { description: 'Bad Request' },
        },
      };

      if (config.needAuth) {
        operation.responses['401'] = { description: 'Unauthorized' };
        operation.security = [{ bearerAuth: [] }];
      }

      const pathParams = (pathKey.match(/\{(\w+)\}/g) || []).map((m: string) =>
        m.replace(/[{}]/g, '')
      );
      if (pathParams.length > 0) {
        operation.parameters = pathParams.map((param: string) => ({
          name: param,
          in: 'path',
          required: true,
          schema: { type: 'string' },
        }));
      }

      const method = (config.method || 'post').toLowerCase();

      if (config.requestTypeName) {
        let schemaName = null;
        try {
          schemaName = registerSchema(config.requestTypeName);
        } catch (e) {
          logger.warn(`Failed to register request schema: ${config.requestTypeName}`);
        }

        if (schemaName) {
          if (method === 'get' || method === 'delete') {
            if (!operation.parameters) operation.parameters = [];
            const mainSchema = spec.components.schemas[schemaName];
            const queryParams = convertToParams(mainSchema);
            operation.parameters.push(...queryParams);
          } else {
            let contentType = 'application/json';
            if (
              config.requestTypeName &&
              (config.requestTypeName.includes('Upload') ||
                config.requestTypeName.includes('Multipart'))
            ) {
              contentType = 'multipart/form-data';
            }
            operation.requestBody = {
              required: true,
              content: {
                [contentType]: {
                  schema: { $ref: `#/components/schemas/${schemaName}` },
                },
              },
            };
          }
        }
      }

      if (config.responseTypeName) {
        let schemaName = null;
        try {
          schemaName = registerSchema(config.responseTypeName);
        } catch (e) {}
        if (schemaName) {
          operation.responses['200'].content['application/json'].schema = {
            $ref: `#/components/schemas/${schemaName}`,
          };
        }
      }

      spec.paths[pathKey][method] = operation;
    }
  }

  // Populate global tags list
  const usedTags = new Set<string>();
  Object.values(spec.paths).forEach((pathItem: any) => {
    Object.values(pathItem).forEach((op: any) => {
      if (op.tags) op.tags.forEach((t: string) => usedTags.add(t));
    });
  });
  spec.tags = Array.from(usedTags).map((t) => ({ name: t }));

  return spec;
}

// ==========================================
// 4. Main Entry
// ==========================================

async function main() {
  try {
    console.log('🚀 tsdk to OpenAPI Generator (v3.1.0) [Fixed]\n');
    logger.log('🔍 Configuration:');
    logger.log(`   Package: ${config.packageName}`);

    const allFiles = discoverSourceFiles(config);
    const apiconfFiles = allFiles.filter((f) => f.endsWith(`.${config.apiconfExt}.ts`));

    if (apiconfFiles.length === 0) {
      logger.error('No apiconf files found.');
      process.exit(1);
    }

    logger.log('\n🔨 Creating TypeScript program...');
    const program = createTypeScriptProgram(allFiles);

    logger.log('\n📋 Extracting API configurations...');
    const configs = extractAPIConfigs(program, config);

    logger.log('\n📝 API Endpoints Preview:');
    configs.forEach((cfg) => {
      const method = (cfg.method || 'post').toUpperCase();
      const cat = cfg.type || 'user';
      const tagStr = cfg.category ? `[${cfg.category}] ` : '';
      const displayPath = cfg.type === 'common' ? `/{user|admin}${cfg.path}` : `/${cat}${cfg.path}`;
      logger.log(`   ${method.padEnd(6)} ${displayPath.padEnd(35)} ${tagStr}${cfg.name}`);
    });

    logger.log('\n🏗️  Generating OpenAPI 3.1.0 specification...');
    const spec = generateOpenAPISpec(program, configs, config);

    logger.log('\n💾 Writing output files...');
    const yamlContent = yaml.dump(spec, { lineWidth: -1, noRefs: false, sortKeys: false });
    fs.writeFileSync(path.join(baseDirRef, 'openapi.yaml'), yamlContent, 'utf-8');
    fs.writeFileSync(path.join(baseDirRef, 'openapi.json'), JSON.stringify(spec, null, 2), 'utf-8');

    console.log('\n✨ Generation complete! Files written to openapi.yaml and openapi.json\n');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
export { main, generateOpenAPISpec, extractAPIConfigs };
