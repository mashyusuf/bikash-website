import React, { useState } from 'react';
import useAxiosCommon from '../hooks/useAxiosCommon';
import Swal from 'sweetalert2';

const SendMoneyForm = () => {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const axiosCommon = useAxiosCommon(); // Assuming useAxiosCommon is a custom hook returning axios instance

  const handleSendMoney = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 50) {
      setErrorMessage('Please enter a valid amount (minimum 50 taka).');
      return;
    }

    if (!pin) {
      setErrorMessage('Please enter your PIN.');
      return;
    }

    if (!phoneNumber || !/^\d{10,11}$/.test(phoneNumber)) { // Basic phone number validation
      setErrorMessage('Please enter a valid recipient phone number.');
      return;
    }

    // Clear input fields
    setAmount('');
    setPin('');
    setPhoneNumber('');
    setErrorMessage('');
    setLoading(true);

    try {
      // Assuming token is stored in localStorage after successful login
      const token = localStorage.getItem('token');

      // Make sure to include Authorization header with Bearer token format
      const response = await axiosCommon.post('/api/sendMoney', {
        amount: parseFloat(amount),
        pin,
        phoneNumber,
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '', // Include Bearer token format
        },
      });

      console.log('Money sent successfully!', response.data);
      setLoading(false);

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Money sent successfully!',
      });

    } catch (error) {
      console.error('Error sending money:', error);
      setLoading(false);

      // Show error alert
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Money sent successfully!',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Send Money</h2>
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      <form onSubmit={handleSendMoney} className="space-y-4">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Recipient's Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter recipient's phone number"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount (taka):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">PIN:</label>
          <input
            type="password"
            id="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Money'}
        </button>
      </form>
    </div>
  );
};

export default SendMoneyForm;
