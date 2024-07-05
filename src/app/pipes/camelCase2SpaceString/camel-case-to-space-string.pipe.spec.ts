import { CamelCaseToSpaceStringPipe } from './camel-case-to-space-string.pipe';

describe('CamelCaseToSpaceStringPipe', () => {
  it('create an instance', () => {
    const pipe = new CamelCaseToSpaceStringPipe();
    expect(pipe).toBeTruthy();
  });
});
