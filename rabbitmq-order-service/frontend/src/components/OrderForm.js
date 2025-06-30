import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [form, setForm] = useState({ customer: '', items: '', total: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitOrder = async () => {
    const payload = {
      customer: form.customer,
      items: form.items.split(','),
      total: parseFloat(form.total),
    };
    await axios.post('http://localhost:5000/api/order', payload);
    alert('Order placed!');
  };

  return (
    <div>
      <input name="customer" onChange={handleChange} placeholder="Customer" />
      <input name="items" onChange={handleChange} placeholder="Item1,Item2" />
      <input name="total" onChange={handleChange} placeholder="Total" />
      <button onClick={submitOrder}>Submit Order</button>
    </div>
  );
};

export default OrderForm; 