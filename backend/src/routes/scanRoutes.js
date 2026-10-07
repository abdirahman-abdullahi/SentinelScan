const express = require("express");
const { scanWebsite,
        getScanHistory,
        getSingleScan,
 } = require("../controllers/scanController");

const router = express.Router();

router.post("/", scanWebsite);

router.get("/history", getScanHistory);

router.get("/:id", getSingleScan);


module.exports = router;