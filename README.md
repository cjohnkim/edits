# Overview

This is a working demonstration of a stripe PaymentsIntent integration built with a [Custom Payment Flow](https://stripe.com/docs/payments/integration-builder).

In this simple ecommerce application, a seller provides editing services. Purchasers can select the editing service they'd like and make a payment to hire an editor. 

The application is a demonstration of the integration and does not actually provide editing services. 

Purchases are logged to a `payments.log` file in the projects root directory.

![Screenshot](/screenshot.png?raw=true "Screenshot")

# About
* This app was bootstrapped with the Custom Payment Flow Example Download provided on stripe's [Accept a Payment Integration Builder](https://stripe.com/docs/payments/integration-builder)
  * Platform: Web
  * Frontend: React
  * Backend: Node
* Code from public projects and examples were leveraged for guidance. Most notably: 
  * [KMWoley](https://github.com/kmwoley/stripe-pm-exercise)

# Development
* This app was developed on a Mac OS 11.0.1 running `NodeJS 10.16.0`.
* Due to resource constraints (XCode would not update) and [issues opening Stripe CLI directly](https://github.com/stripe/stripe-cli/issues/336), I tested the webhook implementation by running ngrok and directing the webhook to my ngrok endpoint. 

#Install
To start, clone this repo e.g. `git clone https://github.com/cjohnkim/edits.git`.

## Server Setup
* Copy the `.env.example` file as `.eng` and place it in the project root directroy. 
* In your `.env` file, replace the `REACT_APP_STRIPE_PUBLISHABLE_KEY` value with [your key](https://stripe.com/docs/keys). 
* Open a terminal window and go to the root directory of the project .
* Run `npm install`.

*Note: In my experience running npm install may not install all required packages. You may need to specifically install packages like:*

```
axios
cors
express
yarn
order-id
```

* While still in the root directory of the project, run `npm start`.
* If all goes well, you'll see messages in your terminal indicating the the server started successfully, listening on port 4242.
  * If you receive an error like `ReferenceError: express is not defined`, then you may need to install a node package.

## Stripe CLI
To test logging to the `payments.log` file via the webhook, you might try installing the [Stripe SLI](https://stripe.com/docs/cli) 

1. Once installed, run `stripe listen --forward-to http://localhost:4242/webhook`



# How to run
There three components which must be running for the project to work: the server, the client, and the Stripe CLI. Each must be running at the same time, in their own terminal window.

## Run the Server
1. Open a new terminal and navigate to the `/server` directory
1. Run `npm start`

## Run the Stripe CLI
1. Open a new terminal
1. Run `stripe listen --forward-to http://localhost:4242/webhook`

## Run the Client
1. Open a new terminal and navigate to the `/client` directory
1. Run `npm start`

At this time, your browser should launch to [http://localhost:3000](http://localhost:3000). If it does not, navigate to the page manually.

# Usage
Stripe provides [test Credit Card numbers](https://stripe.com/docs/payments/accept-a-payment#web-test-integration) to demonstrate the various payment success/failure conditions. Use these Credit Cards to complete a payment.

The Server logs relevant payment activity (intent creation, order information, success/failure, and payment intent events) in the `/server` directory in `payments.log`
