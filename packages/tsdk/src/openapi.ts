#!/usr/bin/env node

/**
 * Transform OpenAPI spec to APIConfig format
 * * Usage:
 * Bun:  bun transform.ts <file> [-o <output>]
 * Node: ts-node transform.ts <file> [-o <output>]
 */

import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { resolve, basename } from 'path';
import yaml from 'js-yaml';
import { config } from './config';

// ==========================================
// Environment Detection
// ==========================================
const isBun = typeof process.versions.bun !== 'undefined';
const runtimeName = isBun ? 'Bun' : 'Node.js';

interface OpenAPISpec {
  openapi?: string; // v3.x
  swagger?: string; // v2.0
  info: {
    title: string;
    version: string;
    description?: string;
  };
  // v3 style
  paths: Record<string, Record<string, Operation>>;
  components?: {
    schemas?: Record<string, Schema>;
    requestBodies?: Record<string, RequestBody>;
    securitySchemes?: Record<string, SecurityScheme>;
  };
  // v2 style
  definitions?: Record<string, Schema>;
  securityDefinitions?: Record<string, SecurityScheme>;
  // Common
  security?: Array<Record<string, string[]>>;
  // v2 server info
  host?: string;
  basePath?: string;
  schemes?: string[];
}

interface Operation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses?: Record<string, Response>;
  security?: Array<Record<string, string[]>>;
}

interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie' | 'body' | 'formData';
  required?: boolean;
  schema?: Schema;
  description?: string;
  // Swagger 2.0 style (inline type instead of schema)
  type?: string;
  format?: string;
  items?: Schema;
  default?: any;
}

interface RequestBody {
  content?: Record<string, { schema: Schema }>;
  required?: boolean;
  $ref?: string;
}

interface Response {
  description: string;
  content?: Record<string, { schema: Schema }>;
  headers?: Record<string, { schema: Schema; description?: string }>;
}

interface Schema {
  type?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  $ref?: string;
  description?: string;
  example?: any;
  enum?: any[];
  format?: string;
  maximum?: number;
  minimum?: number;
  maxItems?: number;
  minItems?: number;
  additionalProperties?: Schema | boolean;
  // Polymorphic type support
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  discriminator?: {
    propertyName: string;
    mapping?: Record<string, string>;
  };
}

interface SecurityScheme {
  type: string;
  scheme?: string;
  bearerFormat?: string;
  in?: string;
  name?: string;
}

function extractPathParams(path: string): string[] {
  const params: string[] = [];

  // Extract standard {param} format
  const standardMatches = path.match(/\{([^}]+)\}/g);
  if (standardMatches) {
    params.push(...standardMatches.map((m) => m.slice(1, -1)));
  }

  // Extract NuGet-style *param_name format (used in GitLab API)
  const nugetMatches = path.match(/\*([a-zA-Z_][a-zA-Z0-9_]*)/g);
  if (nugetMatches) {
    params.push(...nugetMatches.map((m) => m.slice(1))); // Remove *
  }

  // Remove duplicates
  return Array.from(new Set(params));
}

