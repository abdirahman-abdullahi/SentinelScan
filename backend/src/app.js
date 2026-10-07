require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const scanRoutes = require("./routes/scanRoutes");



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "SentinelScan API is running"
    });
});

app.use("/api/scan", scanRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`SentinelScan API running on port ${PORT}`);
});