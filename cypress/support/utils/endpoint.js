import {
    REPO_API_HOST,
    REPO_API_TENANT,
    REPO_API_DEFINITION
} from '../../app.config';

export const createEndpointUri = (endpoint) => {
    return `${REPO_API_HOST}/alfresco/api/${REPO_API_TENANT}/public/${REPO_API_DEFINITION}/versions/1/${endpoint}`;
}