const axios = require("axios");
const { validateTargetUrl } = require("../utils/urlValidator");

async function checkHttps(targetUrl) {
    const parsedUrl = new URL(targetUrl);

    const hostname = parsedUrl.hostname;

    const httpUrl = `http://${hostname}`;
    const httpsUrl = `https://${hostname}`;

    const result = {
        httpsAvailable: false,
        httpRedirectsToHttps: false,
        hstsEnabled: false,
        httpStatusCode: null,
        httpsStatusCode: null,
    };

    // Check HTTP behavior
    try {
        await validateTargetUrl(httpUrl);

        const httpResponse = await axios.get(httpUrl, {
            timeout: 5000,
            maxRedirects: 0,
            validateStatus: () => true,
        });

        result.httpStatusCode = httpResponse.status;

        if (
            httpResponse.status >= 300 &&
            httpResponse.status < 400 &&
            httpResponse.headers.location
        ) {
            const redirectUrl = new URL(
                httpResponse.headers.location,
                httpUrl
            ).toString();

            await validateTargetUrl(redirectUrl);

            result.httpRedirectsToHttps =
                new URL(redirectUrl).protocol === "https:";
        }
    } catch (error) {
        // HTTP may simply be unavailable
    }

    // Check HTTPS
    try {
        await validateTargetUrl(httpsUrl);

        const httpsResponse = await axios.get(httpsUrl, {
            timeout: 5000,
            maxRedirects: 0,
            validateStatus: () => true,
        });

        result.httpsAvailable = true;
        result.httpsStatusCode = httpsResponse.status;

        const hsts =
            httpsResponse.headers["strict-transport-security"];

        result.hstsEnabled =
            typeof hsts === "string" &&
            !hsts.toLowerCase().includes("max-age=0");
    } catch (error) {
        result.httpsAvailable = false;
    }

    return result;
}

module.exports = {
    checkHttps,
};