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

import * as app from './app.rules';
import { TestRuleContext } from './test-rule-context';
import { NodeEntry } from '@alfresco/js-api';

describe('app.evaluators', () => {
  describe('canDownloadSelection', () => {
    it('should return [false] if selection is empty', () => {
      const context = new TestRuleContext();

      expect(context.selection.isEmpty).toBe(true);
      expect(app.canDownloadSelection(context)).toBe(false);
    });

    it('should return [false] for the trashcan entries', () => {
      const context = new TestRuleContext();
      context.selection.isEmpty = false;
      context.navigation = { url: '/trashcan' };

      expect(app.canDownloadSelection(context)).toBe(false);
    });

    it('should allow downloading files', () => {
      const context = new TestRuleContext();
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: { isFile: true } } as NodeEntry];

      expect(app.canDownloadSelection(context)).toBe(true);
    });

    it('should allow downloading folders', () => {
      const context = new TestRuleContext();
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: { isFolder: true } } as NodeEntry];

      expect(app.canDownloadSelection(context)).toBe(true);
    });

    it('should now allow downloading unknown selection', () => {
      const context = new TestRuleContext();
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: {} } as NodeEntry];

      expect(app.canDownloadSelection(context)).toBe(false);
    });
  });

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

  describe('isShared', () => {
    it('should return true if route is shared files and single selection', () => {
      const context: any = {
        selection: {
          file: {}
        },
        navigation: {
          url: '/shared'
        }
      };

      expect(app.isShared(context)).toBe(true);
    });

    it('should return false if route is shared files and multiple selection', () => {
      const context: any = {
        selection: {
          file: null
        },
        navigation: {
          url: '/shared'
        }
      };

      expect(app.isShared(context)).toBe(false);
    });

    it('should return false if route is trashcan route', () => {
      const context: any = {
        selection: {
          file: {}
        },
        navigation: {
          url: '/trashcan'
        }
      };

      expect(app.isShared(context)).toBe(false);
    });

    it('should return false if selection is not shared', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              properties: {}
            }
          }
        },
        navigation: {
          url: '/other'
        }
      };

      expect(app.isShared(context)).toBe(false);
    });

    it('should return true if selection is shared', () => {
      const context: any = {
        selection: {
          file: {
            entry: {
              properties: {
                'qshare:sharedId': 'some-id'
              }
            }
          }
        },
        navigation: {
          url: '/other'
        }
      };

      expect(app.isShared(context)).toBe(true);
    });
  });

  describe('canShowLogout', () => {
    it('should return false when `withCredentials` property is true', () => {
      const context: any = {
        withCredentials: true
      };

      expect(app.canShowLogout(context)).toBe(false);
    });

    it('should return true when `withCredentials` property is false', () => {
      const context: any = {
        withCredentials: false
      };

      expect(app.canShowLogout(context)).toBe(true);
    });
  });

  describe('isLibraryManager', () => {
    it('should return true when role is SiteManager', () => {
      const context: any = {
        selection: {
          library: {
            entry: {
              role: 'SiteManager'
            }
          }
        }
      };

      expect(app.isLibraryManager(context)).toBe(true);
    });

    it('should return false when role is different than SiteManager', () => {
      const context: any = {
        selection: {
          library: {
            entry: {
              role: 'SiteCollaborator'
            }
          }
        }
      };

      expect(app.isLibraryManager(context)).toBe(false);
    });
  });
});