function normalizePathFormat(path: string): string {
  // Convert *param_name to {param_name}
  return path.replace(/\*([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');
}

function cleanOperationId(operationId: string): string {
  return operationId
    .replace(/\\./g, '') // Remove escaped chars like \( \)
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/[^a-zA-Z0-9_]/g, ''); // Remove other special chars
}

function escapeComment(text: string): string {
  return text.replace(/\*\//g, '*\\/').replace(/\n/g, '\n * '); // Add * prefix to each new line in JSDoc
}

function pascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}

function sanitizeTypeName(name: string): string {
  const reservedKeywords = new Set([
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'null',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'let',
    'static',
    'implements',
    'interface',
    'package',
    'private',
    'protected',
    'public',
    'any',
    'boolean',
    'number',
    'string',
    'symbol',
    'undefined',
    'never',
    'object',
    'unknown',
    'as',
    'async',
    'await',
    'constructor',
    'declare',
    'from',
    'get',
    'module',
    'namespace',
    'of',
    'readonly',
    'require',
    'set',
    'type',
    'abstract',
    'keyof',
    'infer',
    'is',
    'asserts',
  ]);

  let sanitized = pascalCase(name);

  if (reservedKeywords.has(sanitized.toLowerCase())) {
    sanitized = sanitized + 'Type';
  }

  if (!/^[A-Za-z_]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }

  sanitized = sanitized.replace(/[^A-Za-z0-9_]/g, '');

  return sanitized;
}

function sanitizePropertyName(name: string): string {
  const reservedKeywords = new Set([
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'null',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'let',
    'static',
    'implements',
    'interface',
    'package',
    'private',
    'protected',
    'public',
  ]);

  if (reservedKeywords.has(name) || !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) {
    return `"${name}"`;
  }

  return name;
}

function resolveRef(ref: string, spec: OpenAPISpec): any {
  const parts = ref.split('/');
  if (parts[0] !== '#') return null;

  let current: any = spec;
  for (let i = 1; i < parts.length; i++) {
    // Handle v2 'definitions' vs v3 'components/schemas'
    if (parts[i] === 'definitions' && !current.definitions && current.components?.schemas) {
      current = current.components.schemas;
      continue;
    }
    current = current?.[parts[i]];
    if (!current) return null;
  }
  return current;
}

function getContentType(content: Record<string, any>): string | null {
  const types = Object.keys(content);
  if (types.includes('application/json')) return 'application/json';
  if (types.includes('multipart/form-data')) return 'multipart/form-data';
  if (types.includes('text/plain')) return 'text/plain';
  if (types.includes('text/html')) return 'text/html';
  if (types.includes('text/csv')) return 'text/csv';
  if (types.includes('application/xml')) return 'application/xml';
  if (types.includes('text/xml')) return 'text/xml';
  return null;
}

function parameterToSchema(param: Parameter): Schema {
  if (param.schema) {
    return param.schema;
  }
  const schema: Schema = {
    type: param.type,
    format: param.format,
    description: param.description,
  };
  if (param.type === 'array' && param.items) {
    schema.items = param.items;
  }
  return schema;
}

function expandDiscriminatorTypes(schema: Schema, spec: OpenAPISpec, indent: number): string {
  const schemas = spec.components?.schemas || spec.definitions;
  if (!schemas) return 'any';

  const discriminatorProp = schema.discriminator?.propertyName;
  if (!discriminatorProp) return 'any';

  const subtypes: string[] = [];

  if (schema.discriminator?.mapping) {
    for (const ref of Object.values(schema.discriminator.mapping)) {
      const typeName = ref.split('/').pop();
      if (typeName) subtypes.push(sanitizeTypeName(typeName));
    }
  } else {
    for (const [name, candidateSchema] of Object.entries(schemas)) {
      if (candidateSchema.allOf) {
        for (const item of candidateSchema.allOf) {
          if (
            item.$ref &&
            item.$ref.endsWith(`/${schema.discriminator?.propertyName || 'unknown'}`)
          ) {
            subtypes.push(sanitizeTypeName(name));
          }
        }
      }
    }
  }

  return subtypes.length > 0 ? subtypes.join(' | ') : 'any';
}

function schemaToTypeScript(
  schema: Schema | undefined,
  spec: OpenAPISpec,
  indent = 0,
  visitedRefs = new Set<string>(),
  expandDiscriminator = false
): string {
  const indentStr = '  '.repeat(indent);

  if (!schema) return 'unknown';

  if (schema.$ref) {
    if (visitedRefs.has(schema.$ref)) {
      const typeName = schema.$ref.split('/').pop();
      return typeName ? sanitizeTypeName(typeName) : 'any';
    }

    const resolved = resolveRef(schema.$ref, spec);
    const typeName = schema.$ref.split('/').pop();
    const sanitizedTypeName = typeName ? sanitizeTypeName(typeName) : 'any';

    if (resolved) {
      if (
        schema.$ref.startsWith('#/components/schemas/') ||
        schema.$ref.startsWith('#/definitions/')
      ) {
        if (expandDiscriminator && resolved.discriminator) {
          return expandDiscriminatorTypes(resolved, spec, indent);
        }
        return sanitizedTypeName;
      }

      visitedRefs.add(schema.$ref);
      const result = schemaToTypeScript(resolved, spec, indent, visitedRefs, expandDiscriminator);
      visitedRefs.delete(schema.$ref);
      return result;
    }
    return sanitizedTypeName;
  }

  if (schema.allOf) {
    const types = schema.allOf.map((s) => {
      if (!s) return 'unknown';
      if (s.$ref) {
        const typeName = s.$ref.split('/').pop();
        return typeName
          ? sanitizeTypeName(typeName)
          : schemaToTypeScript(s, spec, indent, visitedRefs, expandDiscriminator);
      }
      return schemaToTypeScript(s, spec, indent, visitedRefs, expandDiscriminator);
    });

    if (types.every((t) => !t.includes('{') && !t.includes('|') && t !== 'unknown')) {
      return types.filter((t) => t !== 'unknown').join(' & ') || 'unknown';
    }

    const mergedProps: Record<string, Schema> = {};
    const mergedRequired: string[] = [];

    for (const s of schema.allOf) {
      if (!s) continue;
      const resolved = s.$ref ? resolveRef(s.$ref, spec) : s;
      if (resolved?.properties) {
        Object.assign(mergedProps, resolved.properties);
      }
      if (resolved?.required) {
        mergedRequired.push(...resolved.required);
      }
    }

    if (Object.keys(mergedProps).length > 0) {
      const props = Object.entries(mergedProps)
        .map(([key, prop]) => {
          const optional = !mergedRequired.includes(key) ? '?' : '';
          const propType = schemaToTypeScript(
            prop,
            spec,
            indent + 1,
            visitedRefs,
            expandDiscriminator
          );
          const sanitizedKey = sanitizePropertyName(key);
          const desc = prop?.description
            ? `\n${indentStr}  /** ${escapeComment(prop.description)} */`
            : '';
          return `${desc}\n${indentStr}  ${sanitizedKey}${optional}: ${propType};`;
        })
        .join('\n');
      return `{\n${props}\n${indentStr}}`;
    }

    return types.filter((t) => t !== 'unknown').join(' & ') || 'unknown';
  }

  if (schema.oneOf) {
    const types = schema.oneOf
      .map((s) => schemaToTypeScript(s, spec, indent, visitedRefs, expandDiscriminator))
      .filter((t) => t !== 'unknown');
    return types.length > 0 ? types.join(' | ') : 'unknown';
  }

  if (schema.anyOf) {
    const types = schema.anyOf
      .map((s) => schemaToTypeScript(s, spec, indent, visitedRefs, expandDiscriminator))
      .filter((t) => t !== 'unknown');
    return types.length > 0 ? types.join(' | ') : 'unknown';
  }

  if (schema.enum) {
    return schema.enum.map((v) => JSON.stringify(v)).join(' | ');
  }

  switch (schema.type) {
    case 'string':
      if (schema.format === 'binary') {
        return 'File';
      }
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      if (schema.items) {
        return `Array<${schemaToTypeScript(schema.items, spec, indent, visitedRefs, expandDiscriminator)}>`;
      }
      return 'Array<any>';
    case 'object':
      if (schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([key, prop]) => {
            const optional = !schema.required?.includes(key) ? '?' : '';
            const propType = schemaToTypeScript(
              prop,
              spec,
              indent + 1,
              visitedRefs,
              expandDiscriminator
            );
            const sanitizedKey = sanitizePropertyName(key);
            const desc = prop?.description
              ? `\n${indentStr}  /** ${escapeComment(prop.description)} */`
              : '';
            return `${desc}\n${indentStr}  ${sanitizedKey}${optional}: ${propType};`;
          })
          .join('\n');

        if (props.trim().length === 0) {
          return 'Record<string, unknown>';
        }
        return `{\n${props}\n${indentStr}}`;
      }
      if (schema.additionalProperties) {
        if (typeof schema.additionalProperties === 'boolean') {
          return 'Record<string, unknown>';
        }
        const valueType = schemaToTypeScript(
          schema.additionalProperties,
          spec,
          indent,
          visitedRefs,
          expandDiscriminator
        );
        return `Record<string, ${valueType}>`;
      }
      return 'Record<string, unknown>';
    default:
      if (schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([key, prop]) => {
            const optional = !schema.required?.includes(key) ? '?' : '';
            const propType = schemaToTypeScript(
              prop,
              spec,
              indent + 1,
              visitedRefs,
              expandDiscriminator
            );
            const sanitizedKey = sanitizePropertyName(key);
            const desc = prop?.description
              ? `\n${indentStr}  /** ${escapeComment(prop.description)} */`
              : '';
            return `${desc}\n${indentStr}  ${sanitizedKey}${optional}: ${propType};`;
          })
          .join('\n');

        if (props.trim().length === 0) {
          return 'Record<string, unknown>';
        }
        return `{\n${props}\n${indentStr}}`;
      }
      return 'unknown';
  }
}

