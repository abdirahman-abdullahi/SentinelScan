const pool = require("../config/db");

async function saveScan({
    target,
    assessment,
    reachability,
    findings,
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const scanResult = await client.query(
            `
            INSERT INTO scans (
                target_url,
                score,
                risk_level,
                total_findings,
                response_time,
                status_code
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                target,
                assessment.score,
                assessment.riskLevel,
                assessment.totalFindings,
                reachability.responseTime,
                reachability.statusCode,
            ]
        );

        const scan = scanResult.rows[0];

        for (const finding of findings) {
            await client.query(
                `
                INSERT INTO findings (
                    scan_id,
                    name,
                    severity,
                    category,
                    description,
                    recommendation
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [
                    scan.id,
                    finding.name,
                    finding.severity,
                    finding.category || null,
                    finding.description || null,
                    finding.recommendation || null,
                ]
            );
        }

        await client.query("COMMIT");

        return scan;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
}

async function getAllScans() {
    const result = await pool.query(`
        SELECT
            id,
            target_url,
            score,
            risk_level,
            total_findings,
            response_time,
            status_code,
            created_at
        FROM scans
        ORDER BY created_at DESC
    `);

    return result.rows;
}

async function getScanById(scanId) {
    const scanResult = await pool.query(
        `
        SELECT *
        FROM scans
        WHERE id = $1
        `,
        [scanId]
    );

    if (scanResult.rows.length === 0) {
        return null;
    }

    const findingResult = await pool.query(
        `
        SELECT *
        FROM findings
        WHERE scan_id = $1
        ORDER BY id ASC
        `,
        [scanId]
    );

    return {
        ...scanResult.rows[0],
        findings: findingResult.rows,
    };
}

module.exports = {
    saveScan,
    getAllScans,
    getScanById,
};