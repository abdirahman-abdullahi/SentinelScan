const dns = require("dns").promises;
const ipaddr = require("ipaddr.js");

function isUnsafeIp(ip) {
    try {
        const address = ipaddr.parse(ip);
        const range = address.range();

        const blockedRanges = [
            "private",
            "loopback",
            "linkLocal",
            "uniqueLocal",
            "unspecified",
            "multicast",
            "broadcast",
            "carrierGradeNat",
        ];

        return blockedRanges.includes(range);
    } catch {
        return true;
    }
}

async function validateTargetUrl(inputUrl) {
    let parsedUrl;

    try {
        parsedUrl = new URL(inputUrl);
    } catch {
        throw new Error("Invalid URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only HTTP and HTTPS URLs are allowed");
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    if (
        hostname === "localhost" ||
        hostname.endsWith(".localhost")
    ) {
        throw new Error("Localhost addresses are not allowed");
    }

    let addresses;

    try {
        addresses = await dns.lookup(hostname, {
            all: true,
        });
    } catch {
        throw new Error("Unable to resolve hostname");
    }

    if (!addresses.length) {
        throw new Error("Hostname did not resolve to an IP address");
    }

    for (const result of addresses) {
        if (isUnsafeIp(result.address)) {
            throw new Error(
                "Target resolves to a private or restricted network address"
            );
        }
    }

    return parsedUrl.toString();
}

module.exports = {
    validateTargetUrl,
};