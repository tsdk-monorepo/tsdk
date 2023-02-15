import { expect } from 'chai';

before(() => {
  console.log('before test');
});

after(() => {
  console.log('after test');
});

describe('tests', () => {
  it('test sum', () => {
    expect(1 + 1).to.equal(2);
  });
});
