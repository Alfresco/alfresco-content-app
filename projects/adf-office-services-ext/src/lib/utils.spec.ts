import { getFileExtension } from './utils';

describe('utils', () => {
  it('should return no extension when input is null', () => {
    expect(getFileExtension(null)).toBe(null);
  });

  it('should extract file extension', () => {
    expect(getFileExtension('test.docx')).toBe('docx');
  });

  it('should not extract file extension', () => {
    expect(getFileExtension('unknown')).toBe(null);
  });
});
