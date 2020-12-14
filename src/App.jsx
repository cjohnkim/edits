import React, { useState} from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Products from "./Products";
import "./App.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
require("dotenv").config({ path: "./.env" });
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function App() {

  const [productPrice, setProductPrice] = useState(0);
  const [productDescription, setProductDescription] = useState('');

  const handleProductSelection = (description, price) => {
    setProductPrice(price);
    setProductDescription(description);
  }

  return (
    <div className="App">
      <div id="product">
        <h1>Purchase Edits</h1>
        <h2>Get help with important messages before you hit send</h2>
        <div className="Products">
          <Products onProductSelection={handleProductSelection}/>
        </div>
      </div>        
        <div className="CardForm">
          <Elements stripe={stripePromise}>
            <CheckoutForm price={productPrice} description={productDescription}/>
          </Elements>
        </div>
    </div>
  );
}
