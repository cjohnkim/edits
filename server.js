const express = require("express");
// const app = express();
const { resolve } = require("path");
// This is your real test secret API key.
const stripe = require("stripe")("sk_test_51HxMHTKk2PsQrz8J8ygOOZnlDg1omFDVp2zfwMUXoGQAhqhXyTzXOuF0SVW0QWtqgHf2E0XxlF1XiRlDl16wa0TT00DUNr2hrC");
const app = require('express')();
// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

// create log of payments
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath:'payments.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
log = SimpleNodeLogger.createSimpleLogger( opts );


app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  let event;
  try {
    event = JSON.parse(request.body);
  } catch (err) {
    console.log(`⚠️  Webhook error while parsing basic request.`, err.message);
    return response.send();
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      log.info("[PAYMENT INTENT SUCCESS: ", paymentIntent.id, " AMOUNT: ", paymentIntent.amount, "]");  
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

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
