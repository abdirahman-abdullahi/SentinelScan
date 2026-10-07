const axios = require("axios");
const { validateTargetUrl } = require("../utils/urlValidator");

async function scanSecurityHeaders(url) {
    const validatedUrl = await validateTargetUrl(url);

    const response = await axios.get(validatedUrl, {
        timeout: 5000,
        maxRedirects: 0,
        validateStatus: () => true,
    });

    const headers = response.headers;

    return {
        contentSecurityPolicy: {
            present: Boolean(headers["content-security-policy"]),
            value: headers["content-security-policy"] || null,
        },

        strictTransportSecurity: {
            present: Boolean(headers["strict-transport-security"]),
            value: headers["strict-transport-security"] || null,
        },

        xFrameOptions: {
            present: Boolean(headers["x-frame-options"]),
            value: headers["x-frame-options"] || null,
        },

        xContentTypeOptions: {
            present: Boolean(headers["x-content-type-options"]),
            value: headers["x-content-type-options"] || null,
        },

        referrerPolicy: {
            present: Boolean(headers["referrer-policy"]),
            value: headers["referrer-policy"] || null,
        },

        permissionsPolicy: {
            present: Boolean(headers["permissions-policy"]),
            value: headers["permissions-policy"] || null,
        },
    };
}

module.exports = {
    scanSecurityHeaders,
};