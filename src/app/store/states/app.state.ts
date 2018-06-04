import { MinimalNodeEntity } from 'alfresco-js-api';

export interface AppState {
    appName: string;
    headerColor: string;
    logoPath: string;
    selectedNodes: MinimalNodeEntity[];
}

export const INITIAL_APP_STATE: AppState = {
    appName: 'Alfresco Example Content Application',
    headerColor: '#2196F3',
    logoPath: 'assets/images/alfresco-logo-white.svg',
    selectedNodes: []
};

export interface AcaState {
    app: AppState;
}

export const INITIAL_STATE: AcaState = {
    app: INITIAL_APP_STATE
};
