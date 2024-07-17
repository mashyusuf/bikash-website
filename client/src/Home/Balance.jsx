

import  { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you use Axios for HTTP requests

const Balance = () => {
    const [balance, setBalance] = useState(null); // State to hold balance data

    useEffect(() => {
        // Function to fetch balance data
        const fetchBalance = async () => {
            try {
                // Make a GET request to your backend API to fetch balance
                const response = await axios.get('/api/balance'); // Adjust URL as per your backend route
                setBalance(response.data.balance); // Assuming response.data.balance contains balance amount
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance(); // Call fetchBalance function when component mounts
    }, []);

    return (
        <div>
            <h2>Your Current Balance:</h2>
            {balance !== null ? (
                <p>{balance} Taka</p> // Display balance if it's fetched successfully
            ) : (
                <p>Loading...</p> // Display loading message while fetching balance
            )}
        </div>
    );
};

export default Balance;
