import axios from "axios";
import crypto from "crypto";
export const newPayment = async (req, res) => {
  try {
    const merchantTransactionId = "MT7850590068188104"; //req.body.transactionId;
    const data = {
      merchantId: "PGTESTPAYUAT",
      merchantTransactionId: merchantTransactionId,
      merchantUserId: "MUID123",
      name: req.body.name,
      amount: req.body.amount * 100,
      callbackUrl: "https://iksaa.in/order/confirm",
      redirectUrl: `https://iksaa.in/order/confirm`,
      redirectMode: "GET",
      mobileNumber: req.body.number,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const string = payloadMain + "/pg/v1/pay" + key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
    // prod "https://api.phonepe.com/apis/hermes/pg/v1/pay"
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        return res
          .status(200)
          .json(response.data.data.instrumentResponse.redirectInfo.url);
        return res.redirect();
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

export const checkStatus = async (req, res) => {
  console.log("hello");
  const merchantTransactionId = "MT7850590068188104";
  const merchantId = "PGTESTPAYUAT";

  const keyIndex = 1;
  const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + key;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const options = {
    method: "GET",
    url: `https://api.phonepe.com/apis/hermes/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`, //`https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  // CHECK PAYMENT TATUS
  axios
    .request(options)
    .then(async (response) => {
      console.log(response.data);
      if (response.data.success === true) {
        const url = `http://localhost:3000/order/confirm`;
        return res.redirect(url);
      } else {
        const url = `http://localhost:3000/order/confirm`;
        return res.redirect(url);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
