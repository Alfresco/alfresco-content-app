import { ExtensionRoute } from '../types';

export const mockRoutesWithoutParentRoute: Array<ExtensionRoute> = [
  {
    path: 'extension-path',
    component: null,
    canActivate: ['fake-guard'],
    canActivateChild: ['fake-guard']
  }
];

export const mockRoutesWithParentRoute: Array<ExtensionRoute> = [
  {
    ...mockRoutesWithoutParentRoute[0],
    parentRoute: 'fake-path'
  }
];
