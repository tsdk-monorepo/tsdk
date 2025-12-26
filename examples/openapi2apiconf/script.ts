#!/usr/bin/env bun

/**
 * Transform OpenAPI spec to APIConfig format
 * Usage: bun run transform.ts <openapi-file.json|yaml|yml>
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

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
  // Example: Packages(Id='*package_name',Version='*package_version')
  const nugetMatches = path.match(/\*([a-zA-Z_][a-zA-Z0-9_]*)/g);
  if (nugetMatches) {
    params.push(...nugetMatches.map((m) => m.slice(1))); // Remove *
  }

  // Remove duplicates
  return Array.from(new Set(params));
}

// FIX #1: Normalize path to use standard {param} format
function normalizePathFormat(path: string): string {
  // Convert *param_name to {param_name}
  return path.replace(/\*([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');
}

function cleanOperationId(operationId: string): string {
  // Remove escaped characters and special chars from operationId
  // Example: getApiV4ProjectsPackages\(\) -> getApiV4ProjectsPackages
  return operationId
    .replace(/\\./g, '') // Remove escaped chars like \( \)
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/[^a-zA-Z0-9_]/g, ''); // Remove other special chars
}

function escapeComment(text: string): string {
  // Escape */ in comments to prevent breaking JSDoc
  // Also handle newlines properly in JSDoc comments
  return text.replace(/\*\//g, '*\\/').replace(/\n/g, '\n * '); // Add * prefix to each new line in JSDoc
}

function pascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}

