module.exports = {
    "host": "0.0.0.0",
    "port": 3000,
    "dir": "./dist",
    "spa": true,
    "proxy": {
        "/alfresco/{p*}": {
            "options": {
                "uri": "http://0.0.0.0:8080/alfresco/{p}"
            }
        }
    },
    onResHeaders(headers) {
        if (headers) {
            const authHeader = headers['www-authenticate'];
            if (authHeader) {
                headers['www-authenticate'] = `x${authHeader}`;
            }
        }
    }
}
