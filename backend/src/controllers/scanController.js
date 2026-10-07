const {
    checkReachability,
} = require("../scanners/reachabilityScanner");

const { 
    saveScan,
    getAllScans,
    getScanById
} = require("../services/scanService");

const {
    checkHttps,
} = require("../scanners/httpsScanner");

const {
    validateTargetUrl,
} = require("../utils/urlValidator");

const {
    generateHttpsFindings,
    generateHeaderFindings,
} = require("../services/findingService");

const {
    scanSecurityHeaders,
} = require("../scanners/headerScanner");

const {
    calculateSecurityScore,
} = require("../services/scoreService");

async function scanWebsite(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            error: "URL is required",
        });
    }

    try {
        const validatedUrl =
            await validateTargetUrl(url);

        const reachability =
            await checkReachability(validatedUrl);

        if (!reachability.reachable) {
            return res.status(400).json({
                target: validatedUrl,
                error: "Target could not be reached",
                reachability,
            });
        }

        const https =
            await checkHttps(validatedUrl);

        const headers =
            await scanSecurityHeaders(
                reachability.finalUrl || validatedUrl
            );

        const findings = [
            ...generateHttpsFindings(https),
            ...generateHeaderFindings(headers),
        ];

        const securityAssessment=
            calculateSecurityScore(findings);
        
        const savedScan = await saveScan({
            target: validatedUrl,
            assessment: securityAssessment,
            reachability,
            findings,
        });

        res.json({
            scanId: savedScan.id,
            target: validatedUrl,
            assessment: securityAssessment,

            scan: {
                reachability,
                https,
                headers,
            },

            findings,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
}

async function getScanHistory(req, res) {
    try {
        const scans = await getAllScans();

        res.json({
            total: scans.length,
            scans,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve scan history",
        });
    }
}

async function getSingleScan(req, res) {
    try {
        const { id } = req.params;

        const scanId = Number(id);

        if (!Number.isInteger(scanId) || scanId <= 0) {
            return res.status(400).json({
                error: "Invalid scan ID",
            });
        }

        const scan = await getScanById(scanId);

        if (!scan) {
            return res.status(404).json({
                error: "Scan not found",
            });
        }

        res.json(scan);
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve scan",
        });
    }
}

module.exports = {
    scanWebsite,
    getScanHistory,
    getSingleScan,
};