import { describe, it, expect, beforeEach } from 'vitest';
import { getID, resetID } from '../fe-sdk-template/src/utils'; // Update this path as needed

describe('getID', () => {
  // Reset the module before each test to ensure ID counter is reset
  beforeEach(() => {
    // Note: In a real implementation, you might need to use
    // module mocking to reset the ID counter between tests
    // This is a limitation of the current implementation with a module-level ID variable
    resetID();
  });

  it('should generate a unique ID for valid HTTP methods', () => {
    const validMethods = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];
    const path = '/api/users';

    for (const method of validMethods) {
      const id = getID(method, path);

      // Check that ID follows the expected format: {methodIdx}:{path}:{incrementalID}{randomSuffix}
      const expectedMethodIdx = validMethods.indexOf(method);
      expect(id).toMatch(new RegExp(`^${expectedMethodIdx}:${path}:\\d+[a-z0-9]{8}$`));
    }
  });

  it('should accept uppercase HTTP methods', () => {
    const method = 'GET';
    const path = '/api/users';

    const id = getID(method, path);

    // The method index for 'get' is 0
    expect(id).toMatch(new RegExp(`^0:${path}:\\d+[a-z0-9]{8}$`));
  });

  it('should generate different IDs for the same method and path', () => {
    const method = 'get';
    const path = '/api/users';

    const id1 = getID(method, path);
    const id2 = getID(method, path);

    expect(id1).not.toEqual(id2);
  });

  it('should generate different IDs for different paths', () => {
    const method = 'get';
    const path1 = '/api/users';
    const path2 = '/api/posts';

    const id1 = getID(method, path1);
    const id2 = getID(method, path2);

    expect(id1).not.toEqual(id2);
    expect(id1).toMatch(new RegExp(`^0:${path1}:`));
    expect(id2).toMatch(new RegExp(`^0:${path2}:`));
  });

  it('should generate different IDs for different methods', () => {
    const method1 = 'get';
    const method2 = 'post';
    const path = '/api/users';

    const id1 = getID(method1, path);
    const id2 = getID(method2, path);

    expect(id1).not.toEqual(id2);
    expect(id1).toMatch(/^0:/);
    expect(id2).toMatch(/^1:/);
  });

  it('should throw an error for invalid HTTP methods', () => {
    const invalidMethod = 'invalid';
    const path = '/api/users';

    expect(() => getID(invalidMethod, path)).toThrow(
      `Invalid method: ${invalidMethod}. Valid methods are: get, post, delete, put, patch, head, options`
    );
  });

  it('should increment the ID counter for each call', () => {
    const method = 'get';
    const path = '/api/users';

    // Extract the incremental ID part from two consecutive calls
    const id1 = getID(method, path);
    const id2 = getID(method, path);

    const match1 = id1.match(/^0:\/api\/users:(\d+)/);
    const match2 = id2.match(/^0:\/api\/users:(\d+)/);

    expect(match1).not.toBeNull();
    expect(match2).not.toBeNull();

    if (match1 && match2) {
      const incrementalId1 = parseInt(match1[1][0], 10);
      const incrementalId2 = parseInt(match2[1][0], 10);
      expect(incrementalId2).toEqual(incrementalId1 + 1);
    }
  });

  it('should include random suffix in the generated ID', () => {
    const method = 'get';
    const path = '/api/users';

    const id = getID(method, path);

    // Check that the ID ends with 8 alphanumeric characters
    expect(id).toMatch(/[a-z0-9]{8}$/);
  });
});
