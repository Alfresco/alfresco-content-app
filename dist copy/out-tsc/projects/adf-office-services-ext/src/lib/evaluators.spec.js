/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
import { canOpenWithOffice } from './evaluators';
describe('evaluators', function() {
  describe('canOpenWithOffice', function() {
    it('should return [false] if using SSO', function() {
      var context = {
        auth: {
          isOauth: function() {
            return true;
          }
        }
      };
      expect(canOpenWithOffice(context, null)).toBeFalsy();
    });
    it('should return [false] if no selection present', function() {
      var context = {
        selection: null
      };
      expect(canOpenWithOffice(context)).toBeFalsy();
    });
    it('should return [false] if no file selected', function() {
      var context = {
        selection: {
          file: null
        }
      };
      expect(canOpenWithOffice(context)).toBeFalsy();
    });
    it('should return [false] if selected file has no entry', function() {
      var context = {
        selection: {
          file: {
            entry: null
          }
        }
      };
      expect(canOpenWithOffice(context)).toBeFalsy();
    });
    it('should return [false] if selected file has no properties', function() {
      var context = {
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
    it('should return [false] if selected file is a record with containing aspect rma:declaredRecord', function() {
      var context = {
        selection: {
          file: {
            entry: {
              name: 'document.docx',
              isLocked: false,
              properties: {},
              aspectNames: ['rma:declaredRecord']
            }
          }
        },
        permissions: {
          check: function() {
            return true;
          }
        }
      };
      expect(canOpenWithOffice(context)).toBeFalsy();
    });
    it('should return [false] if selected file is a record with containing aspect rma:record', function() {
      var context = {
        selection: {
          file: {
            entry: {
              name: 'document.docx',
              isLocked: false,
              properties: {},
              aspectNames: ['rma:record']
            }
          }
        },
        permissions: {
          check: function() {
            return true;
          }
        }
      };
      expect(canOpenWithOffice(context)).toBeFalsy();
    });
    it('should return [false] if selected file is a record 1', function() {
      var context = {
        selection: {
          file: {
            entry: {
              aspectName: ['rma:declaredRecord']
            }
          }
        }
      };
      expect(canOpenWithOffice(context)).toBeFalsy();
    });
    it('should return [false] if selected file is locked', function() {
      var context = {
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
    it('should return [false] if selected file has no extension', function() {
      var context = {
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
    it('should return [false] if extension is not supported', function() {
      var context = {
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
    it('should return [false] if selected file has write lock', function() {
      var context = {
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
    it('should return [false] if selected file has read-only lock', function() {
      var context = {
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
    it('should return [false] if current user is not lock owner', function() {
      var context = {
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
    it('should return [false] if current user is lock owner', function() {
      var context = {
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
    it('should return [false] if permissions check is false', function() {
      var context = {
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
          check: function() {
            return false;
          }
        }
      };
      expect(canOpenWithOffice(context)).toBeFalsy();
    });
    it('should return [true] if all checks succeed', function() {
      var context = {
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
          check: function() {
            return true;
          }
        }
      };
      expect(canOpenWithOffice(context)).toBeTruthy();
    });
  });
});
//# sourceMappingURL=evaluators.spec.js.map
