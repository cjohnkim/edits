const express = require("express");
// const app = express();
const { resolve } = require("path");
// This is your real test secret API key.
const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = require('express')();
// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');
var cors = require('cors')

// create log of payments
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath:'payments.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
log = SimpleNodeLogger.createSimpleLogger( opts );

// list of product available for sale
// note: in production, this would come from a DB
const products = [
  { description: "100 words for $100", price: 100.00 },
  { description: "500 words for $400", price: 400.00 },
  { description: "1000 words for $800", price: 800.00 },
  { description: "1 hour of co-editing $1000", price: 1000.00 },
];


app.use(cors())

// app.get('/products', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for all origins!'})
// })

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})

// return list of products offered and their prices
app.get("/products", cors(), (req, res, next) => {
  res.send(JSON.stringify(products));
});

// confirm that the item requested exists,
// and is the price that the customer expects to pay
function validatePurchaseAndPrice(description, price) {
  const selected = products.find(object => object.description === description);
  if(selected && selected.price === price) {
    return selected.price * 100;
  }
  else {
    return 0;
  }
}


app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  let event;
  try {
    event = JSON.parse(request.body);
  } catch (err) {
    console.log(`⚠️  Webhook error while parsing basic request.`, err.message);
    return response.send();
  }

  const orderId = event.data.object.metadata.orderId;
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      log.info("[webhook] OrderId: ", orderId, " Payment captured.");
      break;
    case 'payment_intent.payment_failed':
      log.info("[webhook] OrderId: ", orderId, " Payment failed.");
      break;    
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
    
app.use(express.static("."));
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
  const { description, price, currency, name, email } = req.body;
  const amount = validatePurchaseAndPrice(description, price);

  if(amount > 0) {
    // generate an orderId to track the order, present to the user
    const orderIdGenerator = require('order-id')(process.env.ORDERID_SECRET);
    const orderId = orderIdGenerator.generate();
 
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: {
        // Testing: verify Stripe integration in this guide by including this parameter
        integration_check: 'accept_a_payment',
        orderId: orderId
      }
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      clientSecret: paymentIntent.client_secret,
      orderId: orderId,
      error: ''
    });

    log.info("[create-payment-intent] SUCCESS OrderId: ", orderId, " Payment: ", req.body);
  }
  else {
    const errorString = "[create-payment-intent] FAIL requested product not found or price mismatch.";
    log.error(errorString);
    res.status(500);
    res.send({error: errorString});
  }
});




//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: "usd"
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret
//   });
// });

app.listen(4242, () => console.log('Node server listening on port 4242!'));
