import React, { useState, useEffect } from "react";
import axios from 'axios';

require("dotenv").config({ path: "./.env" });

export default function Products(props) {
  const [products, setProducts] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const baseURL = process.env.REACT_APP_SERVER_URL;
    axios.get(new URL("/products", baseURL))
      .then(response => {
        setProducts(response.data);
      });
  },[]);

  const handleChange = async (event) => {
    const selected = products.find(object => object.description === event.target.value)
    let desc;
    let price;
    if(selected) {
      desc = selected.description;
      price = selected.price;
    }
    else {
      desc = '';
      price = 0;
    }

    setDescription(desc);
    props.onProductSelection(desc, price);
  };

  return (
    <div>
      <ul className="ProductList">
        { products ? products.map(item => 
          <li key={item.description}>{item.description}</li>
        ) : ""}
      </ul>
      <h2>What kind of edit do you need?</h2>
      <form className="ProductForm" id="prodcut-form">
        <select value={description ? description : ''} className="ProductSelectInput" onChange={handleChange}>
          <option value='' key='none'>Select an Edit</option>
          {products ? products.map(item => <option value={item.description} key={item.description}>{item.description}</option>) : null}
        </select>
      </form>
    </div>
  );
}
