const severityWeights = {
    Critical: 25,
    High: 15,
    Medium: 8,
    Low: 3,
};

function calculateSecurityScore(findings) {
    let score = 100;

    const severityCounts = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
    };

    for (const finding of findings) {
        const severity = finding.severity;

        if (severityWeights[severity]) {
            score -= severityWeights[severity];
            severityCounts[severity]++;
        }
    }

    score = Math.max(score, 0);

    return {
        score,
        riskLevel: determineRiskLevel(score),
        severityCounts,
        totalFindings: findings.length,
    };
}

function determineRiskLevel(score) {
    if (score >= 90) {
        return "Low";
    }

    if (score >= 70) {
        return "Medium";
    }

    if (score >= 40) {
        return "High";
    }

    return "Critical";
}

module.exports = {
    calculateSecurityScore,
};