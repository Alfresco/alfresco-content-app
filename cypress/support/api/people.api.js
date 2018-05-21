import { createEndpointUri } from '../utils/endpoint';
import {
    ADMIN_USERNAME,
    ADMIN_PASSWORD
} from '../../app.config';

function User(username, password, config = {}) {
    return  {
        id: username,
        username: username,
        password: password || username,
        firstName: config.firstName || username,
        lastName: config.lastName || username,
        email: `${username}@alfresco.com`,
        properties: {}
    };
}

const People = {};

People.createUser = (username, password, details = {}) => {
    const endpoint = createEndpointUri('people');
    const user = User(username, password, details);

    cy.request({
        method: 'POST',
        headers: {
            "Authorization" : "Basic " + new Buffer(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString("base64"),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: endpoint,
        body: {
            id: username,
            password: password || username,
            firstName: details.firstName || username,
            lastName: details.lastName || username,
            email: `${username}@alfresco.com`,
            properties: {}
        }
    });
 };

 People.disableUser = (username) => {
    const endpoint = createEndpointUri(`people/${username}`);

    cy.request({
        method: 'PUT',
        headers: {
            "Authorization" : "Basic " + new Buffer(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString("base64"),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: endpoint,
        body: {
            enabled: false
        }
    });
 };

 People.changePassword = (username, password) => {
    const endpoint = createEndpointUri(`people/${username}`);

    cy.request({
        method: 'PUT',
        headers: {
            "Authorization" : "Basic " + new Buffer(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString("base64"),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: endpoint,
        body: {
            password
        }
    });
 };

 export default People;