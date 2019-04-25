/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import * as app from './app.rules';

describe('app.evaluators', () => {
  describe('isWriteLocked', () => {
    it('should return [true] if lock type is set', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              properties: {
                'cm:lockType': 'WRITE_LOCK'
              }
            }
          }
        }
      };

      expect(app.isWriteLocked(context)).toBe(true);
    });

    it('should return [false] if lock type is not set', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              properties: {}
            }
          }
        }
      };

      expect(app.isWriteLocked(context)).toBe(false);
    });

    it('should return [false] if selection not present', () => {
      const context: any = {};

      expect(app.isWriteLocked(context)).toBe(false);
    });
  });

  describe('hasLockedFiles', () => {
    it('should return [false] if selection not present', () => {
      const context: any = {};
      expect(app.hasLockedFiles(context)).toBe(false);
    });

    it('should return [false] if nodes not present', () => {
      const context: any = {
        selection: {
          nodes: null
        }
      };

      expect(app.hasLockedFiles(context)).toBe(false);
    });

    it('should return [false] if no files selected', () => {
      const context: any = {
        selection: {
          nodes: [
            {
              entry: {
                isFile: false
              }
            },
            {
              entry: {
                isFile: false
              }
            }
          ]
        }
      };

      expect(app.hasLockedFiles(context)).toBe(false);
    });

    it('should return [true] when one of files is locked', () => {
      const context: any = {
        selection: {
          nodes: [
            {
              entry: {
                isFile: true,
                isLocked: true
              }
            },
            {
              entry: {
                isFile: true,
                isLocked: false
              }
            }
          ]
        }
      };

      expect(app.hasLockedFiles(context)).toBe(true);
    });
  });

  it('should return [true] when one of files has readonly lock', () => {
    const context: any = {
      selection: {
        nodes: [
          {
            entry: {
              isFile: true,
              isLocked: false
            }
          },
          {
            entry: {
              isFile: true,
              isLocked: false,
              properties: {
                'cm:lockType': 'READ_ONLY_LOCK'
              }
            }
          }
        ]
      }
    };

    expect(app.hasLockedFiles(context)).toBe(true);
  });

  describe('canUpdateSelectedNode', () => {
    it('should return [false] if selection not preset', () => {
      const context: any = {};

      expect(app.canUpdateSelectedNode(context)).toBe(false);
    });

    it('should return [false] if selection is empty', () => {
      const context: any = {
        selection: {
          isEmpty: true
        }
      };

      expect(app.canUpdateSelectedNode(context)).toBe(false);
    });

    it('should return [false] if first selection is not a file', () => {
      const context: any = {
        permissions: {
          check: () => false
        },
        selection: {
          isEmpty: false,
          first: {
            entry: {
              isFile: false
            }
          }
        }
      };

      expect(app.canUpdateSelectedNode(context)).toBe(false);
    });

    it('should return [false] if the file is locked', () => {
      const context: any = {
        permissions: {
          check: () => true
        },
        selection: {
          isEmpty: false,
          nodes: [
            {
              entry: {
                isFile: true,
                isLocked: true
              }
            }
          ],
          first: {
            entry: {
              isFile: true,
              isLocked: true
            }
          }
        }
      };

      expect(app.canUpdateSelectedNode(context)).toBe(false);
    });

    it('should evaluate allowable operation for the file', () => {
      const context: any = {
        permissions: {
          check: () => true
        },
        selection: {
          isEmpty: false,
          nodes: [
            {
              entry: {
                isFile: true,
                allowableOperationsOnTarget: []
              }
            }
          ],
          first: {
            entry: {
              isFile: true,
              allowableOperationsOnTarget: []
            }
          }
        }
      };

      expect(app.canUpdateSelectedNode(context)).toBe(true);
    });
  });

  describe('canUploadVersion', () => {
    it('should return [true] if user has locked it previously', () => {
      const context: any = {
        navigation: {
          url: '/personal-files'
        },
        profile: {
          id: 'user1'
        },
        selection: {
          file: {
            entry: {
              properties: {
                'cm:lockType': 'WRITE_LOCK',
                'cm:lockOwner': {
                  id: 'user1'
                }
              }
            }
          }
        }
      };

      expect(app.canUploadVersion(context)).toBe(true);
    });

    it('should return [false] if other user has locked it previously', () => {
      const context: any = {
        navigation: {
          url: '/personal-files'
        },
        profile: {
          id: 'user2'
        },
        selection: {
          file: {
            entry: {
              properties: {
                'cm:lockType': 'WRITE_LOCK',
                'cm:lockOwner': {
                  id: 'user1'
                }
              }
            }
          }
        }
      };

      expect(app.canUploadVersion(context)).toBe(false);
    });

    it('should check the [update] operation when no write lock present', () => {
      let checked = false;
      const context: any = {
        navigation: {
          url: '/personal-files'
        },
        permissions: {
          check: () => (checked = true)
        },
        selection: {
          file: {},
          isEmpty: false,
          nodes: [
            {
              entry: {
                isFile: true
              }
            }
          ],
          first: {
            entry: {
              isFile: true
            }
          }
        }
      };

      expect(app.canUploadVersion(context)).toBe(true);
      expect(checked).toBe(true);
    });

    it('should return [true] if route is `/favorites`', () => {
      const context: any = {
        selection: {
          file: {}
        },
        navigation: {
          url: '/favorites'
        }
      };

      expect(app.canUploadVersion(context)).toBe(true);
    });

    it('should return [true] if route is `/favorites`', () => {
      const context: any = {
        selection: {
          file: {}
        },
        navigation: {
          url: '/favorites'
        }
      };

      expect(app.canUploadVersion(context)).toBe(true);
    });

    it('should return [true] if route is `/shared`', () => {
      const context: any = {
        selection: {
          file: {}
        },
        navigation: {
          url: '/shared'
        }
      };

      expect(app.canUploadVersion(context)).toBe(true);
    });
  });
});
