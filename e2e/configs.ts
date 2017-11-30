export const BROWSER_RESOLUTION_WIDTH = 1200;
export const BROWSER_RESOLUTION_HEIGHT = 800;

export const BROWSER_WAIT_TIMEOUT = 20000;

// Application configs
export const APP_HOST = 'http://localhost:3000';

// Repository configs
export const REPO_API_HOST = 'http://localhost:8080';
export const REPO_API_TENANT = '-default-';

// Admin details
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'admin';
export const ADMIN_FULL_NAME = 'Administrator';

// Application Routes
export const APP_ROUTES = {
    FAVORITES: '/favorites',
    FILE_LIBRARIES: '/libraries',
    LOGIN: '/login',
    LOGOUT: '/logout',
    PERSONAL_FILES: '/personal-files',
    RECENT_FILES: '/recent-files',
    SHARED_FILES: '/shared',
    TRASHCAN: '/trashcan'
};

// Sidebar labels
export const SIDEBAR_LABELS = {
    PERSONAL_FILES: 'Personal Files',
    FILE_LIBRARIES: 'File Libraries',
    SHARED_FILES: 'Shared',
    RECENT_FILES: 'Recent Files',
    FAVORITES: 'Favorites',
    TRASH: 'Trash'
};

// Site visibility
export const SITE_VISIBILITY = {
    PUBLIC: 'PUBLIC',
    MODERATED: 'MODERATED',
    PRIVATE: 'PRIVATE'
};

// Site roles
export const SITE_ROLES = {
    SITE_CONSUMER: 'SiteConsumer',
    SITE_COLLABORATOR: 'SiteCollaborator',
    SITE_CONTRIBUTOR: 'SiteContributor',
    SITE_MANAGER: 'SiteManager'
};