function generateComponentTypes(spec: OpenAPISpec): string {
  const schemas = spec.components?.schemas || spec.definitions;
  if (!schemas) return '';

  let output = '// ========== Component Schemas ==========\n\n';

  for (const [name, schema] of Object.entries(schemas)) {
    const sanitizedName = sanitizeTypeName(name);
    const desc = schema.description ? `/**\n * ${escapeComment(schema.description)}\n */\n` : '';
    const type = schemaToTypeScript(schema, spec, 0);
    output += `${desc}export type ${sanitizedName} = ${type};\n\n`;
  }

  return output;
}

function requiresAuth(operation: Operation, spec: OpenAPISpec): boolean {
  if (operation.security !== undefined) {
    if (operation.security.length === 0) return false;
    if (operation.security.length > 0) return true;
  }
  if (spec.security !== undefined && spec.security.length > 0) {
    return true;
  }
  return false;
}

function generateFormDataType(schema: Schema, spec: OpenAPISpec): string {
  if (!schema.properties) {
    return 'FormData';
  }

  const props = Object.entries(schema.properties)
    .map(([key, prop]) => {
      const optional = !schema.required?.includes(key) ? '?' : '';
      const sanitizedKey = sanitizePropertyName(key);
      const desc = prop?.description ? `\n  /** ${escapeComment(prop.description)} */` : '';

      if (prop.type === 'string' && prop.format === 'binary') {
        return `${desc}\n  ${sanitizedKey}${optional}: File;`;
      }
      if (
        prop.type === 'array' &&
        prop.items?.type === 'string' &&
        prop.items?.format === 'binary'
      ) {
        return `${desc}\n  ${sanitizedKey}${optional}: File[];`;
      }

      const propType = schemaToTypeScript(prop, spec, 1);
      return `${desc}\n  ${sanitizedKey}${optional}: ${propType};`;
    })
    .join('\n');

  return `{\n${props}\n}`;
}

