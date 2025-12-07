const crypto = require("crypto");
const Payment = require("../models/paymentModel");
const Admission = require("../models/admissionModel");

// AES ECB encrypt
function encrypt(text, key) {
  const cipher = crypto.createCipheriv("aes-128-ecb", Buffer.from(key), null);
  cipher.setAutoPadding(true);
  return cipher.update(text, "utf8", "base64") + cipher.final("base64");
}

// 1: INITIATE PAYMENT
// (Generate URL)

exports.initiatePayment = async (req, res) => {
  try {
    const { admissionId, amount } = req.body;

    const merchantId = process.env.EZ_MERCHANT_ID;
    const subMerchantId = process.env.EZ_SUB_MERCHANT_ID;
    const encryptionKey = process.env.EZ_ENCRYPTION_KEY;
    const paymode = process.env.EZ_PAYMODE;
    const returnUrl = process.env.EZ_RETURN_URL;

    const referenceNo = `ADM_${Date.now()}_${admissionId}`;

    await Payment.create({
      userId: req.user._id,
      admissionId,
      amount,
      status: "pending",
      referenceNo,
    });

    const mandatory = `${referenceNo}|${subMerchantId}|${amount}`;

    const encMandatory = encrypt(mandatory, encryptionKey);
    const encAmount = encrypt(String(amount), encryptionKey);
    const encRef = encrypt(referenceNo, encryptionKey);
    const encSub = encrypt(subMerchantId, encryptionKey);
    const encReturn = encrypt(returnUrl, encryptionKey);
    const encPaymode = encrypt(paymode, encryptionKey);

    const url =
      `${process.env.EZ_BASE_URL}?merchantid=${merchantId}` +
      `&mandatoryfields=${encMandatory}` +
      `&optionalfields=` +
      `&returnurl=${encReturn}` +
      `&ReferenceNo=${encRef}` +
      `&submerchantid=${encSub}` +
      `&transactionamount=${encAmount}` +
      `&paymode=${encPaymode}`;

    return res.json({ url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed" });
  }
};

// 2: CALLBACK
exports.iciciCallback = async (req, res) => {
  const {
    Response_Code,
    Reference_No,
    TxnStatus,
    TxnAmount,
    EazyPay_Bank_Ref_No,
  } = req.body;

  const success = Response_Code === "E000" && TxnStatus === "Success";

  const record = await Payment.findOne({ referenceNo: Reference_No });

  if (!record) return res.send("Invalid reference");

  if (success) {
    await Payment.findByIdAndUpdate(record._id, {
      status: "success",
      txnAmount: TxnAmount,
      bankRef: EazyPay_Bank_Ref_No,
    });

    await Admission.findByIdAndUpdate(record.admissionId, {
      "payment.status": "Success",
      "payment.transactionId": EazyPay_Bank_Ref_No,
      "payment.paidAt": new Date(),
    });

    return res.send("<h2>Payment Successful</h2>");
  }

  await Payment.findByIdAndUpdate(record._id, {
    status: "failed",
  });

  return res.send("<h2>Payment Failed</h2>");
};
