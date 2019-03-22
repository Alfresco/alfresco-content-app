import { canOpenWithOffice } from './evaluators';

describe('evaluators', () => {
  describe('canOpenWithOffice', () => {
    it('should return [false] if using SSO', () => {
      const context: any = {
        auth: {
          isOauth() {
            return true;
          }
        }
      };

      expect(canOpenWithOffice(context, null)).toBeFalsy();
    });

    it('should return [false] if no selection present', () => {
      const context: any = {
        selection: null
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if no file selected', () => {
      const context: any = {
        selection: {
          file: null
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has no entry', () => {
      const context: any = {
        selection: {
          file: {
            entry: null
          }
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has no properties', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              properties: null
            }
          }
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file is locked', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              isLocked: true,
              properties: {}
            }
          }
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has no extension', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              name: 'readme',
              isLocked: false,
              properties: {}
            }
          }
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if extension is not supported', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              name: 'run.exe',
              isLocked: false,
              properties: {}
            }
          }
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has write lock', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              name: 'document.docx',
              isLocked: false,
              properties: {
                'cm:lockType': 'WRITE_LOCK'
              }
            }
          }
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has read-only lock', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              name: 'document.docx',
              isLocked: false,
              properties: {
                'cm:lockType': 'READ_ONLY_LOCK'
              }
            }
          }
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if current user is not lock owner', () => {
      const context: any = {
        profile: {
          id: 'user1'
        },
        selection: {
          file: {
            entry: {
              name: 'document.docx',
              isLocked: false,
              properties: {
                'cm:lockType': 'READ_ONLY_LOCK',
                'cm:lockOwner': {
                  id: 'user2'
                }
              }
            }
          }
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if current user is lock owner', () => {
      const context: any = {
        profile: {
          id: 'user1'
        },
        selection: {
          file: {
            entry: {
              name: 'document.docx',
              isLocked: false,
              properties: {
                'cm:lockType': 'READ_ONLY_LOCK',
                'cm:lockOwner': {
                  id: 'user1'
                }
              }
            }
          }
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if permissions check is false', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              name: 'document.docx',
              isLocked: false,
              properties: {}
            }
          }
        },
        permissions: {
          check: () => false
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [true] if all checks succeed', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              name: 'document.docx',
              isLocked: false,
              properties: {}
            }
          }
        },
        permissions: {
          check: () => true
        }
      };

      expect(canOpenWithOffice(context)).toBeTruthy();
    });
  });
});
