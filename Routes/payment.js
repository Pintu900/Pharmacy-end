const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
require('dotenv').config()

const router = express.Router();

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_SECRET_KEY,
});
router.post('/create/orderid', (req, res) => {
  var options = {
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "orrcptid_11"
  };
  instance.orders.create(options, function(err, order) {
    console.log(order);
    res.send({ orderId: order.id });
  });
})

router.post("/api/payment/verify", (req, res) => {

  let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto.createHmac('sha256', 'YyWVUALJ6uDboAE2wIcUqz0O')
    .update(body.toString())
    .digest('hex');
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { "signatureIsValid": "false" }
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { "signatureIsValid": "true" }
  res.send(response);
});

module.exports = router;