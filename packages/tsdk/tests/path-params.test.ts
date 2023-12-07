import { expect } from 'chai';
import { paramCase } from 'change-case';

import { parseParams, pathParams, parseBracesParams } from '../fe-sdk-template/src/path-params';

describe('path parms tests', () => {
  it('test parseParams', () => {
    const result = parseParams('/:a/b/:c');
    expect(result.length).to.equal(2);
    expect(result[0].name).to.equal('a');
    expect(result[0].symbol).to.equal(':a');
    expect(result[1].name).to.equal('c');
    expect(result[1].symbol).to.equal(':c');
  });

  it('test pathParams with `:` symbol', () => {
    const result = pathParams('/:a/b/:c', { a: 1, c: 2 }, ':');
    expect(result).to.equal('/1/b/2');
  });

  it('test parseBracesParams', () => {
    const result = parseBracesParams('/{a}/b/{c}');
    expect(result.length).to.equal(2);
    expect(result[0].name).to.equal('a');
    expect(result[0].symbol).to.equal('{a}');
    expect(result[1].name).to.equal('c');
    expect(result[1].symbol).to.equal('{c}');
  });

  it('test pathParams with `{}` symbol', () => {
    const result = pathParams('/{a}/b/{c}', { a: 1, c: 2 }, '{}');
    expect(result).to.equal('/1/b/2');
  });

  it('test paramCase', () => {
    const result = '/' + paramCase('TestPathParams') + '/:a/b/:c';
    expect(result).to.equal('/test-path-params/:a/b/:c');
  });
});
