const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API1_URL = "http://api.apnabazarapp.in/WebAPI/V2/get_outstanding.php";
const LEDGER_API_URL = "http://api.apnabazarapp.in/WebAPI/V2/get_account_ledger.php"; // Ledger API

// ✅ Proxy route to fetch dues from both APIs
app.post("/fetchDues", async (req, res) => {
  try {
    const requestData = {
      Username: "9507388931",
      Password: "12345678",
    };

    // Call both APIs in parallel
    const [response1, response2] = await Promise.all([
      axios.post(API1_URL, requestData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
      axios.post(API2_URL, requestData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
    ]);

    // Merge both responses
    const mergedData = {
      statuscode: 200,
      result: [...(response1.data.result || []), ...(response2.data.result || [])],
    };

    res.json(mergedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Proxy route to fetch ledger data
app.post("/fetchLedger", async (req, res) => {
  try {
    const { Username, Password, ERP_Code, Start_date, End_date, Pdc } = req.body;

    const response = await axios.post(
      LEDGER_API_URL,
      new URLSearchParams({
        Username,
        Password,
        ERP_Code,
        Start_date,
        End_date,
        Pdc: Pdc || "Y", // Default to "Y" if not provided
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
