const axios = require("axios");
const { validateTargetUrl } = require("../utils/urlValidator");

async function checkReachability(url) {
    const startTime = Date.now();

    try {
        let currentUrl = url;
        const redirectChain = [];

        for (let i = 0; i <= 5; i++) {
            const validatedUrl = await validateTargetUrl(currentUrl);

            const response = await axios.get(validatedUrl, {
                timeout: 5000,
                maxRedirects: 0,
                validateStatus: () => true,
            });

            const isRedirect =
                response.status >= 300 &&
                response.status < 400 &&
                response.headers.location;

            if (!isRedirect) {
                return {
                    reachable: true,
                    statusCode: response.status,
                    statusText: response.statusText,
                    responseTime: Date.now() - startTime,
                    finalUrl: validatedUrl,
                    redirectChain,
                };
            }

            const nextUrl = new URL(
                response.headers.location,
                validatedUrl
            ).toString();

            redirectChain.push({
                from: validatedUrl,
                to: nextUrl,
                statusCode: response.status,
            });

            currentUrl = nextUrl;
        }

        return {
            reachable: false,
            statusCode: null,
            statusText: null,
            responseTime: Date.now() - startTime,
            finalUrl: null,
            redirectChain,
            error: "Too many redirects",
        };
    } catch (error) {
        return {
            reachable: false,
            statusCode: null,
            statusText: null,
            responseTime: Date.now() - startTime,
            finalUrl: null,
            redirectChain: [],
            error: error.message,
        };
    }
}

module.exports = {
    checkReachability,
};