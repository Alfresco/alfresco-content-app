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

describe('evaluators', () => {
  describe('canOpenWithOffice', () => {
    it('should return [false] if using SSO', () => {
      const context: any = {
        auth: {
          isOauth: () => true
        }
      };

      expect(canOpenWithOffice(context)).toBeFalsy();
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

    it('should return [false] if selected file is a record with containing aspect rma:declaredRecord', () => {
      const context: any = {
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
          check: () => true
        }
      };
      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file is a record with containing aspect rma:record', () => {
      const context: any = {
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
          check: () => true
        }
      };
      expect(canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file is a record 1', () => {
      const context: any = {
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
