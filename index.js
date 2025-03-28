const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DUES_API_URL = "http://api.apnabazarapp.in/WebAPI/V2/get_outstanding.php";
const LEDGER_API_URL = "http://api.apnabazarapp.in/WebAPI/V2/get_account_ledger.php"; // Ledger API
const VOUCHER_API_URL = "http://api.apnabazarapp.in/WebAPI/V2/add_accountingvoucher.php";
const INVENTORY_VOUCHER_API_URL = "http://api.apnabazarapp.in/WebAPI/V2/add_inventoryvoucher.php"; // ✅ Inventory Voucher API
const FETCHMASTERDATA = "http://api.apnabazarapp.in/WebAPI/V2/get_accounts.php";

// ✅ Proxy route to fetch dues
app.post("/fetchDues", async (req, res) => {
  try {
    const requestData = {
      Username: "9507388931",
      Password: "12345678",
    };

    // Call the dues API
    const response = await axios.post(DUES_API_URL, requestData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/fetchMasterData", async (req, res) => {
  try {
    const requestData = {
      Username: "9507388931",
      Password: "12345678",
    };

    // Call the dues API
    const response = await axios.post(FETCHMASTERDATA, requestData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Proxy route to fetch ledger data
app.post("/fetchLedger", async (req, res) => {
  try {
    const { ERP_Code, Start_date, End_date, Pdc } = req.body;

    const response = await axios.post(
      LEDGER_API_URL,
      new URLSearchParams({
        Username: "9507388931",
      Password: "12345678",
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




// ✅ Proxy route to add an accounting voucher
app.post("/addAccountingVoucher", async (req, res) => {
  try {
    const { Act_code, Cash_bank_code, Tran_date, Vchtype, Narration, Voucher_amt } = req.body;

    const requestData = new URLSearchParams({
      Username: "9507388931",
      Password: "12345678",
      Act_code,
      Cash_bank_code,
      Tran_date,
      Vchtype,
      Narration,
      Voucher_amt,
    });

    const response = await axios.post(VOUCHER_API_URL, requestData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ NEW: Proxy route to add an inventory voucher
app.post("/addInventoryVoucher", async (req, res) => {
  try {
    const {
      Act_code,
      Tran_date,
      Vchtype,
      VoucherNo,
      Narration,
      Voucher_amt,
      Transport,
      Vehicle_no,
      Station,
      Grdate,
      Grno,
      Item_data, // JSON string of item details
    } = req.body;

    const requestData = new URLSearchParams({
      Username: "9507388931",
      Password: "12345678",
      Act_code,
      Tran_date,
      Vchtype,
      VoucherNo,
      Narration,
      Voucher_amt,
      Transport,
      Vehicle_no,
      Station,
      Grdate,
      Grno,
      Item_data,
    });

    const response = await axios.post(INVENTORY_VOUCHER_API_URL, requestData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
