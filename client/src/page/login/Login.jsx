import React, { useState } from 'react';
import { FaEnvelope, FaKey, FaCheck } from 'react-icons/fa';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const axiosCommon = useAxiosCommon();
  const [credential, setCredential] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosCommon.post('/login', {
        credential,
        pin,
      });

      setLoading(false);

      console.log('Login response:', response); // Check the response object in console

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: response.data.message || 'Invalid credentials',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      setLoading(false);
      console.error('Error logging in:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: 'An error occurred while logging in. Please try again later.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white max-w-md w-full rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Login to Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="credential" className="block text-gray-800 text-sm mb-2">
                <FaEnvelope className="inline-block mr-2" />
                Email or Mobile Number
              </label>
              <input
                type="text"
                id="credential"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md focus:outline-none focus:ring-indigo-500"
                placeholder="Enter email or mobile number"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="pin" className="block text-gray-800 text-sm mb-2">
                <FaKey className="inline-block mr-2" />
                PIN
              </label>
              <input
                type="password"
                id="pin"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md focus:outline-none focus:ring-indigo-500"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength="5"
                required
              />
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-800">
                <FaCheck className="inline-block mr-1" />
                Remember me
              </label>
            </div>
            <div>
              <button
                type="submit"
                className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-50 cursor-wait' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
