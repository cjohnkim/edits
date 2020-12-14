# Overview

This is a working demonstration of a stripe PaymentsIntent integration built with a [Custom Payment Flow](https://stripe.com/docs/payments/integration-builder).

In this simple ecommerce application, a seller provides editing services. Purchasers can select the editing service they'd like and make a payment to hire an editor. 

The application is a demonstration of the integration and does not actually provide editing services. 

Purchases are logged to a `payments.log` file in the projects root directory.

![Screenshot](/screenshot.png?raw=true "Screenshot")

# about
* This app was bootstrapped with the Custom Payment Flow Example Download provided on stripe's [Accept a Payment Integration Builder](https://stripe.com/docs/payments/integration-builder)
  * Platform: Web
  * Frontend: React
  * Backend: Node
* Code from public projects and examples were leveraged for guidance. Most notably: 
  * [KMWoley](https://github.com/kmwoley/stripe-pm-exercise)

# project development
* This app was developed on a Mac OS 11.0.1 running `NodeJS 10.16.0`.
* Due to resource constraints (XCode would not update) and [issues opening Stripe CLI directly](https://github.com/stripe/stripe-cli/issues/336), I tested the webhook implementation by running ngrok and directing the webhook to my ngrok endpoint. 

# setup
To start, clone this repo e.g. `git clone https://github.com/cjohnkim/edits.git`.

## .env configuration
* Copy the `.env.example` file and rename it `.env`
  * Note: Ensure that your `.env` file is ignored in any repo commits. This file will hold your stripe secret key.
* Replace the example values in the file with your actual [stripe keys](https://stripe.com/docs/keys). 
* You can leave the REACT_APP_SERVER_URL as is unless you've changed this elsewhere.

## node modules
* Open a terminal window and go to the root directory of the project.
* Run `npm install`.

*Note: In my experience running npm install may not install all required modules. You may need to specifically install modules like:*

```
axios
cors
express
yarn
order-id
```

## start server
* From your terminal, in the root directory where your `server.js` file lives, run `npm start`.
* If all goes well, you'll see messages in your terminal indicating the the server started successfully and is listening on port 4242.
  * If you see an error like `ReferenceError: express is not defined`, then you may need to install a node package.

## logging
* This project logs payment creations from the server as well as successful payments calls from stripe to a webhook endpoint.
* You can view log entries in the `payments.log` file in the root directory of the project.

## webhooks

### stripe cli

To test webhook calls, you can install the [Stripe SLI](https://stripe.com/docs/cli) and initiate calls from your terminal. I did not have luck with this for #reasons (xcode wouldn't install which blocked updating homebrew which blocked downloading via a package manager, ran into issues with the direct download of the stripe cli due to being on a mac (or due to my lack of understanding on usage)).

Here's the stripe docs page for using the stripe cli to [listen to webhook events](https://stripe.com/docs/stripe-cli/webhooks). but I have not been able to validate these steps myself.

* You might try starting with: `stripe listen --forward-to http://localhost:4242/webhook`

### ngrok

Alternatively, you can use [ngrok](https://ngrok.com/) to publicly expose your localhost server. 

* After you've installed ngrok, open your Terminal and start ngrok with: `ngrok http 3000 -host-header="localhost:3000"`
* In the ngrok console in your Terminal, you'll see public url's that will forward to your local server.
  * Note: By default this url will be expire after 8 hours.
* Copy the forwarding url provided to you by ngrok, something like: `http://9853bd6f75de.ngrok.io` and go to the stripe Developers [webhooks page](https://dashboard.stripe.com/test/webhooks).
* Click "Add endpoint"
* In "Endpoint URL" insert the ngrok forwarding url followed by `/webhook`
  * In our ngrok URL example above, we'd use: `http://9853bd6f75de.ngrok.io/webhook`
* In "Events to Send" section, you can click the `receive all events` link in the input area.
* Click "Add Endpoint".

Events that start a webhook call should now be directed to your ngrok URL which in turn should call your local servers `/webhook` endpoint.

# run!

The fun part... finally!

* Run ngrok with your stripe account sending webhook events to your ngrok URL
* From the root directory of the project run `npm start`
* Your browser should launh [http://localhost:3000](http://localhost:3000). If it doesn't, go there manually.

## make a purchase

As a reminder, this is a demo app and you cannot actually purchase edits.

To test purchases, you can use [test cards from stripe](https://stripe.com/docs/payments/accept-a-payment#web-test-integration)

Different card numbers will trigger different payment outcomes. `4242 4242 4242 4242` will bring you to the land of success. Make sure to use an expiration date that is in the future. CVV and Zip code will accept anything you'd like to enter.

# thank you!

Thanks for taking the time to read all the way to the end!