function generateOperationCode(
  path: string,
  method: string,
  operation: Operation,
  spec: OpenAPISpec
): string {
  const normalizedPath = normalizePathFormat(path);
  const rawOperationId = operation.operationId || `${method}${path.replace(/[^a-zA-Z0-9]/g, '')}`;
  const cleanedOperationId = cleanOperationId(rawOperationId);
  const name = sanitizeTypeName(cleanedOperationId);
  const tag = operation.tags?.[0] || 'general';
  const needsAuth = requiresAuth(operation, spec);
  const pathParamNames = extractPathParams(path);

  const description =
    operation.summary || operation.description || `${method.toUpperCase()} ${path}`;

  let jsdoc = `/**\n * ${escapeComment(description)}`;
  if (operation.description && operation.description !== operation.summary && operation.summary) {
    jsdoc += `\n * \n * ${escapeComment(operation.description)}`;
  }
  jsdoc += `\n * @category ${tag}\n */\n`;

  let configFields = `  type: 'user',\n  method: "${method}",\n  path: "${normalizedPath}"`;
  if (needsAuth) {
    configFields += `,\n  needAuth: true`;
  }
  if (pathParamNames.length > 0) {
    configFields += `,\n  paramsInUrl: '{}'`;
  }

  const configCode = `${jsdoc}export const ${name}Config: APIConfig = {\n${configFields},\n};\n\n`;

  let reqType = 'Record<string, unknown>';
  const pathParams: Parameter[] = [];
  const queryParams: Parameter[] = [];
  const headerParams: Parameter[] = [];
  let bodySchema: Schema | null = null;
  let contentType: string | null = null;

  if (operation.parameters) {
    operation.parameters.forEach((param) => {
      if (param.in === 'path') {
        pathParams.push(param);
      } else if (param.in === 'query') {
        queryParams.push(param);
      } else if (param.in === 'header') {
        headerParams.push(param);
      }
    });
  }

  const pathParamMap = new Map<string, Parameter>();
  pathParams.forEach((param) => {
    pathParamMap.set(param.name, param);
  });
  pathParamNames.forEach((paramName) => {
    if (!pathParamMap.has(paramName)) {
      pathParamMap.set(paramName, {
        name: paramName,
        in: 'path',
        required: true,
        schema: { type: 'string' },
      });
    }
  });

  if (operation.requestBody) {
    let requestBody = operation.requestBody;
    if (requestBody.$ref) {
      const resolved = resolveRef(requestBody.$ref, spec);
      if (resolved) {
        requestBody = resolved;
      }
    }
    if (requestBody.content) {
      contentType = getContentType(requestBody.content);
      if (contentType) {
        const content = requestBody.content[contentType];
        if (content?.schema) {
          bodySchema = content.schema;
        }
      }
    }
  }

  if (pathParamMap.size || queryParams.length || headerParams.length || bodySchema) {
    const parts: string[] = [];

    if (pathParamMap.size) {
      pathParamMap.forEach((param) => {
        const sanitizedName = sanitizePropertyName(param.name);
        const desc = param.description ? `\n  /** ${escapeComment(param.description)} */` : '';
        const paramSchema = parameterToSchema(param);
        const paramType = schemaToTypeScript(paramSchema, spec, 1);
        parts.push(`${desc}\n  ${sanitizedName}: ${paramType};`);
      });
    }

    if (queryParams.length) {
      const queryProps = queryParams
        .map((p) => {
          const optional = !p.required ? '?' : '';
          const sanitizedName = sanitizePropertyName(p.name);
          const desc = p.description ? `\n  /** ${escapeComment(p.description)} */` : '';
          const paramSchema = parameterToSchema(p);
          return `${desc}\n  ${sanitizedName}${optional}: ${schemaToTypeScript(paramSchema, spec, 1)};`;
        })
        .join('');

      if (bodySchema) {
        parts.push(`  params: {${queryProps}\n  };`);
      } else {
        parts.push(queryProps);
      }
    }

    if (headerParams.length) {
      const headerProps = headerParams
        .map((p) => {
          const optional = !p.required ? '?' : '';
          const sanitizedName = sanitizePropertyName(p.name);
          const desc = p.description ? `\n    /** ${escapeComment(p.description)} */` : '';
          const paramSchema = parameterToSchema(p);
          return `${desc}\n    ${sanitizedName}${optional}: ${schemaToTypeScript(paramSchema, spec, 2)};`;
        })
        .join('');
      parts.push(`  header: {${headerProps}\n  };`);
    }

    if (bodySchema) {
      let bodyType: string;
      if (contentType === 'multipart/form-data') {
        bodyType = generateFormDataType(bodySchema, spec);
      } else {
        bodyType = schemaToTypeScript(bodySchema, spec, 0);
      }

      if (queryParams.length) {
        parts.push(`  body: ${bodyType};`);
      } else {
        reqType = bodyType;
      }
    }

    if (parts.length > 0) {
      reqType = `{\n${parts.join('\n')}\n}`;
    }
  }

  const reqJsdoc =
    pathParamMap.size || queryParams.length || headerParams.length || bodySchema
      ? `/**\n * Request parameters.\n * @category ${tag}\n */\n`
      : `/**\n * No request parameters required.\n * @category ${tag}\n */\n`;
  const reqCode = `${reqJsdoc}export type ${name}Req = ${reqType};\n\n`;

  let resType = 'void';
  const successResponse =
    operation.responses?.['200'] || operation.responses?.['201'] || operation.responses?.['204'];

  if (successResponse) {
    if (successResponse.content) {
      contentType = getContentType(successResponse.content);
      if (contentType) {
        const content = successResponse.content[contentType];
        if (content?.schema) {
          if (contentType === 'multipart/form-data') {
            resType = 'FormData';
          } else {
            resType = schemaToTypeScript(content.schema, spec, 0);
          }
        }
      } else {
        const contentTypes = Object.keys(successResponse.content);
        if (contentTypes.length > 0) {
          resType = 'unknown';
        }
      }
    }
  }

  const resDesc = successResponse?.description || 'Success response';
  const resJsdoc = `/**\n * ${resDesc}\n * @category ${tag}\n */\n`;
  const resCode = `${resJsdoc}export type ${name}Res = ${resType};\n\n`;

  return `${configCode}${reqCode}${resCode}// --------- ${name} END ---------\n\n`;
}

