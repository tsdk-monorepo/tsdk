import { describe, it, expect } from 'vitest';
import {
  hasBodyMethods,
  checkMethodHasBody,
  transformPath,
  paramCase,
  isObject,
  ProtocolTypes,
} from '../fe-sdk-template/src/shared/tsdk-helper'; // Replace with actual path to the module

describe('hasBodyMethods', () => {
  it('should include POST, PUT, and PATCH as true', () => {
    expect(hasBodyMethods['post']).toBe(true);
    expect(hasBodyMethods['put']).toBe(true);
    expect(hasBodyMethods['patch']).toBe(true);
  });

  it('should return undefined for non-body methods', () => {
    expect(hasBodyMethods['get']).toBeUndefined();
    expect(hasBodyMethods['delete']).toBeUndefined();
    expect(hasBodyMethods['head']).toBeUndefined();
  });
});

describe('checkMethodHasBody', () => {
  it('should return true for methods that have a body', () => {
    expect(checkMethodHasBody('POST')).toBe(true);
    expect(checkMethodHasBody('post')).toBe(true);
    expect(checkMethodHasBody('PUT')).toBe(true);
    expect(checkMethodHasBody('put')).toBe(true);
    expect(checkMethodHasBody('PATCH')).toBe(true);
    expect(checkMethodHasBody('patch')).toBe(true);
  });

  it('should return undefined for methods that do not have a body', () => {
    expect(checkMethodHasBody('GET')).toBeUndefined();
    expect(checkMethodHasBody('get')).toBeUndefined();
    expect(checkMethodHasBody('DELETE')).toBeUndefined();
    expect(checkMethodHasBody('delete')).toBeUndefined();
  });

  it('should handle case insensitivity', () => {
    expect(checkMethodHasBody('PoSt')).toBe(true);
    expect(checkMethodHasBody('pUT')).toBe(true);
  });
});

describe('paramCase', () => {
  it('should convert camelCase to param-case', () => {
    expect(paramCase('camelCaseText')).toBe('camel-case-text');
    expect(paramCase('thisIsATest')).toBe('this-is-a-test');
  });

  it('should convert PascalCase to param-case', () => {
    expect(paramCase('PascalCaseText')).toBe('pascal-case-text');
    expect(paramCase('ThisIsATest')).toBe('this-is-a-test');
  });

  it('should replace spaces with hyphens', () => {
    expect(paramCase('this is a test')).toBe('this-is-a-test');
    expect(paramCase('multiple   spaces  here')).toBe('multiple-spaces-here');
  });

  it('should handle mixed cases and spaces', () => {
    expect(paramCase('this Is mixedCase with Spaces')).toBe('this-is-mixed-case-with-spaces');
  });

  it('should convert everything to lowercase', () => {
    expect(paramCase('ALL UPPERCASE')).toBe('all-uppercase');
    expect(paramCase('MixedCASE')).toBe('mixed-case');
  });
});

describe('transformPath', () => {
  it('should transform camelCase paths to param-case with leading slash', () => {
    expect(transformPath('userProfile')).toBe('/user-profile');
    expect(transformPath('apiEndpoint')).toBe('/api-endpoint');
  });

  it('should transform PascalCase paths to param-case with leading slash', () => {
    expect(transformPath('UserProfile')).toBe('/user-profile');
    expect(transformPath('APIEndpoint')).toBe('/api-endpoint');
  });

  it('should transform paths with spaces to param-case with leading slash', () => {
    expect(transformPath('user profile')).toBe('/user-profile');
  });

  it('should add leading slash to already param-case paths', () => {
    expect(transformPath('user-profile')).toBe('/user-profile');
  });
});

describe('isObject', () => {
  it('should return true for non-empty objects', () => {
    expect(isObject({ key: 'value' })).toBe(true);
    expect(isObject({ a: 1, b: 2 })).toBe(true);
  });

  it('should return false for arrays', () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('should return false for FormData', () => {
    const formData = new FormData();
    expect(isObject(formData)).toBe(false);
  });

  it('should return false for empty objects', () => {
    expect(isObject({})).toBe(false);
  });

  it('should return false for primitives', () => {
    expect(isObject('string')).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });
});

describe('ProtocolTypes', () => {
  it('should contain the correct protocol type values', () => {
    expect(ProtocolTypes.request).toBe('REQ:');
    expect(ProtocolTypes.response).toBe('RES:');
    expect(ProtocolTypes.set).toBe('SET:');
  });

  it('should be an object with three properties', () => {
    expect(Object.keys(ProtocolTypes).length).toBe(3);
    expect(ProtocolTypes).toHaveProperty('request');
    expect(ProtocolTypes).toHaveProperty('response');
    expect(ProtocolTypes).toHaveProperty('set');
  });
});
