function generateHttpsFindings(httpsResult) {
    const findings = [];

    if (!httpsResult.httpsAvailable) {
        findings.push({
            name: "HTTPS Not Available",
            severity: "High",
            description:
                "The target does not appear to provide HTTPS connectivity.",
            recommendation:
                "Configure the website to use HTTPS with a valid TLS certificate.",
        });

        return findings;
    }

    if (!httpsResult.httpRedirectsToHttps) {
        findings.push({
            name: "HTTP Does Not Redirect to HTTPS",
            severity: "Medium",
            description:
                "The website does not appear to automatically redirect HTTP requests to HTTPS.",
            recommendation:
                "Configure HTTP requests to redirect to the equivalent HTTPS URL.",
        });
    }

    return findings;
}

function generateHeaderFindings(headerResults) {
    const findings = [];

    if (!headerResults.contentSecurityPolicy.present) {
        findings.push({
            name: "Content-Security-Policy Missing",
            severity: "Medium",
            category: "Security Headers",
            description:
                "The website does not provide a Content-Security-Policy header.",
            recommendation:
                "Implement a Content-Security-Policy appropriate for the application's required resources.",
        });
    }

    if (!headerResults.strictTransportSecurity.present) {
        findings.push({
            name: "HSTS Header Missing",
            severity: "Medium",
            category: "Transport Security",
            description:
                "The website does not provide a Strict-Transport-Security header.",
            recommendation:
                "Enable HSTS after confirming that the website operates correctly over HTTPS.",
        });
    }

    if (!headerResults.xFrameOptions.present) {
        findings.push({
            name: "X-Frame-Options Missing",
            severity: "Low",
            category: "Security Headers",
            description:
                "The website does not provide an X-Frame-Options header.",
            recommendation:
                "Use X-Frame-Options or an appropriate CSP frame-ancestors directive to control framing.",
        });
    }

    if (!headerResults.xContentTypeOptions.present) {
        findings.push({
            name: "X-Content-Type-Options Missing",
            severity: "Low",
            category: "Security Headers",
            description:
                "The website does not provide an X-Content-Type-Options header.",
            recommendation:
                "Set X-Content-Type-Options to nosniff.",
        });
    }

    if (!headerResults.referrerPolicy.present) {
        findings.push({
            name: "Referrer-Policy Missing",
            severity: "Low",
            category: "Privacy",
            description:
                "The website does not explicitly define a Referrer-Policy.",
            recommendation:
                "Configure an appropriate Referrer-Policy such as strict-origin-when-cross-origin.",
        });
    }

    if (!headerResults.permissionsPolicy.present) {
        findings.push({
            name: "Permissions-Policy Missing",
            severity: "Low",
            category: "Security Headers",
            description:
                "The website does not provide a Permissions-Policy header.",
            recommendation:
                "Define a Permissions-Policy restricting unnecessary browser capabilities.",
        });
    }

    return findings;
}

module.exports = {
    generateHttpsFindings,
    generateHeaderFindings,
};