function transformOpenAPISpec(spec: OpenAPISpec): string {
  const version = spec.openapi || spec.swagger || 'unknown';
  let output = `// Generated from OpenAPI spec: ${spec.info.title} ${spec.info.version.toLowerCase().startsWith('v') ? '' : 'v'}${spec.info.version}\n`;
  output += `// Spec version: ${version}\n`;
  if (spec.info.description) {
    const lines = spec.info.description.split('\n');
    for (const line of lines) {
      output += `// ${line}\n`;
    }
  }
  output += `import { type APIConfig } from "@/src/tsdk-shared/helpers";\n\n`;

  output += generateComponentTypes(spec);
  output += '// ========== API Operations ==========\n\n';

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(method)) {
        output += generateOperationCode(path, method, operation as Operation, spec);
      }
    }
  }

  return output;
}

export function removeRepeat(source: string): string {
  const lines = source.split('\n');
  const output: string[] = [];
  let depth = 0;
  const seenKeysAtLevel1 = new Set<string>();
  let entryBuffer: string[] = [];
  let skipBlockUntilDepth: number | null = null;
  const blockStartRegex = /export\s+(type|const|interface)\s+[\w\d_]+\s*(?:=|extends.*)?\s*\{/;
  const propertyKeyRegex = /^\s*(?:readonly\s+)?([a-zA-Z0-9_$]+)\??\s*:/;

  for (const line of lines) {
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    const netChange = openBraces - closeBraces;

    if (skipBlockUntilDepth !== null) {
      depth += netChange;
      if (depth <= skipBlockUntilDepth) {
        skipBlockUntilDepth = null;
      }
      continue;
    }

    if (depth === 0 && blockStartRegex.test(line)) {
      depth = 1;
      seenKeysAtLevel1.clear();
      entryBuffer = [];
      output.push(line);
      continue;
    }

    if (depth > 0) {
      if (depth > 1) {
        if (entryBuffer.length) {
          output.push(...entryBuffer);
          entryBuffer = [];
        }
        output.push(line);
        depth += netChange;
        continue;
      }

      const match = line.match(propertyKeyRegex);

      if (match) {
        const key = match[1];

        if (seenKeysAtLevel1.has(key)) {
          entryBuffer = [];
          if (netChange > 0) {
            skipBlockUntilDepth = depth;
            depth += netChange;
          }
        } else {
          seenKeysAtLevel1.add(key);
          output.push(...entryBuffer);
          output.push(line);
          entryBuffer = [];
          depth += netChange;
        }
      } else {
        if (depth === 1 && line.trim().startsWith('}')) {
          output.push(...entryBuffer);
          output.push(line);
          entryBuffer = [];
          depth += netChange;
        } else {
          entryBuffer.push(line);
          depth += netChange;
        }
      }
    } else {
      output.push(line);
    }
  }

  return output.join('\n');
}

async function parseSpec(content: string, filename: string): Promise<OpenAPISpec> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'json') {
    return JSON.parse(content);
  } else if (ext === 'yaml' || ext === 'yml') {
    // If using Node, this ensures compat with ESM or CJS environments
    try {
      return yaml.load(content) as OpenAPISpec;
    } catch (error) {
      try {
        return JSON.parse(content);
      } catch {
        console.error('❌ Error: YAML parsing failed.');
        console.error("Make sure 'js-yaml' is installed and imported correctly.");
        console.error(`Runtime: ${runtimeName}`);
        console.error('Run: bun add js-yaml @types/js-yaml');
        process.exit(1);
      }
    }
  }

  throw new Error('Unsupported file format');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(`Usage: tsdk --openapi <openapi-file> [-o <output-file>]`);
    process.exit(1);
  }

  // Argument Parsing
  let inputFile: string | null = null;
  let outputFile: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-o' || arg === '--output') {
      if (i + 1 < args.length) {
        outputFile = args[i + 1];
        i++; // skip next arg
      } else {
        console.error('❌ Error: Missing output file path after -o/--output');
        process.exit(1);
      }
    } else if (!arg.startsWith('-')) {
      inputFile = arg;
    }
  }

  if (!inputFile) {
    console.error('❌ Error: No input file specified');
    process.exit(1);
  }

  const resolvedInput = resolve(inputFile);

  // Check if input file exists
  if (!existsSync(resolvedInput)) {
    console.error(`❌ Error: Input file not found: ${resolvedInput}`);
    process.exit(1);
  }

  // Check file extension
  const ext = resolvedInput.split('.').pop()?.toLowerCase();
  if (!ext || !['json', 'yaml', 'yml'].includes(ext)) {
    console.error('❌ Error: Only JSON, YAML, and YML files are supported');
    process.exit(1);
  }

  // Determine output file
  let resolvedOutput: string;
  const defaultFilename = basename(resolvedInput).replace(
    /\.(json|yaml|yml)$/,
    `.${config.apiconfExt}.ts`
  );

  if (outputFile) {
    const outPath = resolve(outputFile);
    // Check if path exists and is a directory
    let isDir = false;
    try {
      if (existsSync(outPath) && statSync(outPath).isDirectory()) {
        isDir = true;
      }
    } catch {
      // ignore
    }

    if (isDir) {
      // It's a directory: append the default filename
      resolvedOutput = resolve(outPath, defaultFilename);
    } else {
      // It's a file (existing or new)
      resolvedOutput = outPath;
    }
  } else {
    // No output specified: use current directory + default filename
    resolvedOutput = resolve(defaultFilename);
  }

  try {
    const specContent = readFileSync(resolvedInput, 'utf-8');
    const spec = await parseSpec(specContent, resolvedInput);

    console.log(`🤖 Runtime: ${runtimeName}`);
    console.log(
      `📖 Reading: ${spec.info.title} ${spec.info.version.toLowerCase().startsWith('v') ? '' : 'v'}${spec.info.version}`
    );
    console.log(`📝 Transforming OpenAPI spec...`);

    const transformed = removeRepeat(transformOpenAPISpec(spec));

    writeFileSync(resolvedOutput, transformed);
    console.log(`✅ Success! Generated: ${resolvedOutput}`);

    // Print stats
    const pathCount = Object.keys(spec.paths).length;
    const operationCount = Object.values(spec.paths).reduce(
      (acc, methods) =>
        acc +
        Object.keys(methods).filter((m) =>
          ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(m)
        ).length,
      0
    );
    const schemaCount = Object.keys(spec.components?.schemas || spec.definitions || {}).length;
    const hasAuth =
      spec.security !== undefined ||
      Object.values(spec.paths).some((methods) =>
        Object.values(methods).some((op: any) => op.security !== undefined)
      );

    const specVersion = spec.openapi || spec.swagger || 'unknown';

    console.log(`\n📊 Stats:`);
    console.log(`   - Spec version: ${specVersion}`);
    console.log(`   - ${pathCount} paths`);
    console.log(`   - ${operationCount} operations`);
    console.log(`   - ${schemaCount} schemas`);
    if (hasAuth) {
      console.log(`   - 🔒 Auth required`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
