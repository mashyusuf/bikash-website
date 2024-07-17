import React, { useState } from 'react';
import axios from 'axios';

const CashOut = () => {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [agentId, setAgentId] = useState('');
  const [message, setMessage] = useState('');

  const handleCashOut = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage after login
      const response = await axios.post(
        'http://localhost:8000/api/cashout',
        { amount, pin, agentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during cash-out:', error);
      setMessage('Error during cash-out. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Cash Out</h2>
        <form onSubmit={handleCashOut}>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2">Amount:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pin" className="block mb-2">PIN:</label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="agentId" className="block mb-2">Agent ID:</label>
            <input
              type="text"
              id="agentId"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Cash Out
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default CashOut;