function sanitizeTypeName(name: string): string {
  // Reserved JavaScript/TypeScript keywords
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

  // Convert to PascalCase first
  let sanitized = pascalCase(name);

  // If it's a reserved keyword (case-insensitive check), append 'Type'
  if (reservedKeywords.has(sanitized.toLowerCase())) {
    sanitized = sanitized + 'Type';
  }

  // Ensure it starts with a letter or underscore
  if (!/^[A-Za-z_]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }

  // Remove any remaining invalid characters
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

  // If it's a reserved keyword or needs quoting, wrap in quotes
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

  // Support JSON, multipart, and text content types
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
  // Convert Swagger 2.0 parameter to OpenAPI 3.0 schema format
  if (param.schema) {
    return param.schema;
  }

  // Swagger 2.0 inline type
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
  // Find all schemas that extend this one using allOf
  const schemas = spec.components?.schemas || spec.definitions;
  if (!schemas) return 'any';

  const discriminatorProp = schema.discriminator?.propertyName;
  if (!discriminatorProp) return 'any';

  const subtypes: string[] = [];

  // Check mapping first
  if (schema.discriminator?.mapping) {
    for (const ref of Object.values(schema.discriminator.mapping)) {
      const typeName = ref.split('/').pop();
      if (typeName) subtypes.push(sanitizeTypeName(typeName));
    }
  } else {
    // Find subtypes by scanning all schemas for allOf references
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

  // Handle undefined or null schemas
  if (!schema) {
    return 'unknown';
  }

  if (schema.$ref) {
    // Check for circular references
    if (visitedRefs.has(schema.$ref)) {
      const typeName = schema.$ref.split('/').pop();
      return typeName ? sanitizeTypeName(typeName) : 'any';
    }

    const resolved = resolveRef(schema.$ref, spec);
    const typeName = schema.$ref.split('/').pop();
    const sanitizedTypeName = typeName ? sanitizeTypeName(typeName) : 'any';

    if (resolved) {
      // For top-level component schemas (v2 definitions or v3 components/schemas)
      if (
        schema.$ref.startsWith('#/components/schemas/') ||
        schema.$ref.startsWith('#/definitions/')
      ) {
        // If the schema has a discriminator and we want to expand it, return union of subtypes
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

  // Handle allOf - merge all schemas
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

    // If all are simple type names, use intersection
    if (types.every((t) => !t.includes('{') && !t.includes('|') && t !== 'unknown')) {
      return types.filter((t) => t !== 'unknown').join(' & ') || 'unknown';
    }

    // Otherwise, merge objects inline
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

  // Handle oneOf - union type
  if (schema.oneOf) {
    const types = schema.oneOf
      .map((s) => schemaToTypeScript(s, spec, indent, visitedRefs, expandDiscriminator))
      .filter((t) => t !== 'unknown');
    return types.length > 0 ? types.join(' | ') : 'unknown';
  }

  // Handle anyOf - union type (same as oneOf in TypeScript)
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
      // Add format hints as comments if present
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

        // If no properties, return Record<string, unknown> instead of {}
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
      // Handle schemas with no type specified
      if (schema.properties) {
        // If it has properties, treat as object
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
  // Support both v2 (definitions) and v3 (components.schemas)
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
  // Check operation-level security
  if (operation.security !== undefined) {
    // Empty array means no security required
    if (operation.security.length === 0) return false;
    // Non-empty array means security required
    if (operation.security.length > 0) return true;
  }

  // Check global security
  if (spec.security !== undefined && spec.security.length > 0) {
    return true;
  }

  return false;
}

// FIX #4d: Generate proper TypeScript types from multipart/form-data schema
function generateFormDataType(schema: Schema, spec: OpenAPISpec): string {
  if (!schema.properties) {
    return 'FormData';
  }

  const props = Object.entries(schema.properties)
    .map(([key, prop]) => {
      const optional = !schema.required?.includes(key) ? '?' : '';
      const sanitizedKey = sanitizePropertyName(key);
      const desc = prop?.description ? `\n  /** ${escapeComment(prop.description)} */` : '';

      // For file uploads
      if (prop.type === 'string' && prop.format === 'binary') {
        return `${desc}\n  ${sanitizedKey}${optional}: File;`;
      }

      // For arrays of files
      if (
        prop.type === 'array' &&
        prop.items?.type === 'string' &&
        prop.items?.format === 'binary'
      ) {
        return `${desc}\n  ${sanitizedKey}${optional}: File[];`;
      }

      // For regular properties
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
  // FIX #1: Normalize path format
  const normalizedPath = normalizePathFormat(path);

  // Clean the operationId if it exists
  const rawOperationId = operation.operationId || `${method}${path.replace(/[^a-zA-Z0-9]/g, '')}`;
  const cleanedOperationId = cleanOperationId(rawOperationId);
  const name = sanitizeTypeName(cleanedOperationId);
  const tag = operation.tags?.[0] || 'general';
  const needsAuth = requiresAuth(operation, spec);
  const pathParamNames = extractPathParams(path);

  // Generate JSDoc comment
  const description =
    operation.summary || operation.description || `${method.toUpperCase()} ${path}`;

  let jsdoc = `/**\n * ${escapeComment(description)}`;
  if (operation.description && operation.description !== operation.summary && operation.summary) {
    // If we have both summary and description, add description as additional lines
    jsdoc += `\n * \n * ${escapeComment(operation.description)}`;
  }
  jsdoc += `\n * @category ${tag}\n */\n`;

  // Generate APIConfig - use normalized path
  let configFields = `  type: 'user',\n  method: "${method}",\n  path: "${normalizedPath}"`;
  if (needsAuth) {
    configFields += `,\n  needAuth: true`;
  }

  // Add paramsInUrl if there are path parameters
  if (pathParamNames.length > 0) {
    configFields += `,\n  paramsInUrl: '{}'`;
  }

  const configCode = `${jsdoc}export const ${name}Config: APIConfig = {\n${configFields},\n};\n\n`;

  // Generate Request type
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

  // FIX #2: Build path params map to avoid duplicates and prioritize schema types
  const pathParamMap = new Map<string, Parameter>();

  // First, add parameters from the parameters array (these have schema info)
  pathParams.forEach((param) => {
    pathParamMap.set(param.name, param);
  });

  // Then, add any path params found in the URL that weren't in parameters array
  pathParamNames.forEach((paramName) => {
    if (!pathParamMap.has(paramName)) {
      // Create a default parameter for path params not defined in parameters array
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

    // Resolve $ref in requestBody
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

    // Add path params using the deduplicated map
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

    // Body with proper FormData type generation
    if (bodySchema) {
      let bodyType: string;

      if (contentType === 'multipart/form-data') {
        // FIX #4d: Generate proper type from schema
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

    // Build the final type
    if (parts.length > 0) {
      reqType = `{\n${parts.join('\n')}\n}`;
    }
  }

  const reqJsdoc =
    pathParamMap.size || queryParams.length || headerParams.length || bodySchema
      ? `/**\n * Request parameters.\n * @category ${tag}\n */\n`
      : `/**\n * No request parameters required.\n * @category ${tag}\n */\n`;
  const reqCode = `${reqJsdoc}export type ${name}Req = ${reqType};\n\n`;

  // FIX #3: Generate Response type with better void detection
  let resType = 'void';
  const successResponse =
    operation.responses?.['200'] || operation.responses?.['201'] || operation.responses?.['204'];

  if (successResponse) {
    // Check if response has content
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
        // FIX #3: Handle other content types (not just JSON/multipart)
        const contentTypes = Object.keys(successResponse.content);
        if (contentTypes.length > 0) {
          // If there's any content but not JSON/multipart, return unknown instead of void
          resType = 'unknown';
        }
      }
    }
    // FIX #3: If no content, resType stays 'void' (correct for 204, DELETE, etc.)
  }

  const resDesc = successResponse?.description || 'Success response';
  const resJsdoc = `/**\n * ${resDesc}\n * @category ${tag}\n */\n`;
  const resCode = `${resJsdoc}export type ${name}Res = ${resType};\n\n`;

  return `${configCode}${reqCode}${resCode}// --------- ${name} END ---------\n\n`;
}

function transformOpenAPISpec(spec: OpenAPISpec): string {
  const version = spec.openapi || spec.swagger || 'unknown';
  let output = `// Generated from OpenAPI spec: ${spec.info.title} v${spec.info.version}\n`;
  output += `// Spec version: ${version}\n`;
  if (spec.info.description) {
    // Handle multi-line descriptions in the header - each line needs //
    const lines = spec.info.description.split('\n');
    for (const line of lines) {
      output += `// ${line}\n`;
    }
  }
  output += `import { type APIConfig } from "@/src/tsdk-shared/helpers";\n\n`;

  // Generate component types first
  output += generateComponentTypes(spec);

  // Generate operations
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

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: bun run transform.ts <openapi-file.json|yaml|yml>');
  console.error('\nExample:');
  console.error('  bun run transform.ts petstore.json');
  console.error('  bun run transform.ts petstore.yaml');
  console.error('  bun run transform.ts petstore.yml');
  process.exit(1);
}

const inputFile = resolve(args[0]);

// Check file extension
const ext = inputFile.split('.').pop()?.toLowerCase();
if (!ext || !['json', 'yaml', 'yml'].includes(ext)) {
  console.error('❌ Error: Only JSON, YAML, and YML files are supported');
  process.exit(1);
}

async function parseSpec(content: string, filename: string): Promise<OpenAPISpec> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'json') {
    return JSON.parse(content);
  } else if (ext === 'yaml' || ext === 'yml') {
    // Use js-yaml for YAML parsing
    try {
      // Try to import js-yaml dynamically
      const yaml = await import('js-yaml');
      return yaml.load(content) as OpenAPISpec;
    } catch (error) {
      // Fallback: Try to parse as JSON (some YAML is valid JSON)
      try {
        return JSON.parse(content);
      } catch {
        console.error('❌ Error: YAML parsing requires js-yaml package');
        console.error('\nInstall it with:');
        console.error('  bun add js-yaml');
        console.error('  bun add -d @types/js-yaml');
        console.error('\nOr convert your YAML to JSON:');
        console.error('  yq eval -o=json openapi.yaml > openapi.json');
        process.exit(1);
      }
    }
  }

  throw new Error('Unsupported file format');
}
export function removeRepeat(source: string): string {
  const lines = source.split('\n');
  const output: string[] = [];

  // Tracks the current nesting level of braces { }
  // 0 = Outside any block
  // 1 = Inside the main definition (export type X = { ... })
  // >1 = Inside a nested object (nested: { ... })
  let depth = 0;

  // Track keys seen ONLY at depth 1 (the top level of the type/obj)
  const seenKeysAtLevel1 = new Set<string>();

  // Buffer for comments/whitespace to attach to the NEXT valid property
  let entryBuffer: string[] = [];

  // If we detect a duplicate that opens a block (e.g. "dup: {"),
  // we must skip all lines until that block closes.
  let skipBlockUntilDepth: number | null = null;

  // Regex helpers
  // Matches "export type X = {" or "export const X = {" or "export interface X {"
  const blockStartRegex = /export\s+(type|const|interface)\s+[\w\d_]+\s*(?:=|extends.*)?\s*\{/;

  // Matches "key:", "key?:", "readonly key:"
  const propertyKeyRegex = /^\s*(?:readonly\s+)?([a-zA-Z0-9_$]+)\??\s*:/;

  for (const line of lines) {
    // Count braces to track depth changes
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    const netChange = openBraces - closeBraces;

    // 1. SKIP MODE: We are currently skipping a duplicate nested block
    if (skipBlockUntilDepth !== null) {
      depth += netChange;
      // If depth drops back to the level where we started skipping, stop skipping
      if (depth <= skipBlockUntilDepth) {
        skipBlockUntilDepth = null;
      }
      continue; // Discard this line
    }

    // 2. DETECT NEW BLOCK START
    if (depth === 0 && blockStartRegex.test(line)) {
      depth = 1; // We assume the '{' is in this line based on standard formatting
      seenKeysAtLevel1.clear();
      entryBuffer = [];
      output.push(line);
      continue;
    }

    // 3. PROCESS INSIDE BLOCK
    if (depth > 0) {
      // If we are deep inside a nested object (depth > 1), just preserve everything.
      // We only filter duplicates at Level 1.
      if (depth > 1) {
        // Flush any pending buffer from the transition
        if (entryBuffer.length) {
          output.push(...entryBuffer);
          entryBuffer = [];
        }
        output.push(line);
        depth += netChange;
        continue;
      }

      // We are strictly at Level 1. Check if this line defines a property.
      const match = line.match(propertyKeyRegex);

      if (match) {
        const key = match[1];

        if (seenKeysAtLevel1.has(key)) {
          // --- DUPLICATE DETECTED ---
          entryBuffer = []; // Discard comments associated with this duplicate

          // If this duplicate opens a nested block (has '{'), we must trigger Skip Mode
          if (netChange > 0) {
            skipBlockUntilDepth = depth; // Current depth (1)
            depth += netChange;
          }
          // If it's a simple one-liner, we just don't push it.
        } else {
          // --- NEW VALID KEY ---
          seenKeysAtLevel1.add(key);
          output.push(...entryBuffer); // Write buffered comments
          output.push(line); // Write the property
          entryBuffer = [];
          depth += netChange;
        }
      } else {
        // Not a key (comment, whitespace, or closing brace of the main block)

        // If it's the closing brace of the main block '};'
        if (depth === 1 && line.trim().startsWith('}')) {
          output.push(...entryBuffer);
          output.push(line);
          entryBuffer = [];
          depth += netChange; // Should go to 0
        } else {
          // It's a comment or empty line, buffer it.
          entryBuffer.push(line);
          // Note: We don't change depth here usually, assuming comments don't have braces
          depth += netChange;
        }
      }
    } else {
      // 4. OUTSIDE OF BLOCKS
      output.push(line);
    }
  }

  return output.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: bun run transform.ts <openapi-file.json|yaml|yml>');
    console.error('\nExample:');
    console.error('  bun run transform.ts petstore.json');
    console.error('  bun run transform.ts petstore.yaml');
    console.error('  bun run transform.ts petstore.yml');
    process.exit(1);
  }

  const inputFile = resolve(args[0]);

  // Check file extension
  const ext = inputFile.split('.').pop()?.toLowerCase();
  if (!ext || !['json', 'yaml', 'yml'].includes(ext)) {
    console.error('❌ Error: Only JSON, YAML, and YML files are supported');
    process.exit(1);
  }

  const outputFile = inputFile.replace(/\.(json|yaml|yml)$/, '.apiconf.ts');

  try {
    const specContent = readFileSync(inputFile, 'utf-8');
    const spec = await parseSpec(specContent, inputFile);

    console.log(`📖 Reading: ${spec.info.title} v${spec.info.version}`);
    console.log(`📝 Transforming OpenAPI spec...`);

    const transformed = removeRepeat(transformOpenAPISpec(spec));

    writeFileSync(outputFile, transformed);
    console.log(`✅ Success! Generated: ${outputFile}`);

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
